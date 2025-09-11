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

  return { 
    subscription, // This is NEVER null now
    loading, 
    error,
    isActive: subscription?.active || false,
    plan: subscription?.plan || 'free',
    hasActiveSubscription: subscription?.active && subscription?.paymentStatus === 'active'
  };
}
