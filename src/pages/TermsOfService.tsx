import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Scale, AlertTriangle, CreditCard, Users, Book, Shield } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Moklik</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Please read these terms carefully before using Moklik's AI tutoring services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Last Updated:</strong> September 11, 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            
            {/* Section 1: Agreement to Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>By accessing or using Moklik ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.</p>
                
                <p>These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Students using our AI tutoring services</li>
                  <li>Parents or guardians creating accounts for minors</li>
                  <li>Teachers or educators using our platform</li>
                  <li>Any individual accessing our website or mobile applications</li>
                </ul>
              </div>
            </section>

            {/* Section 2: Description of Service */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Book className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Description of Service</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Moklik provides AI-powered educational services, including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Step-by-step mathematics tutoring and problem-solving assistance</li>
                  <li>Writing review and feedback services</li>
                  <li>Progress tracking and gamification features</li>
                  <li>Educational content and resources</li>
                  <li>Community forum and peer interaction features</li>
                </ul>

                <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-semibold">Important Notice</p>
                      <p className="text-yellow-700">Moklik is an educational tool and does not replace formal education, qualified teachers, or professional tutoring. Our AI provides assistance and guidance but users are responsible for their own learning outcomes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: User Accounts */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. User Accounts and Responsibilities</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Account Creation</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be at least 13 years old to create an account independently</li>
                  <li>Parents/guardians may create accounts for children under 18</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Acceptable Use</h3>
                <p>You agree to use Moklik only for lawful educational purposes. You must NOT:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Share your account credentials with others</li>
                  <li>Use the service to cheat on exams or submit AI-generated work as your own</li>
                  <li>Attempt to reverse engineer or manipulate our AI systems</li>
                  <li>Post inappropriate, offensive, or harmful content in forums</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Use the service for commercial purposes without authorization</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Payment and Billing */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Payment Terms and Billing</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Subscription Plans</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Free Trial:</strong> 1 month of full access to all features</li>
                  <li><strong>Monthly Plan:</strong> Rs 200 per month, billed monthly</li>
                  <li><strong>Yearly Plan:</strong> Rs 2,000 per year, billed annually</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Payment Processing</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All payments are processed securely through PayPal</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>All fees are in Mauritian Rupees (Rs) unless otherwise stated</li>
                  <li>You authorize us to charge your selected payment method</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Cancellation and Refunds</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may cancel your subscription at any time from your account settings</li>
                  <li>Cancellation takes effect at the end of the current billing period</li>
                  <li>We offer a 30-day money-back guarantee for new subscribers</li>
                  <li>Refunds are processed within 5-10 business days</li>
                  <li>Free trial users are not eligible for refunds</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Intellectual Property */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Our Content</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Moklik platform, software, and educational content are owned by us</li>
                  <li>AI-generated tutoring responses and explanations are our property</li>
                  <li>You may not copy, reproduce, or distribute our content without permission</li>
                  <li>Moklik name, logo, and branding are our registered trademarks</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Your Content</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain ownership of questions, work, and content you submit</li>
                  <li>You grant us license to use your content to provide tutoring services</li>
                  <li>We may use anonymized learning data to improve our AI systems</li>
                  <li>You are responsible for ensuring you have rights to content you upload</li>
                </ul>
              </div>
            </section>

            {/* Section 6: Disclaimers and Limitations */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Disclaimers and Limitation of Liability</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Service Disclaimers</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Moklik is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee specific learning outcomes or grade improvements</li>
                  <li>AI responses may occasionally contain errors or inaccuracies</li>
                  <li>Service availability may be interrupted for maintenance or technical issues</li>
                  <li>We are not responsible for third-party content or external links</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Limitation of Liability</h3>
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>We are not responsible for academic performance or examination results</li>
                  <li>Users assume full responsibility for their educational decisions</li>
                </ul>

                <div className="bg-red-50 p-4 rounded-lg mt-6">
                  <p className="text-red-800 font-semibold">Academic Integrity Notice</p>
                  <p className="text-red-700">Students are responsible for maintaining academic integrity. Using AI assistance inappropriately (such as submitting AI work as your own) may violate your school's academic policies.</p>
                </div>
              </div>
            </section>

            {/* Section 7: Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Your privacy is important to us. Our data collection and use practices are detailed in our <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>, which forms part of these Terms.</p>
                
                <p>Key points:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We collect data necessary to provide educational services</li>
                  <li>Learning data helps personalize your experience</li>
                  <li>We comply with Mauritius Data Protection Act 2017</li>
                  <li>You have rights regarding your personal data</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Account Termination</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Your Right to Terminate</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may delete your account at any time</li>
                  <li>Cancelling subscription stops future billing but maintains access until period ends</li>
                  <li>Account deletion removes your data according to our Privacy Policy</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Our Right to Terminate</h3>
                <p>We may suspend or terminate accounts for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of subscription fees</li>
                  <li>Abuse of our systems or other users</li>
                </ul>
              </div>
            </section>

            {/* Section 9: Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law and Disputes</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>These Terms are governed by the laws of Mauritius</li>
                  <li>Any disputes will be resolved in Mauritian courts</li>
                  <li>We encourage resolving disputes through direct communication first</li>
                  <li>For serious disputes, mediation may be required before litigation</li>
                </ul>
              </div>
            </section>

            {/* Section 10: Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to These Terms</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We may update these Terms to reflect changes in our service or legal requirements:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Updated Terms will be posted on this page with a new "Last Updated" date</li>
                  <li>Significant changes will be communicated via email</li>
                  <li>Continued use after changes constitutes acceptance</li>
                  <li>If you disagree with changes, you may terminate your account</li>
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>For questions about these Terms of Service, please contact us:</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p>legal@moklik.org</p>
                    <p>contact@moklik.org</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <p>+230 5259 3285</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                    <p>Moklik Education Services<br />
                    Mauritius</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p>We will respond to legal inquiries within 5 business days</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                By using Moklik, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/privacy" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Privacy Policy
                </Link>
                <Link 
                  to="/" 
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Moklik</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
