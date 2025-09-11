// src/services/userInitializationService.ts
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  subscriptionStatus: 'free' | 'premium' | 'trial';
  trialEndDate?: any;
  lastLoginAt: any;
}

export interface SubscriptionData {
  active: boolean;
  plan: 'free' | 'monthly' | 'yearly';
  createdAt: any;
  updatedAt: any;
  trialEndDate?: any;
  paymentStatus?: 'active' | 'past_due' | 'canceled';
}

export class UserInitializationService {
  /**
   * Initialize user data when they first sign in
   */
  static async initializeUser(user: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      // Only create if user doesn't exist
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Student',
          createdAt: serverTimestamp(),
          subscriptionStatus: 'trial', // Start with 1-month trial
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          lastLoginAt: serverTimestamp()
        };
        
        await setDoc(userRef, userData);
        console.log('✅ User document created:', userData);
      } else {
        // Update last login time
        await setDoc(userRef, { 
          lastLoginAt: serverTimestamp() 
        }, { merge: true });
      }
      
      // Initialize subscription
      await this.initializeSubscription(user.uid);
      
    } catch (error) {
      console.error('❌ Error initializing user:', error);
      throw error;
    }
  }
  
  /**
   * Initialize subscription data
   */
  static async initializeSubscription(userId: string): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      // Only create if subscription doesn't exist
      if (!subscriptionDoc.exists()) {
        const subscriptionData: SubscriptionData = {
          active: true, // Trial is active
          plan: 'free',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
          paymentStatus: 'active'
        };
        
        await setDoc(subscriptionRef, subscriptionData);
        console.log('✅ Subscription document created:', subscriptionData);
      }
    } catch (error) {
      console.error('❌ Error initializing subscription:', error);
      throw error;
    }
  }
  
  /**
   * Get user count with error handling
   */
  static async getUserCount(): Promise<number> {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      return snapshot.size;
    } catch (error) {
      console.error('❌ Error fetching user count:', error);
      return 0; // Fallback to 0 instead of crashing
    }
  }
  
  /**
   * Get user subscription with error handling
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionData | null> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (subscriptionDoc.exists()) {
        return subscriptionDoc.data() as SubscriptionData;
      } else {
        // Create default subscription if it doesn't exist
        await this.initializeSubscription(userId);
        return {
          active: true,
          plan: 'free',
          createdAt: new Date(),
          updatedAt: new Date(),
          trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentStatus: 'active'
        };
      }
    } catch (error) {
      console.error('❌ Error fetching user subscription:', error);
      // Return safe default instead of crashing
      return {
        active: false,
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentStatus: 'canceled'
      };
    }
  }
}
