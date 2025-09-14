import React, { useState } from 'react';
import { Lock, Crown, Calendar, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import PayPalSubscription from './PayPalSubscription';

const AccessDenied = ({ trialExpired = false, daysRemaining = 0 }) => {
  const [showPayment, setShowPayment] = useState(false);

  const handleUpgradeClick = () => {
    setShowPayment(true);
  };

  const handleSubscriptionSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                {trialExpired ? (
                  <Calendar className="w-10 h-10" />
                ) : (
                  <Lock className="w-10 h-10" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {trialExpired ? 'Free Trial Expired' : 'Premium Access Required'}
              </h1>
              
              <p className="text-lg opacity-90">
                {trialExpired 
                  ? 'Your 30-day free trial has ended. Subscribe to continue learning!'
                  : 'Upgrade to premium to access the full Moklik experience'
                }
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              
              {/* Trial Status */}
              {!trialExpired && daysRemaining > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">
                      Free Trial: {daysRemaining} days remaining
                    </span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Subscribe now to ensure uninterrupted access to your AI tutor.
                  </p>
                </div>
              )}

              {/* What You're Missing */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-purple-500" />
                  What you get with Premium:
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">24/7 AI Tutor Access</div>
                      <div className="text-sm text-gray-600">Get instant help with any math problem</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">Step-by-Step Solutions</div>
                      <div className="text-sm text-gray-600">Detailed explanations for every problem</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">Document Upload</div>
                      <div className="text-sm text-gray-600">Upload homework and get instant help</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">Progress Tracking</div>
                      <div className="text-sm text-gray-600">Monitor your learning journey</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">Personalized Learning</div>
                      <div className="text-sm text-gray-600">AI adapts to your learning style</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">Exam Preparation</div>
                      <div className="text-sm text-gray-600">Practice tests and study materials</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
                <h4 className="font-bold text-gray-800 mb-4 text-center">Choose Your Plan</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  
                  {/* Monthly */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">200 MUR</div>
                      <div className="text-gray-600 text-sm">per month</div>
                      <div className="flex items-center justify-center mt-2">
                        <Zap className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm text-blue-600">Monthly flexibility</span>
                      </div>
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-300 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        BEST VALUE
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">2000 MUR</div>
                      <div className="text-gray-600 text-sm">per year</div>
                      <div className="flex items-center justify-center mt-2">
                        <Crown className="w-4 h-4 text-purple-500 mr-1" />
                        <span className="text-sm text-purple-600">Save 17%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={handleUpgradeClick}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <span>Choose Your Plan</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Secure payment • Cancel anytime • 30-day money-back guarantee
                </p>
              </div>

              {/* Student Discount */}
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <div className="text-green-800 font-medium">🎓 Student Discount Available</div>
                  <div className="text-sm text-green-600 mt-1">
                    Contact support with your student ID for special pricing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>Trusted by students across Mauritius</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span>🔒 Secure Payment</span>
              <span>📱 Mobile Friendly</span>
              <span>🎯 Exam Focused</span>
            </div>
          </div>
        </div>
      </div>

      {/* PayPal Subscription Modal */}
      <PayPalSubscription
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handleSubscriptionSuccess}
      />
    </>
  );
};

export default AccessDenied;
