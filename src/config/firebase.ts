import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqLS_T5vVXB-9Xmst7ja8zji-1YRZc7Qo",
  authDomain: "moklik-46048.firebaseapp.com",
  projectId: "moklik-46048",
  storageBucket: "moklik-46048.firebasestorage.app",
  messagingSenderId: "1087303206769",
  appId: "1:1087303206769:web:50bec1d9a64e04038798d0",
  measurementId: "G-70NNTKKEV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Storage
export const storage = getStorage(app);

export default app;