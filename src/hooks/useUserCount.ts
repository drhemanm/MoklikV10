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
        // Set a fallback count instead of leaving it at 0
        setUserCount(1200); // Show a nice fallback number
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return { userCount, loading, error };
}
