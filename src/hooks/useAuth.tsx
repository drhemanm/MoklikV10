import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, googleProvider } from '../config/firebase.js';
import { toast as toastLib } from 'react-hot-toast';
import { SubscriptionService } from '../services/SubscriptionService';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // User signed in via redirect
          await createUserProfile(result.user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        toastLib.error('Authentication failed. Please try again.');
      }
    };

    checkRedirectResult();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toastLib.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toastLib.error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        toastLib.error('Too many failed attempts. Please try again later.');
      } else {
        toastLib.error('Failed to sign in. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create basic user profile first
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName: name || '',
        createdAt: serverTimestamp(),
        role: 'student',
        gamification: {
          level: 1,
          xp: 0,
          streak: {
            current: 0,
            longest: 0,
            lastStudyDate: serverTimestamp()
          },
          studyTime: {
            total: 0,
            daily: {},
            byTopic: {}
          },
          achievements: [],
          goals: []
        }
      });

      // Initialize subscription using SubscriptionService
      await SubscriptionService.initializeUserSubscription(userCredential.user.uid);
      
      toastLib.success('Account created successfully! 30-day free trial started!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toastLib.error('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        toastLib.error('Password is too weak');
      } else {
        toastLib.error('Failed to create account. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      try {
        // Try popup first
        const result = await signInWithPopup(auth, googleProvider);
        await createUserProfile(result.user);
        return result.user;
      } catch (popupError: any) {
        // If popup is blocked, fall back to redirect
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request') {
          
          toastLib('Redirecting to Google sign-in...');
          await signInWithRedirect(auth, googleProvider);
          return null; // Will be handled by redirect result
        }
        throw popupError;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toastLib.error('Sign in was cancelled');
      } else {
        toastLib.error('Failed to sign in with Google');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser) => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    // Create profile if it doesn't exist
    if (!userDoc.exists()) {
      // Create basic user profile
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        createdAt: serverTimestamp(),
        role: 'student',
        gamification: {
          level: 1,
          xp: 0,
          streak: {
            current: 0,
            longest: 0,
            lastStudyDate: serverTimestamp()
          },
          studyTime: {
            total: 0,
            daily: {},
            byTopic: {}
          },
          achievements: [],
          goals: []
        }
      });

      // Initialize subscription using SubscriptionService
      await SubscriptionService.initializeUserSubscription(firebaseUser.uid);
    }
  };

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      toastLib.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toastLib.error('Failed to sign out');
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
