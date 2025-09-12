import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Star, CheckCircle, Crown, Zap, Check } from 'lucide-react';
import { PricingSection } from '../components/PricingSection';
import { AuthModal } from '../components/auth/AuthModal';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionService } from '../services/SubscriptionService';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    paypal: any;
  }
}

export function PricingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState({ monthly: false, yearly: false });
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  const { user } = useAuth();
  const { subscription, refreshSubscription } = useSubscription();
  const navigate = useNavigate();

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Load PayPal SDK for logged-in users
  useEffect(() => {
    if (user && !window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.addEventListener('load', () => setPaypalLoaded(true));
      document.body.appendChild(script);
    } else if (user && window.paypal) {
      setPaypalLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (paypalLoaded && user) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, user]);

  const renderPayPalButtons = () => {
    // Monthly Plan Button
    if (window.paypal && document.getElementById('paypal-monthly')) {
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: import.meta.env.VITE_PAYPAL_MONTHLY_PLAN_ID
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setLoading(prev => ({ ...prev, monthly: true }));
            
            await SubscriptionService.upgradeToSubscription(
              user!.uid,
              'monthly',
              data.subscriptionID
            );
            
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
            plan_id: import.meta.env.VITE_PAYPAL_YEARLY_PLAN_ID
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setLoading(prev => ({ ...prev, yearly: true }));
            
            await SubscriptionService.upgradeToSubscription(
              user!.uid,
              'yearly',
              data.subscriptionID
            );
            
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

  // Render PayPal-enabled pricing for logged-in users
  const renderUpgradeSection = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upgrade now to continue your learning journey with unlimited access
          </p>
          {subscription && (
            <p className="text-lg text-blue-600 mt-4">
              {subscription.daysRemaining} days remaining in your free trial
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <span className="ml-2 text-blue-600">Processing...</span>
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
                  <span className="ml-2 text-purple-600">Processing...</span>
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
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to={user ? "/dashboard" : "/"} 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {user ? "Dashboard" : "Home"}</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Moklik</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        {user ? renderUpgradeSection() : <PricingSection openAuth={openAuth} />}
      </div>

      {/* Features Comparison */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-50 border-b-2 border-gray-200"></th>
                  <th className="p-4 bg-green-50 border-b-2 border-green-200 text-green-800">Free Trial</th>
                  <th className="p-4 bg-blue-50 border-b-2 border-blue-200 text-blue-800">Monthly</th>
                  <th className="p-4 bg-purple-50 border-b-2 border-purple-200 text-purple-800">Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">AI Math Tutoring</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Writing Review & Feedback</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Progress Tracking & Badges</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Priority AI Response</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Advanced Analytics</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Premium Study Resources</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Priority Support</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">Email</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Price</td>
                  <td className="p-4 text-center font-medium">Free for 1 month</td>
                  <td className="p-4 text-center font-medium">Rs 200/month</td>
                  <td className="p-4 text-center font-medium">Rs 2,000/year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Questions about our plans? Contact us at <a href="mailto:support@moklik.org" className="text-blue-600 hover:text-blue-700">support@moklik.org</a>
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal - Only show for non-logged-in users */}
      {showAuthModal && !user && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  );
}
