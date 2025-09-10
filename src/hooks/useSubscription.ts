import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.js';
import { stripeService, SUBSCRIPTION_PLANS } from '../services/subscription/stripeService.js';
import { toast as toastLib } from 'react-hot-toast';

export function useSubscription() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    active: boolean;
    plan?: string;
    trialEnd?: Date;
    renewalDate?: Date;
  }>({ active: false });

  useEffect(() => {
    if (user) {
      loadSubscriptionStatus();
    } else {
      setIsLoading(false);
      setSubscriptionStatus({ active: false });
    }
  }, [user]);

  const loadSubscriptionStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const status = await stripeService.getSubscriptionStatus(user.uid);
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
      toastLib.error('Failed to load subscription information');
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    if (!user) {
      toastLib.error('Please sign in to start a trial');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await stripeService.startTrial(user.uid);
      setSubscriptionStatus({
        active: true,
        plan: 'trial',
        trialEnd: result.trialEndDate
      });
      toastLib.success('Your 7-day free trial has started!');
      return true;
    } catch (error) {
      console.error('Error starting trial:', error);
      toastLib.error('Failed to start trial. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (_paymentMethodId: string, planId: string) => {
    if (!user) {
      toastLib.error('Please sign in to subscribe');
      return false;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would create a customer and subscription
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + 30);
      
      setSubscriptionStatus({
        active: true,
        plan: planId,
        renewalDate
      });
      
      toastLib.success('Subscription successful!');
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toastLib.error('Failed to process subscription. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would cancel the subscription
      // For demo purposes, we're simulating the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionStatus({ active: false });
      toastLib.success('Subscription canceled successfully');
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toastLib.error('Failed to cancel subscription. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    subscriptionStatus,
    startTrial,
    createSubscription,
    cancelSubscription,
    plans: SUBSCRIPTION_PLANS
  };
}