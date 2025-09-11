// src/hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SubscriptionService } from '../services/subscriptionService';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubscriptionService.getUserSubscription(user.uid);
      setSubscription(data);
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
    subscription,
    loading,
    error,
    refreshSubscription,
    // Convenience getters
    canAccess: subscription?.canAccess || false,
    isInTrial: subscription?.isInTrial || false,
    hasActiveSubscription: subscription?.hasActiveSubscription || false,
    daysRemaining: subscription?.daysRemaining || 0,
    subscriptionPlan: subscription?.plan || null,
    subscriptionStatus: subscription?.status || null
  };
};
