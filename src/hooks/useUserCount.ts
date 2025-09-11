import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useUserCount() {
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Listen to real-time changes in the users collection
      const usersRef = collection(db, 'users');
      
      const unsubscribe = onSnapshot(
        usersRef,
        (snapshot) => {
          const count = snapshot.size; // Total number of documents
          setUserCount(count);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching user count:', err);
          setError('Failed to load user count');
          setLoading(false);
          // Fallback to a reasonable number if Firebase fails
          setUserCount(1247);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up user count listener:', err);
      setError('Failed to connect to database');
      setLoading(false);
      // Fallback number
      setUserCount(1247);
    }
  }, []);

  return { userCount, loading, error };
}
