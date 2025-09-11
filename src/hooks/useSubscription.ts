// src/hooks/useSubscription.ts
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserInitializationService, SubscriptionData } from '../services/userInitializationService';

const DEFAULT_SUBSCRIPTION: SubscriptionData = {
  active: false,
  plan: 'free',
  createdAt: new Date(),
  updatedAt: new Date(),
  paymentStatus: 'canceled'
};

export function useSubscription() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUBSCRIPTION);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(DEFAULT_SUBSCRIPTION);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Initialize user if this is their first time
        await UserInitializationService.initializeUser(user);
        
        // Get subscription data
        const subscriptionData = await UserInitializationService.getUserSubscription(user.uid);
        setSubscription(subscriptionData || DEFAULT_SUBSCRIPTION);
        
      } catch (err) {
        console.error('Error in useSubscription:', err);
        setError('Failed to load subscription');
        
        // Always set a valid subscription object
        setSubscription(DEFAULT_SUBSCRIPTION);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Helper function to safely convert Firestore timestamp or date
  const getDateFromFirestore = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    
    try {
      // Check if it's a Firestore timestamp with toDate method
      if (dateValue.toDate && typeof dateValue.toDate === 'function') {
        return dateValue.toDate();
      }
      
      // Check if it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue;
      }
      
      // Try to create a Date from the value
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return null;
      }
      
      return date;
    } catch (error) {
      console.error('Error converting date:', error);
      return null;
    }
  };

  // Check if trial has expired
  const isTrialExpired = (): boolean => {
    if (!subscription || subscription.plan !== 'free') {
      return false; // Not a trial user
    }

    const trialEndDate = getDateFromFirestore(subscription.trialEndDate);
    if (!trialEndDate) {
      return false; // No trial end date, assume still valid
    }

    return new Date() > trialEndDate;
  };

  // Check if user has active access to features
  const hasAccess = (): boolean => {
    // If no subscription data, no access
    if (!subscription) return false;

    // If trial expired, no access
    if (isTrialExpired()) return false;

    // If subscription is not active, no access
    if (!subscription.active) return false;

    // If payment status is problematic, no access
    if (subscription.paymentStatus === 'canceled' || subscription.paymentStatus === 'past_due') {
      // Exception: allow access during trial period even if payment status is not great
      if (subscription.plan === 'free' && !isTrialExpired()) {
        return true;
      }
      return false;
    }

    // All checks passed
    return true;
  };

  // Get days remaining in trial
  const getDaysRemaining = (): number => {
    if (subscription.plan !== 'free') return 0;

    const trialEndDate = getDateFromFirestore(subscription.trialEndDate);
    if (!trialEndDate) return 30; // Default fallback

    const now = new Date();
    const timeDiff = trialEndDate.getTime() - now.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return Math.max(0, days); // Don't return negative days
  };

  // Get user-friendly subscription status
  const getSubscriptionStatus = (): string => {
    if (!subscription) return 'inactive';
    
    if (subscription.plan === 'free') {
      return isTrialExpired() ? 'trial_expired' : 'trial_active';
    }
    
    if (subscription.paymentStatus === 'canceled') return 'canceled';
    if (subscription.paymentStatus === 'past_due') return 'payment_required';
    if (subscription.active) return 'active';
    
    return 'inactive';
  };

  return { 
    subscription, // This is NEVER null now
    loading, 
    error,
    isActive: subscription?.active || false,
    plan: subscription?.plan || 'free',
    hasActiveSubscription: subscription?.active && subscription?.paymentStatus === 'active',
    
    // New access control methods
    hasAccess: hasAccess(),
    isTrialExpired: isTrialExpired(),
    daysRemaining: getDaysRemaining(),
    subscriptionStatus: getSubscriptionStatus(),
    needsPayment: !hasAccess() && (isTrialExpired() || subscription?.paymentStatus === 'past_due')
  };
}
