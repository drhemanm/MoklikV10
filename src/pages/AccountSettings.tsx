// src/pages/AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionService } from '../services/SubscriptionService';
import { 
  Typography, 
  Card, 
  Button, 
  Badge 
} from '../components/ui/ComponentLibrary';
import { EnhancedLayout } from '../components/layout/EnhancedLayout';
import { Crown, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

interface SubscriptionDetails {
  plan: string;
  status: string;
  isTrialUser: boolean;
  daysRemaining: number;
  hasAccess: boolean;
  paypalSubscriptionId?: string;
}

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadSubscriptionDetails();
  }, [user]);

  const loadSubscriptionDetails = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const summary = await SubscriptionService.getSubscriptionSummary(user.uid);
      const userSubscription = await SubscriptionService.getUserSubscription(user.uid);
      
      setSubscription({
        plan: summary.plan,
        status: summary.status,
        isTrialUser: summary.isTrialUser,
        daysRemaining: summary.daysRemaining,
        hasAccess: summary.hasAccess,
        paypalSubscriptionId: userSubscription?.paypalSubscriptionId
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.uid) return;

    try {
      setCancelling(true);
      
      const result = await SubscriptionService.cancelPayPalSubscription(user.uid, cancelReason);

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

  const canCancel = subscription?.status === 'active' && 
                   subscription?.plan !== 'free' && 
                   subscription?.paypalSubscriptionId;

  if (loading) {
    return (
      <EnhancedLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">Loading account settings...</div>
        </div>
      </EnhancedLayout>
    );
  }

  return (
    <EnhancedLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Typography.H1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</Typography.H1>
          <Typography.Body className="text-gray-600">Manage your Moklik account and subscription</Typography.Body>
        </div>

        {/* Account Information */}
        <Card variant="elevated" padding="lg">
          <Typography.H2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</Typography.H2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <Typography.Body className="text-gray-900">{user?.email}</Typography.Body>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Display Name</label>
              <Typography.Body className="text-gray-900">{user?.displayName || 'Not set'}</Typography.Body>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Created</label>
              <Typography.Body className="text-gray-900">
                {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
              </Typography.Body>
            </div>
          </div>
        </Card>

        {/* Subscription Details */}
        <Card variant="elevated" padding="lg">
          <Typography.H2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</Typography.H2>
          
          {subscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Plan</label>
                  <div className="flex items-center space-x-2">
                    <Typography.Body className="text-gray-900 font-medium capitalize">
                      {subscription.plan}
                    </Typography.Body>
                    {subscription.isTrialUser && (
                      <Badge variant="info" size="sm">Trial</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    <Typography.Body className={`font-medium ${
                      subscription.hasAccess ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subscription.hasAccess ? 'Active' : 'Inactive'}
                    </Typography.Body>
                    {subscription.hasAccess ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                {subscription.daysRemaining > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {subscription.isTrialUser ? 'Trial Days Left' : 'Days Remaining'}
                    </label>
                    <Typography.Body className="text-gray-900">
                      {subscription.daysRemaining} days
                    </Typography.Body>
                  </div>
                )}
              </div>

              {/* Trial Upgrade Section */}
              {subscription.isTrialUser && subscription.hasAccess && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Card variant="outlined" padding="lg" className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <div className="flex items-start space-x-3">
                      <Crown className="w-6 h-6 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <Typography.H3 className="text-purple-900 mb-2">
                          {subscription.daysRemaining} days left in your trial
                        </Typography.H3>
                        <Typography.Body className="text-purple-700 mb-4">
                          Upgrade now to continue enjoying unlimited access to Moklik's AI tutoring and learning features.
                        </Typography.Body>
                        <Button
                          variant="primary"
                          onClick={() => window.location.href = '/pricing'}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Cancellation Section */}
              {canCancel && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-red-50 rounded-lg p-4">
                    <Typography.H3 className="text-lg font-medium text-red-900 mb-2">Cancel Subscription</Typography.H3>
                    <Typography.Body className="text-red-700 text-sm mb-4">
                      You can cancel your subscription at any time. You'll continue to have access until your current billing period ends.
                    </Typography.Body>
                    
                    {!showCancelConfirm ? (
                      <Button
                        onClick={() => setShowCancelConfirm(true)}
                        variant="secondary"
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Cancel Subscription
                      </Button>
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
                          <Button
                            onClick={handleCancelSubscription}
                            disabled={cancelling}
                            variant="secondary"
                            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                          </Button>
                          <Button
                            onClick={() => setShowCancelConfirm(false)}
                            variant="secondary"
                            className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                          >
                            Keep Subscription
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Typography.Body className="text-gray-500">No subscription information available.</Typography.Body>
          )}
        </Card>

        {/* Account Deletion Section */}
        <Card variant="elevated" padding="lg">
          <Typography.H2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</Typography.H2>
          <div className="bg-red-50 rounded-lg p-4">
            <Typography.H3 className="text-lg font-medium text-red-900 mb-2">Delete Account</Typography.H3>
            <Typography.Body className="text-red-700 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography.Body>
            <Button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                  alert('Account deletion functionality will be implemented here.');
                }
              }}
              variant="secondary"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </EnhancedLayout>
  );
};

export default AccountSettings;
