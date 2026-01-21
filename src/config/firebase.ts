import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
// This prevents API keys from being exposed in source code
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required Firebase config at startup
const requiredFields = ['apiKey', 'authDomain', 'projectId'] as const;
for (const field of requiredFields) {
  if (!firebaseConfig[field]) {
    console.error(`Missing required Firebase config: ${field}. Check your environment variables.`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore - Connect to the DEFAULT database where your user data exists
export const db = getFirestore(app); // This connects to (default) database, not the empty 'moklik' database

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Storage
export const storage = getStorage(app);

// Export auth functions
export { onAuthStateChanged };

export default app;
