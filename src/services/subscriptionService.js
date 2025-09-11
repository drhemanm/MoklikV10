// src/services/subscriptionService.js
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

export class SubscriptionService {
  
  // Check if user is in free trial
  static async isInFreeTrial(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;
      
      const userData = userDoc.data();
      const trialEndDate = userData.trialEndDate?.toDate();
      const now = new Date();
      
      return trialEndDate && now < trialEndDate;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  }
  
  // Check if user has active subscription
  static async hasActiveSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;
      
      const userData = userDoc.data();
      const subscriptionEndDate = userData.subscriptionEndDate?.toDate();
      const now = new Date();
      
      return userData.subscriptionStatus === 'active' && 
             subscriptionEndDate && 
             now < subscriptionEndDate;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
  
  // Check if user can access platform
  static async canAccessPlatform(userId) {
    const isInTrial = await this.isInFreeTrial(userId);
    const hasSubscription = await this.hasActiveSubscription(userId);
    
    return isInTrial || hasSubscription;
  }
  
  // Get user subscription details
  static async getUserSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;
      
      const userData = userDoc.data();
      const now = new Date();
      
      return {
        status: userData.subscriptionStatus || 'trial',
        plan: userData.subscriptionPlan,
        trialEndDate: userData.trialEndDate?.toDate(),
        subscriptionEndDate: userData.subscriptionEndDate?.toDate(),
        isInTrial: await this.isInFreeTrial(userId),
        hasActiveSubscription: await this.hasActiveSubscription(userId),
        canAccess: await this.canAccessPlatform(userId),
        daysRemaining: userData.trialEndDate ? 
          Math.max(0, Math.ceil((userData.trialEndDate.toDate() - now) / (1000 * 60 * 60 * 24))) : 0
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }
}
