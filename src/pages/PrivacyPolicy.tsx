import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Shield, Eye, Lock, Globe, Database, UserCheck } from 'lucide-react';

export function PrivacyPolicy() {
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
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Last Updated:</strong> September 11, 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, email address, and password when you create an account</li>
                  <li>Profile information such as grade level and learning preferences</li>
                  <li>Payment information processed securely through PayPal</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Learning Data</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Questions you ask our AI tutor and our responses</li>
                  <li>Math problems you submit and solutions provided</li>
                  <li>Writing submissions and feedback given</li>
                  <li>Progress tracking data, achievements, and statistics</li>
                  <li>Usage patterns and learning analytics</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information, browser type, and operating system</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and local storage data for functionality</li>
                  <li>Log files and error reports for service improvement</li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Your Information */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-3">
                  <li><strong>Provide Educational Services:</strong> Deliver AI tutoring, track progress, and personalize learning experiences</li>
                  <li><strong>Process Payments:</strong> Handle subscriptions and billing through secure payment processors</li>
                  <li><strong>Improve Our Service:</strong> Analyze usage patterns to enhance AI responses and platform features</li>
                  <li><strong>Communicate:</strong> Send service updates, educational content, and respond to support requests</li>
                  <li><strong>Ensure Security:</strong> Detect and prevent fraud, abuse, and unauthorized access</li>
                  <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights and users' safety</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing and Disclosure</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="font-semibold">We do NOT sell, rent, or trade your personal information. We only share information in these limited circumstances:</p>
                
                <h3 className="text-lg font-semibold text-gray-900">Service Providers</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>OpenAI:</strong> AI tutoring content (anonymized where possible)</li>
                  <li><strong>Firebase/Google:</strong> Data storage and authentication services</li>
                  <li><strong>PayPal:</strong> Payment processing (financial information only)</li>
                  <li><strong>Analytics Services:</strong> Aggregated usage statistics (no personal identification)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6">Legal Requirements</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>When required by law or government authorities</li>
                  <li>To protect our rights, safety, or property</li>
                  <li>To prevent fraud or security threats</li>
                  <li>In connection with legal proceedings</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Data Security and Protection</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-3">
                  <li><strong>Encryption:</strong> All data transmitted using TLS/SSL encryption</li>
                  <li><strong>Secure Storage:</strong> Data stored on Google Firebase with enterprise-grade security</li>
                  <li><strong>Access Controls:</strong> Strict access limitations and authentication requirements</li>
                  <li><strong>Regular Monitoring:</strong> Continuous security monitoring and threat detection</li>
                  <li><strong>Data Minimization:</strong> We collect only necessary information for service provision</li>
                  <li><strong>Regular Backups:</strong> Secure, encrypted backups to prevent data loss</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Your Privacy Rights</h2>
              </div>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Under Mauritius Data Protection Act 2017 and international privacy laws, you have the right to:</p>
                
                <ul className="list-disc list-inside space-y-3">
                  <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Export your learning data in a portable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain types of data processing</li>
                  <li><strong>Withdraw Consent:</strong> Revoke consent for optional data uses</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <p className="text-blue-800">
                    <strong>To exercise your rights, contact us at:</strong> privacy@moklik.org
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
                  <li><strong>Closed Accounts:</strong> Most data deleted within 30 days of account closure</li>
                  <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
                  <li><strong>Anonymized Data:</strong> Learning patterns may be retained in anonymized form for service improvement</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy (COPPA Compliance)</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Moklik is designed for students, including those under 18. We comply with children's privacy laws:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>We do not knowingly collect personal information from children under 13 without parental consent</li>
                  <li>Parents can review, modify, or delete their child's information by contacting us</li>
                  <li>We implement additional safeguards for younger users</li>
                  <li>Educational data is used solely for learning purposes</li>
                </ul>
              </div>
            </section>

            {/* Section 8: International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Some of our service providers (OpenAI, Google) may process data outside Mauritius. We ensure:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Appropriate safeguards are in place for international transfers</li>
                  <li>Service providers comply with international privacy standards</li>
                  <li>Data is protected to the same standards regardless of location</li>
                </ul>
              </div>
            </section>

            {/* Section 9: Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>We may update this privacy policy to reflect changes in our practices or legal requirements. When we do:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>We will post the updated policy on this page</li>
                  <li>We will update the "Last Updated" date</li>
                  <li>For significant changes, we will notify users via email</li>
                  <li>Continued use of our service constitutes acceptance of changes</li>
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have questions about this privacy policy or our data practices, please contact us:</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <p>privacy@moklik.org</p>
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
                    <p>We will respond to privacy requests within 30 days</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Moklik</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
