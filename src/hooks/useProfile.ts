import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import type { UserProfile } from '../types/user';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
          setError('Profile not found');
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Profile subscription error:', error);
        setError('Failed to load profile');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    profile,
    isLoading,
    error
  };
}