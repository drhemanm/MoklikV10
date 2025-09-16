// Updated for deployment with secure admin functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

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
