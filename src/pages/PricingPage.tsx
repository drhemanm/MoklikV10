import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Star, CheckCircle } from 'lucide-react';
import { PricingPlans } from '../components/pricing/PricingPlans';

export function PricingPage() {
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
        <PricingPlans />
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who've improved their grades with Moklik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "I went from struggling with math to getting an A in my O-Levels. The step-by-step 
                explanations and practice problems made all the difference!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">Student, Form 5</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The writing feedback feature helped me improve my essays dramatically. My teacher 
                was impressed with how much my work improved in just a few weeks!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Raj K.</p>
                  <p className="text-sm text-gray-600">Student, Form 4</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "As a parent, I love that I can see my daughter's progress. The subscription is 
                worth every rupee - much more affordable than private tutoring!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Anita P.</p>
                  <p className="text-sm text-gray-600">Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <th className="p-4 bg-blue-50 border-b-2 border-blue-200 text-blue-800">Free Trial</th>
                  <th className="p-4 bg-indigo-50 border-b-2 border-indigo-200 text-indigo-800">Premium</th>
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
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Writing Review & Feedback</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Document Upload & Analysis</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Progress Tracking</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Unlimited Questions</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">Limited</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Priority Response</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Downloadable Reports</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 font-medium">Advanced Topics</td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <span className="text-gray-500">—</span>
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Price</td>
                  <td className="p-4 text-center font-medium">Free for 7 days</td>
                  <td className="p-4 text-center font-medium">Rs 100/month</td>
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
    </div>
  );
}