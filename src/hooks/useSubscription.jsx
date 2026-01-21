// src/hooks/useSubscription.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { SubscriptionService } from '../services/SubscriptionService';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionSummary, setSubscriptionSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubscription = useCallback(async () => {
    if (!user) {
      setSubscriptionSummary(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading subscription for user:', user.uid);

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

      console.log('📊 Subscription summary loaded:', summary);
      setSubscriptionSummary(summary);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load when user changes
  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscriptionSummary(null);
      setLoading(false);
    }
  }, [user, loadSubscription]);

  // CRITICAL: Listen for subscription update events from PayPal
  useEffect(() => {
    const handleSubscriptionUpdate = async (event) => {
      console.log('🔔 Subscription update event received:', event.detail);

      // Wait a bit more for Firebase consistency
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reload subscription data
      console.log('🔄 Reloading subscription after payment...');
      await loadSubscription();
      console.log('✅ Subscription reloaded successfully');
    };

    // Add event listener
    window.addEventListener('subscription-updated', handleSubscriptionUpdate);

    // Also expose refresh function globally for PayPal component
    window.refreshSubscription = loadSubscription;

    // Cleanup
    return () => {
      window.removeEventListener('subscription-updated', handleSubscriptionUpdate);
      delete window.refreshSubscription;
    };
  }, [loadSubscription]);

  const refreshSubscription = useCallback(async () => {
    if (user) {
      await loadSubscription();
    }
  }, [user, loadSubscription]);

  // Calculate derived values
  const isInTrial = subscriptionSummary?.isTrialUser || false;
  const daysRemaining = subscriptionSummary?.daysRemaining || 0;
  const isTrialExpired = isInTrial && daysRemaining <= 0;
  const isOnTrial = isInTrial && daysRemaining > 0; // Active trial (not expired)
  const hasAccess = subscriptionSummary?.hasAccess || false;

  return {
    subscription: subscriptionSummary,
    loading,
    error,
    refreshSubscription,

    // FIXED: Added missing canAccess property for AuthGuard
    canAccess: hasAccess,  // ← THIS WAS MISSING!
    hasAccess,             // ← Keep both for compatibility

    // Original convenience getters
    isInTrial,
    hasActiveSubscription: hasAccess && !isInTrial,
    daysRemaining,
    subscriptionPlan: subscriptionSummary?.plan || null,
    subscriptionStatus: subscriptionSummary?.status || null,

    // New getters for dashboard compatibility
    isOnTrial, // Active trial (has days left)
    isTrialExpired, // Trial but expired (0 days left)
    trialDaysLeft: daysRemaining // Alias for daysRemaining
  };
};
