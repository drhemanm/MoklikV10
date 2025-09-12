// Updated for deployment

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.paypalWebhook = functions.https.onRequest(async (req, res) => {
  console.log('PayPal webhook received:', req.body);
  
  // Handle PayPal subscription events here
  const event = req.body;
  
  if (event.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
    console.log('Payment completed for subscription:', event.resource.id);
  }
  
  res.status(200).send('OK');
});
