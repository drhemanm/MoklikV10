const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin
if (!initializeApp.length) {
  initializeApp({
    credential: require('firebase-admin').credential.cert({
      projectId: 'moklik-46048',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = getFirestore();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const paypalEvent = JSON.parse(event.body);
    console.log('PayPal webhook received:', paypalEvent.event_type);

    // Handle payment completed
    if (paypalEvent.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
      const subscriptionId = paypalEvent.resource.id;
      
      // Find user by subscription ID and update their access
      // Implementation here
      
      console.log('Payment completed for:', subscriptionId);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook processed' })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
