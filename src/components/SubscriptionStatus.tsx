import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Crown, AlertTriangle, CheckCircle, CreditCard } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionStatusProps {
  showDetails?: boolean;
  compact?: boolean;
}

export function SubscriptionStatus({ showDetails = true, compact = false }: SubscriptionStatusProps) {
  const {
    hasAccess,
    status,
    plan,
    daysRemaining,
    isTrialUser,
    loading,
    error,
    getStatusMessage,
    getStatusColor,
    needsPayment,
    isExpiringSoon
  } = useSubscription();

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${compact ? 'text-sm' : ''}`}>
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-gray-500">Loading subscription...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${compact ? 'text-sm' : ''}`}>
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-red-500">Unable to load subscription</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isTrialUser && hasAccess) {
      return <Clock className="w-4 h-4 text-blue-500" />;
    }
    if (hasAccess && !isTrialUser) {
      return <Crown className="w-4 h-4 text-green-500" />;
    }
    if (!hasAccess) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-gray-400" />;
  };

  const getBadgeColor = () => {
    if (isTrialUser && hasAccess) {
      return isExpiringSoon() ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
    }
    if (hasAccess && !isTrialUser) {
      return 'bg-green-100 text-green-800';
    }
    if (!hasAccess) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {isTrialUser ? `Trial: ${daysRemaining}d` : plan.charAt(0).toUpperCase() + plan.slice(1)}
        </span>
        {needsPayment() && (
          <Link
            to="/pricing"
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            Upgrade
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">
              {isTrialUser ? 'Free Trial' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="space-y-3">
          {/* Progress Bar for Trial Users */}
          {isTrialUser && hasAccess && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Trial Progress</span>
                <span>{30 - daysRemaining}/30 days used</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    isExpiringSoon() ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${((30 - daysRemaining) / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {needsPayment() && (
              <Link
                to="/pricing"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isTrialUser ? 'Upgrade Now' : 'Renew Subscription'}</span>
              </Link>
            )}
            
            {hasAccess && !isTrialUser && (
              <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span>Manage Subscription</span>
              </button>
            )}
          </div>

          {/* Trial Benefits Reminder */}
          {isTrialUser && hasAccess && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Trial includes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Unlimited AI tutoring sessions</li>
                <li>• Writing review and feedback</li>
                <li>• Progress tracking and badges</li>
                <li>• Community forum access</li>
              </ul>
            </div>
          )}

          {/* Expired State */}
          {!hasAccess && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="font-medium text-red-900 mb-1">Access Expired</h4>
              <p className="text-sm text-red-800">
                {isTrialUser 
                  ? 'Your free trial has ended. Upgrade to continue using Moklik.'
                  : 'Your subscription has expired. Renew to regain access to all features.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simplified version for navigation/header
export function SubscriptionBadge() {
  return <SubscriptionStatus compact={true} showDetails={false} />;
}
