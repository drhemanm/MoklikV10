import { doc, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserSubscription {
  userId: string;
  subscriptionStatus: 'free_trial' | 'active' | 'expired' | 'cancelled';
  subscriptionPlan: 'free' | 'monthly' | 'yearly';
  trialStartDate: Date;
  trialEndDate: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  paypalSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionService {
  
  /**
   * Initialize subscription for new user (1-month free trial)
   */
  static async initializeUserSubscription(userId: string): Promise<UserSubscription> {
    console.log('🔄 STARTING: Initializing subscription for user:', userId);
    
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

    console.log('📅 DATES:', { 
      now: now.toISOString(), 
      trialEndDate: trialEndDate.toISOString(),
      daysFromNow: Math.ceil((trialEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    });

    const subscription: UserSubscription = {
      userId,
      subscriptionStatus: 'free_trial',
      subscriptionPlan: 'free',
      trialStartDate: now,
      trialEndDate,
      createdAt: now,
      updatedAt: now
    };

    console.log('📝 SUBSCRIPTION OBJECT:', subscription);

    try {
      console.log('💾 SAVING to Firebase...');
      
      await setDoc(doc(db, 'subscriptions', userId), {
        ...subscription,
        trialStartDate: Timestamp.fromDate(subscription.trialStartDate),
        trialEndDate: Timestamp.fromDate(subscription.trialEndDate),
        createdAt: Timestamp.fromDate(subscription.createdAt),
        updatedAt: Timestamp.fromDate(subscription.updatedAt)
      });

      console.log('✅ SUCCESS: Subscription initialized successfully for user:', userId);
      return subscription;
    } catch (error) {
      console.error('❌ ERROR: Failed to initialize subscription:', error);
      throw new Error('Failed to initialize subscription');
    }
  }

  /**
   * Get user's current subscription status
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
      
      if (!subscriptionDoc.exists()) {
        return null;
      }

      const data = subscriptionDoc.data();
      
      return {
        userId: data.userId,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionPlan: data.subscriptionPlan,
        trialStartDate: data.trialStartDate.toDate(),
        trialEndDate: data.trialEndDate.toDate(),
        subscriptionStartDate: data.subscriptionStartDate?.toDate(),
        subscriptionEndDate: data.subscriptionEndDate?.toDate(),
        paypalSubscriptionId: data.paypalSubscriptionId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw new Error('Failed to get subscription');
    }
  }

  /**
   * Check if user has active access (trial or paid)
   */
  static async hasActiveAccess(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return false;
      }

      const now = new Date();

      // Check if in free trial period
      if (subscription.subscriptionStatus === 'free_trial') {
        return now <= subscription.trialEndDate;
      }

      // Check if has active paid subscription
      if (subscription.subscriptionStatus === 'active' && subscription.subscriptionEndDate) {
        return now <= subscription.subscriptionEndDate;
      }

      return false;
    } catch (error) {
      console.error('Error checking active access:', error);
      return false;
    }
  }

  /**
   * Upgrade user from trial to paid subscription
   */
  static async upgradeToSubscription(
    userId: string, 
    plan: 'monthly' | 'yearly',
    paypalSubscriptionId: string
  ): Promise<void> {
    try {
      const now = new Date();
      let subscriptionEndDate: Date;

      if (plan === 'monthly') {
        subscriptionEndDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      } else {
        subscriptionEndDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 365 days
      }

      await updateDoc(doc(db, 'subscriptions', userId), {
        subscriptionStatus: 'active',
        subscriptionPlan: plan,
        subscriptionStartDate: Timestamp.fromDate(now),
        subscriptionEndDate: Timestamp.fromDate(subscriptionEndDate),
        paypalSubscriptionId,
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw new Error('Failed to upgrade subscription');
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string): Promise<void> {
    try {
      const now = new Date();
      
      await updateDoc(doc(db, 'subscriptions', userId), {
        subscriptionStatus: 'cancelled',
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Mark subscription as expired (for automated checks)
   */
  static async markAsExpired(userId: string): Promise<void> {
    try {
      const now = new Date();
      
      await updateDoc(doc(db, 'subscriptions', userId), {
        subscriptionStatus: 'expired',
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Error marking subscription as expired:', error);
      throw new Error('Failed to mark subscription as expired');
    }
  }

  /**
   * Get subscription status summary for UI
   */
  static async getSubscriptionSummary(userId: string): Promise<{
    hasAccess: boolean;
    status: string;
    plan: string;
    daysRemaining: number;
    isTrialUser: boolean;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return {
          hasAccess: false,
          status: 'No Subscription',
          plan: 'none',
          daysRemaining: 0,
          isTrialUser: false
        };
      }

      const now = new Date();
      const hasAccess = await this.hasActiveAccess(userId);
      
      let daysRemaining = 0;
      let endDate: Date;

      if (subscription.subscriptionStatus === 'free_trial') {
        endDate = subscription.trialEndDate;
      } else if (subscription.subscriptionEndDate) {
        endDate = subscription.subscriptionEndDate;
      } else {
        endDate = now;
      }

      if (hasAccess) {
        daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      }

      return {
        hasAccess,
        status: subscription.subscriptionStatus,
        plan: subscription.subscriptionPlan,
        daysRemaining,
        isTrialUser: subscription.subscriptionStatus === 'free_trial'
      };
    } catch (error) {
      console.error('Error getting subscription summary:', error);
      return {
        hasAccess: false,
        status: 'Error',
        plan: 'none',
        daysRemaining: 0,
        isTrialUser: false
      };
    }
  }

  /**
   * Handle existing users - transition them to trial period
   */
  static async transitionExistingUser(userId: string): Promise<UserSubscription> {
    try {
      // Check if user already has subscription
      const existing = await this.getUserSubscription(userId);
      if (existing) {
        return existing;
      }

      // Initialize free trial for existing user
      return await this.initializeUserSubscription(userId);
    } catch (error) {
      console.error('Error transitioning existing user:', error);
      throw new Error('Failed to transition existing user');
    }
  }

  /**
   * Delete user account and all associated subscription data
   */
  static async deleteUserAccount(userId: string): Promise<void> {
    try {
      // Delete subscription data
      await deleteDoc(doc(db, 'subscriptions', userId));
      
      // Note: You may also want to delete other user data collections
      // Example: chat history, progress data, etc.
      // await deleteDoc(doc(db, 'userProgress', userId));
      // await deleteDoc(doc(db, 'chatHistory', userId));
      // await deleteDoc(doc(db, 'userAchievements', userId));
      
      console.log('User subscription data deleted successfully');
    } catch (error) {
      console.error('Error deleting user subscription data:', error);
      throw new Error('Failed to delete subscription data');
    }
  }
}
