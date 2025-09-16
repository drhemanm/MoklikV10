// Create: src/components/PaymentSuccessScreen.tsx
import React, { useEffect } from 'react';
import { CheckCircle, Crown, Star, Zap, X } from 'lucide-react';

interface PaymentSuccessScreenProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData?: {
    subscriptionId: string;
    planId: 'monthly' | 'yearly';
    status: string;
  };
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ 
  isOpen, 
  onClose, 
  subscriptionData 
}) => {
  // Auto-close after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const planName = subscriptionData?.planId === 'yearly' ? 'Yearly Premium' : 'Monthly Premium';
  const savings = subscriptionData?.planId === 'yearly' ? 'Save 400 MUR per year!' : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-bounce-in">
        
        {/* Success Animation */}
        <div className="text-center p-8">
          <div className="relative">
            {/* Animated Success Circle */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>
            
            {/* Confetti Effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <Star className="w-4 h-4 text-yellow-400 animate-ping" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="absolute top-4 left-1/4">
              <Zap className="w-3 h-3 text-blue-400 animate-ping" style={{ animationDelay: '0.4s' }} />
            </div>
            <div className="absolute top-2 right-1/4">
              <Crown className="w-4 h-4 text-purple-400 animate-ping" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Payment Successful!
          </h2>
          
          <p className="text-lg text-gray-600 mb-4">
            Welcome to Moklik Premium!
          </p>

          {/* Plan Details */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-800">{planName}</span>
            </div>
            
            {savings && (
              <p className="text-sm text-purple-600 font-medium">{savings}</p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Subscription ID: {subscriptionData?.subscriptionId?.slice(0, 8)}...
            </p>
          </div>

          {/* Features Unlocked */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">✨ You now have access to:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>24/7 AI tutor access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Unlimited problem solving</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Advanced progress tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Priority customer support</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Start Learning Now! 🚀
            </button>
            
            <p className="text-xs text-gray-500">
              This dialog will close automatically in 10 seconds
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;
