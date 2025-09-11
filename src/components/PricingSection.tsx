import { Check, Zap, Crown } from 'lucide-react';
import { Brain } from 'lucide-react';

interface PricingSectionProps {
  openAuth: (mode: 'login' | 'register') => void;
}

export function PricingSection({ openAuth }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a free month, then choose the plan that works best for your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Trial */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-green-600">Free</span>
                <span className="text-gray-600 ml-2">for 1 month</span>
              </div>
              <p className="text-gray-600 mb-8">
                Get full access to all features for your first month. No credit card required!
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Unlimited AI tutoring sessions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Writing & math review</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Progress tracking & badges</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Mobile app access</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Community forum</span>
              </div>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="w-full bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">Rs 200</span>
                <span className="text-gray-600 ml-2">per month</span>
              </div>
              <p className="text-gray-600 mb-8">
                Perfect for ongoing learning. Cancel anytime, no long-term commitment required.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Everything in Free Trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Priority AI response times</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Advanced progress analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Personalized study plans</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Email support</span>
              </div>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Then Rs 200/month after trial
            </p>
          </div>

          {/* Yearly Plan */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-200 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                Save Rs 400
              </span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly Plan</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">Rs 2,000</span>
                <span className="text-gray-600 ml-2">per year</span>
              </div>
              <p className="text-gray-600 mb-8">
                Best value for serious students. Get 2 months free compared to monthly billing.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Everything in Monthly Plan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Save Rs 400 per year</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Premium study resources</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Exclusive webinars & workshops</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-700">Priority customer support</span>
              </div>
            </div>

            <button
              onClick={() => openAuth('register')}
              className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Then Rs 2,000/year after trial
            </p>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <span className="font-semibold">30-day money-back guarantee.</span> Not satisfied? Get a full refund, no questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
