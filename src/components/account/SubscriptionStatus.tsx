import { CreditCard, Clock, AlertTriangle, Crown } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription.jsx';
import { Link } from 'react-router-dom';

export function SubscriptionStatus() {
  const { 
    subscription, 
    loading, 
    error, 
    canAccess,           // ✅ Fixed: was 'isActive' 
    subscriptionPlan,    // ✅ Fixed: was 'plan'
    subscriptionStatus,
    isInTrial,
    daysRemaining,
    hasActiveSubscription
  } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Subscription Error</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Unable to load subscription information. Please try again later.
        </p>
      </div>
    );
  }

  // ✅ Fixed: No active subscription
  if (!canAccess) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">No Active Subscription</h3>
        </div>
        <p className="text-gray-600 mb-6">
          You don't have an active subscription. Subscribe to get unlimited access to all features.
        </p>
        <Link
          to="/pricing"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Plans
        </Link>
      </div>
    );
  }

  // ✅ Fixed: Free trial active
  if (isInTrial && canAccess) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Free Trial Active</h3>
        </div>
        <p className="text-gray-600 mb-2">
          You have <span className="font-semibold text-blue-600">{daysRemaining} days</span> left in your free trial.
        </p>
        <p className="text-gray-600 mb-6">
          Upgrade now to continue enjoying unlimited access to all features.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/pricing"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Upgrade Now
          </Link>
          <Link
            to="/account"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Manage Trial
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Fixed: Premium subscription active
  if (hasActiveSubscription) {
    const planDisplayName = subscriptionPlan === 'yearly' ? 'Yearly Premium' : 'Monthly Premium';
    const planPrice = subscriptionPlan === 'yearly' ? '₹1200 / year' : '₹100 / month';
    
    // Calculate next billing date (rough estimate)
    const nextBillingDate = new Date();
    if (subscriptionPlan === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Premium Subscription Active</h3>
        </div>
        
        {/* Success Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">All features unlocked!</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Plan</span>
            <span className="font-medium text-green-700">{planDisplayName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price</span>
            <span className="font-medium">{planPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-green-700 capitalize">{subscriptionStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Next billing date</span>
            <span className="font-medium">
              {nextBillingDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Payment method</span>
            <span className="font-medium">PayPal •••• {subscription?.paypalSubscriptionId?.slice(-4) || '••••'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/account"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Manage Subscription
          </Link>
          <Link
            to="/billing"
            className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            View Billing
          </Link>
        </div>
      </div>
    );
  }

  // Fallback case
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Subscription Status Unknown</h3>
      </div>
      <p className="text-gray-600 mb-6">
        Unable to determine your subscription status. Please contact support if this persists.
      </p>
      <Link
        to="/contact"
        className="inline-block px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Contact Support
      </Link>
    </div>
  );
}
