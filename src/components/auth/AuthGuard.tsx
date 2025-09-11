import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useSubscription } from '../../hooks/useSubscription.js';
import AccessDenied from '../AccessDenied.jsx';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { canAccess, loading: subscriptionLoading, isInTrial, daysRemaining } = useSubscription();
  const navigate = useNavigate();

  const isLoading = authLoading || subscriptionLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('User not authenticated, staying on current page');
    }
  }, [user, authLoading, navigate]);

  // Show loading spinner while checking auth and subscription
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication first
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this feature.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Check subscription access
  if (!canAccess) {
    return (
      <AccessDenied 
        trialExpired={!isInTrial} 
        daysRemaining={daysRemaining} 
      />
    );
  }

  // User is authenticated and has access
  return <>{children}</>;
}
