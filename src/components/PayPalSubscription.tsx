import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Check, Crown, Zap, Shield, Star, Clock, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionService } from '../services/SubscriptionService';
import { PAYPAL_CONFIG } from '../config/paypal';

interface PayPalSubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (subscriptionData: any) => void;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIXED FUNCTION - NO MORE PAGE RELOAD!
  const handleSubscriptionSuccess = async (data: any, actions: any) => {
    try {
      setLoading(true);
      
      console.log('🔄 PayPal payment successful, updating subscription...');
      
      // Update user subscription in your database
      await SubscriptionService.upgradeToSubscription(
        user!.uid,
        selectedPlan,
        data.subscriptionID
      );
      
      console.log('✅ Database updated, waiting for propagation...');
      
      // Wait a moment for Firebase to propagate the changes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('🔄 Refreshing subscription data...');
      
      // Force refresh subscription data instead of page reload
      if (window.refreshSubscription) {
        await window.refreshSubscription();
      }
      
      // Dispatch custom event that useSubscription hook can listen to
      window.dispatchEvent(new CustomEvent('subscription-updated', { 
        detail: { 
          subscriptionId: data.subscriptionID,
          planId: selectedPlan,
          status: 'active' 
        } 
      }));
      
      if (onSuccess) {
        onSuccess({
          subscriptionId: data.subscriptionID,
          planId: selectedPlan,
          status: 'active'
        });
      }
      
      // Close the modal instead of reloading
      onClose();
      
      console.log('✅ Subscription update complete!');
      
    } catch (error) {
      console.error('❌ Subscription update failed:', error);
      setError('Failed to activate subscription. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionError = (err: any) => {
    console.error('PayPal subscription error:', err);
    setError('Payment failed. Please try again.');
    setLoading(false);
  };

  if (!isOpen) return null;

  const selectedPlanConfig = PAYPAL_CONFIG.plans[selectedPlan];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-lg opacity-90">
              Continue your learning journey with full access to Moklik
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            {/* Monthly Plan */}
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Monthly</h3>
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {PAYPAL_CONFIG.plans.monthly.priceMUR} MUR
                </div>
                <div className="text-gray-600">per month</div>
                <div className="text-sm text-gray-500">
                  (${PAYPAL_CONFIG.plans.monthly.priceUSD} USD)
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Full access to AI tutor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Unlimited problem solving</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Progress tracking</span>
                </div>
              </div>
            </div>

            {/* Yearly Plan */}
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all relative ${
                selectedPlan === 'yearly' 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Yearly</h3>
                <Crown className="w-6 h-6 text-purple-500" />
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {PAYPAL_CONFIG.plans.yearly.priceMUR} MUR
                </div>
                <div className="text-gray-600">per year</div>
                <div className="text-sm text-purple-600 font-medium">
                  Only {Math.round(PAYPAL_CONFIG.plans.yearly.priceMUR / 12)} MUR/month
                </div>
                <div className="text-sm text-gray-500">
                  (${PAYPAL_CONFIG.plans.yearly.priceUSD} USD)
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Full access to AI tutor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Unlimited problem solving</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Progress tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span>Save 400 MUR per year</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              What's included in your subscription:
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>24/7 AI tutor access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Step-by-step solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Document upload & analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Progress tracking & analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Unlimited problem solving</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Exam preparation materials</span>
              </div>
            </div>
          </div>

          {/* PayPal Buttons */}
          <div className="mb-6">
            <PayPalScriptProvider 
              options={{
                'clientId': PAYPAL_CONFIG.clientId,
                components: 'buttons',
                intent: 'subscription',
                vault: true,
                currency: PAYPAL_CONFIG.currency
              }}
            >
              <PayPalButtons
                style={{
                  shape: 'rect',
                  color: selectedPlan === 'yearly' ? 'black' : 'blue',
                  layout: 'vertical',
                  label: 'subscribe',
                  height: 55
                }}
                createSubscription={(data, actions) => {
                  return actions.subscription.create({
                    plan_id: selectedPlanConfig.id
                  });
                }}
                onApprove={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
                onCancel={() => console.log('Subscription cancelled by user')}
                disabled={loading}
              />
            </PayPalScriptProvider>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Processing your subscription...</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Secure payment powered by PayPal</p>
            <p className="mt-1">Cancel anytime from your account settings</p>
            <p className="mt-2 text-xs">
              Prices shown in MUR for reference. PayPal processes in USD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalSubscription;
