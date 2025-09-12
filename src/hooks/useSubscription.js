// src/hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SubscriptionService } from '../services/SubscriptionService';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionSummary, setSubscriptionSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscriptionSummary(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get existing subscription
      let summary = await SubscriptionService.getSubscriptionSummary(user.uid);
      
      // If no subscription exists, initialize free trial for existing user
      if (!summary || summary.status === 'No Subscription') {
        console.log('🔄 No subscription found for existing user, initializing trial...');
        
        try {
          await SubscriptionService.initializeUserSubscription(user.uid);
          summary = await SubscriptionService.getSubscriptionSummary(user.uid);
          console.log('✅ Trial initialized for existing user:', user.uid);
        } catch (initError) {
          console.error('❌ Failed to initialize trial for existing user:', initError);
          // Fallback: provide basic access
          summary = {
            hasAccess: true,
            status: 'legacy_user',
            plan: 'free',
            daysRemaining: 30,
            isTrialUser: true
          };
        }
      }
      
      setSubscriptionSummary(summary);
    } catch (err) {
      setError(err.message);
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    if (user) {
      loadSubscription();
    }
  };

  // Calculate derived values
  const isInTrial = subscriptionSummary?.isTrialUser || false;
  const daysRemaining = subscriptionSummary?.daysRemaining || 0;
  const isTrialExpired = isInTrial && daysRemaining <= 0;
  const isOnTrial = isInTrial && daysRemaining > 0; // Active trial (not expired)

  return {
    subscription: subscriptionSummary,
    loading,
    error,
    refreshSubscription,
    
    // Original convenience getters
    canAccess: subscriptionSummary?.hasAccess || false,
    isInTrial,
    hasActiveSubscription: subscriptionSummary?.hasAccess && !subscriptionSummary?.isTrialUser || false,
    daysRemaining,
    subscriptionPlan: subscriptionSummary?.plan || null,
    subscriptionStatus: subscriptionSummary?.status || null,
    
    // New getters for dashboard compatibility
    isOnTrial, // Active trial (has days left)
    isTrialExpired, // Trial but expired (0 days left)
    trialDaysLeft: daysRemaining // Alias for daysRemaining
  };
};
