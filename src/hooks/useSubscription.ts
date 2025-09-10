import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { stripeService, SUBSCRIPTION_PLANS } from '../services/subscription/stripeService';
import toast from 'react-hot-toast';

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
      toast.error('Failed to load subscription information');
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    if (!user) {
      toast.error('Please sign in to start a trial');
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
      toast.success('Your 7-day free trial has started!');
      return true;
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error('Failed to start trial. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (paymentMethodId: string, planId: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
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
      
      toast.success('Subscription successful!');
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to process subscription. Please try again.');
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
      toast.success('Subscription canceled successfully');
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
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