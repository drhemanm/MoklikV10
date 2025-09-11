import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Star, CheckCircle } from 'lucide-react';
import { PricingSection } from '../components/PricingSection';
import { AuthModal } from '../components/auth/AuthModal';

export function PricingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
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
        <PricingSection openAuth={openAuth} />
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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  );
}
