import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Crown, CreditCard, AlertTriangle } from 'lucide-react';
import PayPalSubscription from './PayPalSubscription';

const AccessDenied = ({ trialExpired, daysRemaining }) => {
  const navigate = useNavigate();
  const [showPayPal, setShowPayPal] = useState(false);

  const handleUpgradeClick = () => {
    setShowPayPal(true);
  };

  const handlePaymentSuccess = (subscriptionData) => {
    console.log('Payment successful:', subscriptionData);
    setShowPayPal(false);
    // Refresh the page to reload subscription status
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          {trialExpired ? (
            <AlertTriangle className="w-10 h-10 text-red-600" />
          ) : (
            <Clock className="w-10 h-10 text-orange-600" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {trialExpired ? 'Trial Expired' : 'Limited Access'}
        </h2>

        {/* Message */}
        <div className="mb-8">
          {trialExpired ? (
            <div>
              <p className="text-gray-600 mb-4">
                Your free trial has ended. Upgrade to continue using Moklik's AI tutoring features.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>What you'll get back:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• 24/7 AI tutor access</li>
                  <li>• Unlimited problem solving</li>
                  <li>• Document upload & analysis</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                You have <strong>{daysRemaining} days</strong> remaining in your free trial.
              </p>
              <p className="text-sm text-gray-500">
                Upgrade now to ensure uninterrupted access to all features.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleUpgradeClick}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Premium</span>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>View Pricing Plans</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
          >
            Return to Home
          </button>
        </div>

        {/* Pricing Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Choose your plan:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold text-blue-900">Monthly</p>
              <p className="text-blue-700">200 MUR/month</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-semibold text-purple-900">Yearly</p>
              <p className="text-purple-700">2,000 MUR/year</p>
              <p className="text-xs text-purple-600">Save 400 MUR!</p>
            </div>
          </div>
        </div>
      </div>

      {/* PayPal Subscription Modal */}
      <PayPalSubscription
        isOpen={showPayPal}
        onClose={() => setShowPayPal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AccessDenied;
