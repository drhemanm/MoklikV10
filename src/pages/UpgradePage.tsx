// src/pages/UpgradePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Check, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionService } from '../services/SubscriptionService';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    paypal: any;
  }
}

export function UpgradePage() {
  const { user } = useAuth();
  const { subscription, refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ monthly: false, yearly: false });
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // Load PayPal SDK
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.addEventListener('load', () => setPaypalLoaded(true));
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (paypalLoaded) {
      renderPayPalButtons();
    }
  }, [paypalLoaded]);

  const renderPayPalButtons = () => {
    // Monthly Plan Button
    if (window.paypal && document.getElementById('paypal-monthly')) {
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: process.env.REACT_APP_PAYPAL_MONTHLY_PLAN_ID
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setLoading(prev => ({ ...prev, monthly: true }));
            
            // Upgrade user subscription in our database
            await SubscriptionService.upgradeToSubscription(
              user!.uid,
              'monthly',
              data.subscriptionID
            );
            
            // Refresh subscription status
            refreshSubscription();
            
            toast.success('Successfully subscribed to Monthly Plan!');
            navigate('/dashboard');
          } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Failed to activate subscription. Please try again.');
          } finally {
            setLoading(prev => ({ ...prev, monthly: false }));
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
          setLoading(prev => ({ ...prev, monthly: false }));
        }
      }).render('#paypal-monthly');
    }

    // Yearly Plan Button
    if (window.paypal && document.getElementById('paypal-yearly')) {
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: process.env.REACT_APP_PAYPAL_YEARLY_PLAN_ID
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setLoading(prev => ({ ...prev, yearly: true }));
            
            // Upgrade user subscription in our database
            await SubscriptionService.upgradeToSubscription(
              user!.uid,
              'yearly',
              data.subscriptionID
            );
            
            // Refresh subscription status
            refreshSubscription();
            
            toast.success('Successfully subscribed to Yearly Plan!');
            navigate('/dashboard');
          } catch (error) {
            console.error('Subscription error:', error);
            toast.error('Failed to activate subscription. Please try again.');
          } finally {
            setLoading(prev => ({ ...prev, yearly: false }));
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
          setLoading(prev => ({ ...prev, yearly: false }));
        }
      }).render('#paypal-yearly');
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Upgrade to Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Upgrade now to continue your learning journey with unlimited access
          </p>
          {subscription && (
            <p className="text-lg text-blue-600 mt-2">
              {subscription.daysRemaining} days remaining in your free trial
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">Rs 200</span>
                <span className="text-gray-600 ml-2">per month</span>
              </div>
              <p className="text-gray-600">
                Perfect for ongoing learning. Cancel anytime.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Unlimited AI tutoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Priority response times</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Advanced analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Email support</span>
              </div>
            </div>

            {/* PayPal Button Container */}
            <div id="paypal-monthly" className="min-h-[45px]">
              {loading.monthly && (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Processing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Save Rs 400
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly Plan</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-purple-600">Rs 2,000</span>
                <span className="text-gray-600 ml-2">per year</span>
              </div>
              <p className="text-gray-600">
                Best value! Get 2 months free compared to monthly.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Everything in Monthly</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Premium study resources</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Exclusive workshops</span>
              </div>
            </div>

            {/* PayPal Button Container */}
            <div id="paypal-yearly" className="min-h-[45px]">
              {loading.yearly && (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="ml-2">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12 p-6 bg-green-50 rounded-xl">
          <p className="text-green-800 font-semibold mb-2">30-Day Money-Back Guarantee</p>
          <p className="text-green-700">
            Not satisfied with your subscription? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
