import { CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription.js';
import { Link } from 'react-router-dom';

export function SubscriptionStatus() {
  const { subscription, loading, error, isActive, plan } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (!isActive) {
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

  if (plan === 'free') {
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

    // Calculate days left with proper error handling
    let daysLeft = 30; // Default fallback
    let endDateText = 'Soon';
    
    const trialEndDate = getDateFromFirestore(subscription?.trialEndDate);
    
    if (trialEndDate) {
      const now = new Date();
      const timeDiff = trialEndDate.getTime() - now.getTime();
      const calculatedDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      // Ensure we have a valid number
      if (!isNaN(calculatedDays)) {
        daysLeft = Math.max(0, calculatedDays); // Don't show negative days
      }
      
      endDateText = trialEndDate.toLocaleDateString();
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Free Trial Active</h3>
        </div>
        <p className="text-gray-600 mb-2">
          You have <span className="font-semibold text-blue-600">{daysLeft} days</span> left in your free trial.
        </p>
        <p className="text-gray-600 mb-6">
          Your trial will end on {endDateText}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/pricing"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center space-x-3 mb-4">
        <CreditCard className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Premium Subscription Active</h3>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium">Premium</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price</span>
          <span className="font-medium">Rs 100 / month</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Next billing date</span>
          <span className="font-medium">
            {subscription?.updatedAt?.toLocaleDateString() || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Payment method</span>
          <span className="font-medium">•••• 4242</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Update Payment
        </button>
        <button
          className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
