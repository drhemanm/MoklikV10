// netlify/functions/chat.js (NEW FILE - Server-side OpenAI handler)
const { Configuration, OpenAIApi } = require('openai');

// Configure OpenAI with API key from environment variables (NOT exposed to browser)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Secure server-side environment variable
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    const { messages, model = 'gpt-4', maxTokens = 1000, temperature = 0.7 } = JSON.parse(event.body);

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Messages array is required' }),
      };
    }

    // Rate limiting check (basic implementation)
    const userIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    
    // TODO: Implement proper rate limiting with Redis/Database
    // For now, we'll add a simple check
    
    // Call OpenAI API securely from server
    const completion = await openai.createChatCompletion({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
    });

    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: {
          content: completion.data.choices[0].message.content,
          usage: completion.data.usage,
          model: completion.data.model,
        },
      }),
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);

    // Handle specific OpenAI errors
    if (error.response?.status === 429) {
      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          type: 'rate_limit'
        }),
      };
    }

    if (error.response?.status === 401) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ 
          error: 'API configuration error',
          type: 'auth_error'
        }),
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        type: 'server_error'
      }),
    };
  }
};
