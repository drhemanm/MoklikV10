import { useState, useEffect } from 'react';
import { deleteUser } from 'firebase/auth';
import { SubscriptionService, UserSubscription } from '../services/subscriptionService';
import { useAuth } from './useAuth';

interface SubscriptionStatus {
  subscription: UserSubscription | null;
  hasAccess: boolean;
  status: string;
  plan: string;
  daysRemaining: number;
  isTrialUser: boolean;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionStatus>({
    subscription: null,
    hasAccess: false,
    status: 'unknown',
    plan: 'none',
    daysRemaining: 0,
    isTrialUser: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!user) {
      setSubscriptionData({
        subscription: null,
        hasAccess: false,
        status: 'not_logged_in',
        plan: 'none',
        daysRemaining: 0,
        isTrialUser: false,
        loading: false,
        error: null
      });
      return;
    }

    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    try {
      setSubscriptionData(prev => ({ ...prev, loading: true, error: null }));

      // Get or create subscription for user
      let subscription = await SubscriptionService.getUserSubscription(user.uid);
      
      // If no subscription exists, initialize trial for new/existing user
      if (!subscription) {
        subscription = await SubscriptionService.transitionExistingUser(user.uid);
      }

      // Get subscription summary
      const summary = await SubscriptionService.getSubscriptionSummary(user.uid);

      setSubscriptionData({
        subscription,
        hasAccess: summary.hasAccess,
        status: summary.status,
        plan: summary.plan,
        daysRemaining: summary.daysRemaining,
        isTrialUser: summary.isTrialUser,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading subscription data:', error);
      setSubscriptionData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load subscription data'
      }));
    }
  };

  const upgradeSubscription = async (plan: 'monthly' | 'yearly', paypalSubscriptionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await SubscriptionService.upgradeToSubscription(user.uid, plan, paypalSubscriptionId);
      await loadSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      await SubscriptionService.cancelSubscription(user.uid);
      await loadSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Delete subscription and user data from Firestore
      await SubscriptionService.deleteUserAccount(user.uid);
      
      // Delete Firebase Auth account
      // Note: This requires recent authentication for security
      await deleteUser(user);
      
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log out and log back in before deleting your account for security reasons.');
      }
      
      throw new Error('Failed to delete account. Please try again or contact support.');
    }
  };

  const refreshSubscription = () => {
    loadSubscriptionData();
  };

  // Helper functions for UI
  const getStatusMessage = (): string => {
    if (subscriptionData.loading) return 'Loading...';
    if (subscriptionData.error) return 'Error loading subscription';
    
    if (subscriptionData.isTrialUser) {
      if (subscriptionData.hasAccess) {
        return `${subscriptionData.daysRemaining} days left in free trial`;
      } else {
        return 'Free trial has expired';
      }
    }

    if (subscriptionData.status === 'active') {
      return `${subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1)} plan - ${subscriptionData.daysRemaining} days remaining`;
    }

    if (subscriptionData.status === 'expired') {
      return 'Subscription has expired';
    }

    if (subscriptionData.status === 'cancelled') {
      return 'Subscription cancelled';
    }

    return 'No active subscription';
  };

  const getStatusColor = (): string => {
    if (subscriptionData.hasAccess) {
      if (subscriptionData.isTrialUser) {
        return subscriptionData.daysRemaining <= 3 ? 'text-orange-600' : 'text-green-600';
      }
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const needsPayment = (): boolean => {
    return !subscriptionData.hasAccess || 
           (subscriptionData.isTrialUser && subscriptionData.daysRemaining <= 7);
  };

  const isExpiringSoon = (): boolean => {
    return subscriptionData.hasAccess && subscriptionData.daysRemaining <= 7;
  };

  return {
    // Data
    ...subscriptionData,
    
    // Actions
    upgradeSubscription,
    cancelSubscription,
    deleteAccount,
    refreshSubscription,
    
    // Helpers
    getStatusMessage,
    getStatusColor,
    needsPayment,
    isExpiringSoon
  };
}
