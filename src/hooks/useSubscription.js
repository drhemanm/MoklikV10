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
      const summary = await SubscriptionService.getSubscriptionSummary(user.uid);
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

  return {
    subscription: subscriptionSummary,
    loading,
    error,
    refreshSubscription,
    // Convenience getters
    canAccess: subscriptionSummary?.hasAccess || false,
    isInTrial: subscriptionSummary?.isTrialUser || false,
    hasActiveSubscription: subscriptionSummary?.hasAccess && !subscriptionSummary?.isTrialUser || false,
    daysRemaining: subscriptionSummary?.daysRemaining || 0,
    subscriptionPlan: subscriptionSummary?.plan || null,
    subscriptionStatus: subscriptionSummary?.status || null
  };
};
