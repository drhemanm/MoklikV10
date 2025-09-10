import React, { useState } from 'react';
import { Check, Zap, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SubscriptionModal } from './SubscriptionModal';
import toast from 'react-hot-toast';

export function PricingPlans() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'premium'>('premium');

  const handleSelectPlan = (plan: 'trial' | 'premium') => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }
    
    setSelectedPlan(plan);
    setShowModal(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get unlimited access to Moklik's AI tutoring and writing feedback
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Trial Plan */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">7-Day Free Trial</h3>
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-blue-100">Experience all premium features</p>
          </div>
          
          <div className="p-8">
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-gray-900">Rs 0</span>
              <span className="text-gray-500 ml-2">/ 7 days</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Full access to AI math tutoring</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Writing review & feedback</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Document upload & analysis</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleSelectPlan('trial')}
              className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-blue-600"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
              <div className="w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
            </div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="text-2xl font-bold">Premium Access</h3>
              <Zap className="w-8 h-8" />
            </div>
            <p className="text-blue-100 relative z-10">Unlimited learning support</p>
          </div>
          
          <div className="p-8">
            <div className="flex items-baseline mb-8">
              <span className="text-4xl font-bold text-gray-900">Rs 100</span>
              <span className="text-gray-500 ml-2">/ month</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Everything in Free Trial</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Unlimited questions & problems</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Priority response time</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Downloadable progress reports</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>Advanced topic explanations</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleSelectPlan('premium')}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe Now
            </button>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              Billed monthly. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Guarantee Section */}
      <div className="mt-16 bg-blue-50 rounded-2xl p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">100% Satisfaction Guarantee</h3>
            </div>
            <p className="text-gray-600">
              If you're not completely satisfied with Moklik within the first 30 days, 
              we'll refund your subscription. No questions asked.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Try Demo First
            </button>
            <button
              onClick={() => handleSelectPlan('trial')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              What happens after my free trial ends?
            </h4>
            <p className="text-gray-600">
              After your 7-day trial, you'll be prompted to subscribe to our Premium plan to continue 
              using Moklik. We'll send you a reminder before your trial expires.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Can I cancel my subscription anytime?
            </h4>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time from your account settings. 
              You'll continue to have access until the end of your current billing period.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-gray-600">
              We accept all major credit cards, debit cards, and mobile payment options through our 
              secure payment processor, Stripe.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Is there a discount for students?
            </h4>
            <p className="text-gray-600">
              Yes! We offer special discounts for students and educational institutions. 
              Contact our support team with your school email for more information.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showModal && (
        <SubscriptionModal
          plan={selectedPlan}
          onClose={() => setShowModal(false)}
          price={selectedPlan === 'trial' ? 0 : 100}
        />
      )}
    </div>
  );
}