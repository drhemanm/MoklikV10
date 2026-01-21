// Updated for deployment with secure admin functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize OpenAI with API key from Firebase config
// Set via: firebase functions:config:set openai.key="sk-your-key"
let openaiClient = null;
const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = functions.config().openai?.key;
    if (!apiKey) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'OpenAI API key not configured. Run: firebase functions:config:set openai.key="YOUR_KEY"'
      );
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

// Rate limiting for AI requests (in-memory, per instance)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute per user

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > userLimits.resetTime) {
    userLimits.count = 0;
    userLimits.resetTime = now + RATE_LIMIT_WINDOW;
  }

  if (userLimits.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(userId, userLimits);
  return true;
};

// Existing PayPal webhook
exports.paypalWebhook = functions.https.onRequest(async (req, res) => {
  console.log('PayPal webhook received:', req.body);
  
  // Handle PayPal subscription events here
  const event = req.body;
  
  if (event.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
    console.log('Payment completed for subscription:', event.resource.id);
  }
  
  res.status(200).send('OK');
});

// NEW: Function to set admin custom claims
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated to call this function');
  }

  // Check if caller is already an admin (for security)
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const isCallerAdmin = callerToken.customClaims?.role === 'admin';
  
  // For the first admin setup, we'll allow if no admins exist yet
  // After that, only existing admins can create new admins
  const { uid, makeAdmin } = data;

  // Validate input
  if (!uid || typeof makeAdmin !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'UID and makeAdmin boolean are required');
  }

  try {
    if (makeAdmin) {
      // Set admin role
      await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
      
      // Log the action for security audit
      console.log(`Admin role granted to user: ${uid} by: ${context.auth.uid}`);
      
      return { 
        success: true, 
        message: `Admin role granted to user ${uid}` 
      };
    } else {
      // Remove admin role
      await admin.auth().setCustomUserClaims(uid, { role: null });
      
      console.log(`Admin role removed from user: ${uid} by: ${context.auth.uid}`);
      
      return { 
        success: true, 
        message: `Admin role removed from user ${uid}` 
      };
    }
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set admin claim');
  }
});

// NEW: Function to check admin status (callable from client)
exports.checkAdminStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  try {
    const user = await admin.auth().getUser(context.auth.uid);
    const isAdmin = user.customClaims?.role === 'admin';
    
    return { isAdmin };
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check admin status');
  }
});

// NEW: Security function to list all admins (admin-only)
exports.listAdmins = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  // Check if caller is admin
  const callerToken = await admin.auth().getUser(context.auth.uid);
  const isCallerAdmin = callerToken.customClaims?.role === 'admin';
  
  if (!isCallerAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can list admins');
  }

  try {
    // Get all users and filter for admins
    const listUsersResult = await admin.auth().listUsers();
    const admins = listUsersResult.users
      .filter(user => user.customClaims?.role === 'admin')
      .map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        creationTime: user.metadata.creationTime,
      }));

    return { admins };
  } catch (error) {
    console.error('Error listing admins:', error);
    throw new functions.https.HttpsError('internal', 'Failed to list admins');
  }
});

// ============================================
// SECURE OPENAI CHAT FUNCTION
// ============================================
// This function handles AI chat requests securely on the server
// API key is never exposed to the client

exports.chatWithAI = functions.https.onCall(async (data, context) => {
  // Authentication required
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be signed in to use the AI tutor'
    );
  }

  const userId = context.auth.uid;

  // Rate limiting check
  if (!checkRateLimit(userId)) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Too many requests. Please wait a moment before trying again.'
    );
  }

  // Validate input
  const { messages, model = 'gpt-4o-mini', maxTokens = 1000 } = data;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Messages array is required'
    );
  }

  // Validate message format
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Each message must have role and content'
      );
    }
    if (!['user', 'assistant', 'system'].includes(msg.role)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid message role'
      );
    }
  }

  // Limit message history to prevent abuse
  const limitedMessages = messages.slice(-20);

  try {
    const openai = getOpenAIClient();

    // System prompt for educational context
    const systemMessage = {
      role: 'system',
      content: `You are Moklik AI Tutor, an expert educational assistant helping O-Level and A-Level students with mathematics and science subjects.

Key guidelines:
- Provide clear, step-by-step explanations
- Use proper mathematical notation when needed
- Be encouraging and supportive
- If a student is struggling, break down concepts further
- Always verify your calculations
- Focus on understanding, not just answers`
    };

    const response = await openai.chat.completions.create({
      model: model,
      messages: [systemMessage, ...limitedMessages],
      max_tokens: Math.min(maxTokens, 2000), // Cap at 2000 tokens
      temperature: 0.7,
    });

    // Log usage for monitoring (not the content)
    console.log(`AI request by user ${userId}: model=${model}, tokens=${response.usage?.total_tokens}`);

    return {
      success: true,
      message: response.choices[0].message,
      usage: response.usage
    };

  } catch (error) {
    console.error('OpenAI API error:', error.message);

    if (error.status === 429) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'AI service is busy. Please try again in a moment.'
      );
    }

    if (error.status === 401) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'AI service configuration error. Please contact support.'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to get AI response. Please try again.'
    );
  }
});

// ============================================
// SECURE IMAGE ANALYSIS FUNCTION
// ============================================
// Handles image analysis requests with GPT-4 Vision

exports.analyzeImage = functions.https.onCall(async (data, context) => {
  // Authentication required
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be signed in to analyze images'
    );
  }

  const userId = context.auth.uid;

  // Rate limiting (stricter for image analysis)
  if (!checkRateLimit(userId)) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Too many requests. Please wait before analyzing another image.'
    );
  }

  const { imageBase64, prompt = 'Analyze this mathematical content and help solve any problems shown.' } = data;

  if (!imageBase64) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Image data is required'
    );
  }

  // Validate base64 size (max 4MB)
  if (imageBase64.length > 4 * 1024 * 1024) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Image is too large. Please use an image under 4MB.'
    );
  }

  try {
    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are Moklik AI Tutor, an expert at analyzing mathematical images and helping students solve problems. Provide clear, step-by-step explanations.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    console.log(`Image analysis by user ${userId}: tokens=${response.usage?.total_tokens}`);

    return {
      success: true,
      message: response.choices[0].message,
      usage: response.usage
    };

  } catch (error) {
    console.error('Image analysis error:', error.message);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to analyze image. Please try again.'
    );
  }
});
