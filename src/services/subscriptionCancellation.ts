// src/services/subscriptionCancellation.ts
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface CancellationResult {
  success: boolean;
  message: string;
  endDate?: Date;
}

export class SubscriptionCancellationService {
  
  /**
   * Cancel PayPal subscription immediately
   */
  static async cancelSubscription(userId: string, subscriptionId: string, reason?: string): Promise<CancellationResult> {
    try {
      // Step 1: Cancel with PayPal API
      const paypalCancelled = await this.cancelPayPalSubscription(subscriptionId, reason);
      
      if (!paypalCancelled.success) {
        return {
          success: false,
          message: 'Failed to cancel with PayPal. Please try again or contact support.'
        };
      }

      // Step 2: Update user's subscription status in Firebase
      const userRef = doc(db, 'subscriptions', userId);
      const now = new Date();
      
      await updateDoc(userRef, {
        active: false,
        paymentStatus: 'canceled',
        canceledAt: now,
        cancelReason: reason || 'User requested',
        updatedAt: now
      });

      // Step 3: Update user access immediately
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        subscriptionStatus: 'canceled',
        lastActive: now
      });

      console.log('✅ Subscription cancelled successfully');
      
      return {
        success: true,
        message: 'Your subscription has been cancelled. You can continue using Moklik until your current billing period ends.',
        endDate: now
      };

    } catch (error) {
      console.error('❌ Error cancelling subscription:', error);
      return {
        success: false,
        message: 'An error occurred while cancelling your subscription. Please contact support.'
      };
    }
  }

  /**
   * Cancel subscription with PayPal API
   */
  private static async cancelPayPalSubscription(subscriptionId: string, reason?: string): Promise<{success: boolean, message: string}> {
    try {
      // Get PayPal access token
      const accessToken = await this.getPayPalAccessToken();
      
      if (!accessToken) {
        return { success: false, message: 'Failed to authenticate with PayPal' };
      }

      // Cancel subscription via PayPal API
      const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          reason: reason || 'User requested cancellation'
        })
      });

      if (response.status === 204) {
        return { success: true, message: 'Successfully cancelled with PayPal' };
      } else {
        const error = await response.json();
        console.error('PayPal cancellation failed:', error);
        return { success: false, message: 'PayPal cancellation failed' };
      }

    } catch (error) {
      console.error('PayPal API error:', error);
      return { success: false, message: 'PayPal API error' };
    }
  }

  /**
   * Get PayPal access token for API calls
   */
  private static async getPayPalAccessToken(): Promise<string | null> {
    try {
      const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_PAYPAL_CLIENT_SECRET; // You'll need to add this

      if (!clientId || !clientSecret) {
        console.error('PayPal credentials missing');
        return null;
      }

      const auth = btoa(`${clientId}:${clientSecret}`);
      
      const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      return data.access_token;

    } catch (error) {
      console.error('Error getting PayPal access token:', error);
      return null;
    }
  }

  /**
   * Check if user can cancel (not already cancelled)
   */
  static async canUserCancel(userId: string): Promise<boolean> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        return false;
      }

      const subscription = subscriptionDoc.data();
      return subscription.active && subscription.paymentStatus !== 'canceled';

    } catch (error) {
      console.error('Error checking cancellation eligibility:', error);
      return false;
    }
  }

  /**
   * Get user's subscription details for cancellation
   */
  static async getSubscriptionForCancellation(userId: string): Promise<{subscriptionId: string, plan: string} | null> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        return null;
      }

      const subscription = subscriptionDoc.data();
      
      return {
        subscriptionId: subscription.paypalSubscriptionId || '',
        plan: subscription.plan || 'free'
      };

    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }
}
