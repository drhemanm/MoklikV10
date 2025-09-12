// src/hooks/useUserCount.ts
import { useState, useEffect } from 'react';
import { UserInitializationService } from '../services/userInitializationService';

export function useUserCount() {
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const count = await UserInitializationService.getUserCount();
        setUserCount(count);
        
      } catch (err) {
        console.error('Error in useUserCount:', err);
        setError('Failed to load user count');
        // Don't set a fake fallback number - let the UI handle the error state
        setUserCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return { userCount, loading, error };
}
