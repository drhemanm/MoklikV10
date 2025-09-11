// src/hooks/useSubscription.ts
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { UserInitializationService, SubscriptionData } from '../services/userInitializationService';

export function useSubscription() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
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
        setSubscription(subscriptionData);
        
      } catch (err) {
        console.error('Error in useSubscription:', err);
        setError('Failed to load subscription');
        
        // Set safe default subscription instead of null
        setSubscription({
          active: false,
          plan: 'free',
          createdAt: new Date(),
          updatedAt: new Date(),
          paymentStatus: 'canceled'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { 
    subscription, 
    loading, 
    error,
    isActive: subscription?.active || false,
    plan: subscription?.plan || 'free',
    hasActiveSubscription: subscription?.active && subscription?.paymentStatus === 'active'
  };
}
