// scripts/setup-first-admin.js - First admin setup for Netlify deployment
const admin = require('firebase-admin');
require('dotenv').config(); // Load environment variables

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
});

async function createFirstAdmin() {
  try {
    // Replace with your admin details
    const adminEmail = 'your-admin-email@example.com'; // CHANGE THIS
    const adminPassword = 'your-secure-password123!'; // CHANGE THIS - make it strong!
    const adminName = 'Moklik Admin'; // CHANGE THIS

    console.log('🚀 Creating first admin user for Moklik...');

    // Check if user already exists
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(adminEmail);
      console.log(`✅ User already exists: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create the user
        console.log('👤 Creating new user...');
        userRecord = await admin.auth().createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: adminName,
          emailVerified: true
        });
        console.log(`✅ Admin user created: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // Set admin custom claims
    console.log('🔐 Setting admin privileges...');
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'admin'
    });

    console.log('✅ Admin claims set successfully!');
    console.log('\n🎉 FIRST ADMIN SETUP COMPLETE!');
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🆔 Admin UID: ${userRecord.uid}`);
    console.log('\n🔥 You can now log into Moklik admin panel with these credentials!');
    console.log('\n⚠️  IMPORTANT: Delete this script after running to keep credentials secure!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating first admin:', error);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n💡 The email already exists. Try running the script again or use a different email.');
    }
    
    if (error.message.includes('private_key')) {
      console.log('\n💡 Check your Firebase environment variables in Netlify dashboard.');
    }
    
    process.exit(1);
  }
}

// Run the setup
console.log('🔧 Moklik Admin Setup Starting...');
console.log('📋 Using environment variables from Netlify...');
createFirstAdmin();
