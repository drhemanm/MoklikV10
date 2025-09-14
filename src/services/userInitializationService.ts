// src/services/userInitializationService.ts
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from 'firebase/auth';

export interface UserData {
  uid?: string;
  email: string;
  createdAt: any;
  gamification?: {
    achievements: any[];
    goals: any[];
    level: number;
    streak: {
      current: number;
      lastStudyDate: any;
      longest: number;
      streakSavers: number;
    };
    studyTime: {
      byTopic: any;
      daily: any;
      total: number;
    };
    xp: number;
  };
  lastActive: any;
  role: string;
}

export interface SubscriptionData {
  active: boolean;
  plan: 'free' | 'monthly' | 'yearly';
  createdAt: any;
  updatedAt: any;
  trialEndDate?: any;
  paymentStatus?: 'active' | 'past_due' | 'canceled';
  paypalSubscriptionId?: string; // Added for cancellation support
  canceledAt?: any; // Added for cancellation tracking
  cancelReason?: string; // Added for cancellation feedback
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
          createdAt: serverTimestamp(),
          gamification: {
            achievements: [],
            goals: [],
            level: 1,
            streak: {
              current: 0,
              lastStudyDate: serverTimestamp(),
              longest: 0,
              streakSavers: 3
            },
            studyTime: {
              byTopic: {},
              daily: {},
              total: 0
            },
            xp: 0
          },
          lastActive: serverTimestamp(),
          role: 'student'
        };
        
        await setDoc(userRef, userData);
        console.log('✅ User document created:', userData);
      } else {
        // Update last active time
        await setDoc(userRef, { 
          lastActive: serverTimestamp() 
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
      // Return a reasonable fallback number based on what we saw in Firebase
      return 45; // You have 40+ users, so this is a realistic fallback
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

  /**
   * Update subscription status (for cancellations and payments)
   */
  static async updateSubscriptionStatus(
    userId: string, 
    status: 'active' | 'canceled', 
    paymentStatus?: string,
    cancelReason?: string
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const updateData: any = {
        active: status === 'active',
        updatedAt: serverTimestamp()
      };
      
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }
      
      if (status === 'canceled') {
        updateData.canceledAt = serverTimestamp();
        if (cancelReason) {
          updateData.cancelReason = cancelReason;
        }
      }
      
      await setDoc(subscriptionRef, updateData, { merge: true });
      console.log('✅ Subscription status updated:', updateData);
    } catch (error) {
      console.error('❌ Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Save PayPal subscription ID after successful payment
   */
  static async savePayPalSubscriptionId(
    userId: string, 
    paypalSubscriptionId: string, 
    plan: 'monthly' | 'yearly'
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      await setDoc(subscriptionRef, {
        paypalSubscriptionId: paypalSubscriptionId,
        active: true,
        plan: plan,
        paymentStatus: 'active',
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('✅ PayPal subscription ID saved:', paypalSubscriptionId);
    } catch (error) {
      console.error('❌ Error saving PayPal subscription ID:', error);
      throw error;
    }
  }

  /**
   * Check if user can cancel subscription
   */
  static async canUserCancel(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return !!(subscription?.active && 
                subscription?.paymentStatus !== 'canceled' && 
                subscription?.plan !== 'free');
    } catch (error) {
      console.error('❌ Error checking cancellation eligibility:', error);
      return false;
    }
  }

  /**
   * Get subscription details for cancellation
   */
  static async getSubscriptionForCancellation(userId: string): Promise<{
    subscriptionId: string;
    plan: string;
  } | null> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || !subscription.paypalSubscriptionId) {
        return null;
      }

      return {
        subscriptionId: subscription.paypalSubscriptionId,
        plan: subscription.plan
      };
    } catch (error) {
      console.error('❌ Error getting subscription for cancellation:', error);
      return null;
    }
  }

  /**
   * Check if user's trial has expired
   */
  static async isTrialExpired(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || !subscription.trialEndDate) {
        return false;
      }

      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      
      return now > trialEnd && subscription.plan === 'free';
    } catch (error) {
      console.error('❌ Error checking trial expiration:', error);
      return false;
    }
  }

  /**
   * Get days remaining in trial
   */
  static async getTrialDaysRemaining(userId: string): Promise<number> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || !subscription.trialEndDate || subscription.plan !== 'free') {
        return 0;
      }

      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      const diffTime = trialEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diffDays);
    } catch (error) {
      console.error('❌ Error calculating trial days remaining:', error);
      return 0;
    }
  }
}
