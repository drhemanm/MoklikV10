// src/pages/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionCancellationService } from '../services/subscriptionCancellation';
import { UserInitializationService } from '../services/userInitializationService';

interface SubscriptionDetails {
  plan: string;
  active: boolean;
  paymentStatus: string;
  subscriptionId?: string;
  nextBillingDate?: Date;
}

const AccountSettings: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadSubscriptionDetails();
  }, [currentUser]);

  const loadSubscriptionDetails = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const subscriptionData = await UserInitializationService.getUserSubscription(currentUser.uid);
      
      if (subscriptionData) {
        setSubscription({
          plan: subscriptionData.plan,
          active: subscriptionData.active,
          paymentStatus: subscriptionData.paymentStatus || 'unknown',
          nextBillingDate: subscriptionData.trialEndDate
        });
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentUser || !subscription) return;

    try {
      setCancelling(true);
      
      // Get subscription details for cancellation
      const subscriptionDetails = await SubscriptionCancellationService.getSubscriptionForCancellation(currentUser.uid);
      
      if (!subscriptionDetails) {
        alert('Could not find subscription details. Please contact support.');
        return;
      }

      // Cancel the subscription
      const result = await SubscriptionCancellationService.cancelSubscription(
        currentUser.uid,
        subscriptionDetails.subscriptionId,
        cancelReason
      );

      if (result.success) {
        alert(result.message);
        setShowCancelConfirm(false);
        await loadSubscriptionDetails(); // Refresh the data
      } else {
        alert(result.message);
      }

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('An error occurred. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = subscription?.active && subscription?.paymentStatus !== 'canceled' && subscription?.plan !== 'free';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">Loading account settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your Moklik account and subscription</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{currentUser?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Account Created</label>
            <p className="text-gray-900">{currentUser?.metadata?.creationTime}</p>
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
        
        {subscription ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Plan</label>
                <p className="text-gray-900 font-medium capitalize">{subscription.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className={`font-medium ${
                  subscription.active ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscription.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Status</label>
                <p className="text-gray-900 capitalize">{subscription.paymentStatus}</p>
              </div>
              {subscription.nextBillingDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Next Billing Date</label>
                  <p className="text-gray-900">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Cancellation Section */}
            {canCancel && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-900 mb-2">Cancel Subscription</h3>
                  <p className="text-red-700 text-sm mb-4">
                    You can cancel your subscription at any time. You'll continue to have access until your current billing period ends.
                  </p>
                  
                  {!showCancelConfirm ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          Why are you cancelling? (Optional)
                        </label>
                        <select
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="w-full p-2 border border-red-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Select a reason...</option>
                          <option value="too_expensive">Too expensive</option>
                          <option value="not_using">Not using it enough</option>
                          <option value="found_alternative">Found a better alternative</option>
                          <option value="technical_issues">Technical issues</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCancelSubscription}
                          disabled={cancelling}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No subscription information available.</p>
        )}
      </div>

      {/* Account Deletion Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">Delete Account</h3>
          <p className="text-red-700 text-sm mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                // Implement account deletion
                alert('Account deletion functionality will be implemented here.');
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
