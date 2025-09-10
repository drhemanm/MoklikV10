import React, { useState } from 'react';
import { X, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { loadStripe } from '@stripe/stripe-js';
// @ts-ignore
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast as toastLib } from 'react-hot-toast';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

interface SubscriptionModalProps {
  plan: 'trial' | 'premium';
  price: number;
  onClose: () => void;
}

function CheckoutForm({ plan, price, onClose }: SubscriptionModalProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // For trial, we don't need to charge
      if (plan === 'trial') {
        // Simulate API call to start trial
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsComplete(true);
        toastLib.success('Your 7-day free trial has started!');
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 2000);
        return;
      }

      // For premium plan, process payment
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        setIsComplete(true);
        toastLib.success('Payment successful! Your subscription is now active.');
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      toastLib.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {plan === 'premium' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">
            {plan === 'trial' ? '7-Day Free Trial' : 'Monthly Subscription'}
          </span>
          <span className="font-medium">
            Rs {price}
          </span>
        </div>
        {plan === 'premium' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax</span>
            <span className="text-gray-500">Rs 0</span>
          </div>
        )}
        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>Rs {price}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isProcessing || isComplete}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || isComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : isComplete ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Complete!</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>{plan === 'trial' ? 'Start Free Trial' : 'Subscribe Now'}</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
        {plan === 'premium' && ' Your card will be charged Rs 100 monthly.'}
      </p>
    </form>
  );
}

export function SubscriptionModal({ plan, price, onClose }: SubscriptionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {plan === 'trial' ? 'Start Your Free Trial' : 'Complete Your Subscription'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} price={price} onClose={onClose} />
          </Elements>
        </div>
      </motion.div>
    </div>
  );
}