import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  Play,
  Award,
  Smartphone,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  PenTool,
  Users
} from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import { useUserCount } from '../hooks/useUserCount';
import { PricingSection } from '../components/PricingSection';

// Live User Counter Component
function LiveUserCounter() {
  const { userCount, loading, error } = useUserCount();

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600">1,200+ students learning with Moklik</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 mb-4">
      <div className="relative">
        <Users className="w-5 h-5 text-blue-600" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      <span className="text-gray-700 font-medium">
        <span className="text-blue-600 font-bold text-lg">
          {userCount.toLocaleString()}
        </span>
        {' '}students already learning with Moklik
      </span>
    </div>
  );
}

export function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Moklik</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => openAuth('login')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => openAuth('register')}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI Math Tutor for
              <span className="text-blue-600 block">O-Level Success</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Get instant help on past papers, master problem-solving step-by-step, 
              and track your progress with Mauritius' most advanced AI mathematics tutor.
            </p>

            {/* Live User Counter */}
            <LiveUserCounter />

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-8">
              <Link
                to="/demo"
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo - No Sign Up</span>
              </Link>
              
              <button
                onClick={() => openAuth('register')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all"
              >
                Start Free Trial
              </button>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Tutor</h3>
                    <p className="text-sm text-gray-500">Ready to help</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 mb-2"><strong>Student:</strong> How do I solve x² + 5x + 6 = 0?</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">
                    <strong>Moklik:</strong> Let's solve this step by step! This is a quadratic equation. 
                    We can use factorization. Looking for two numbers that multiply to 6 and add to 5...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Students Choose Moklik
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology meets proven teaching methods for the ultimate learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Step-by-Step Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Never get stuck again. Our AI breaks down complex problems into easy-to-understand steps, 
                just like having a personal tutor beside you.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Writing & Math Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive feedback on both mathematical solutions and written work. 
                Improve grammar, structure, and problem-solving skills.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch your skills grow with detailed analytics, achievement badges, and 
                personalized study recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Everything You Need to Excel in O-Level Maths
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">24/7 AI Tutor Available</h3>
                    <p className="text-gray-600">Get help anytime, anywhere. No more waiting for tutoring sessions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Writing & Math Excellence</h3>
                    <p className="text-gray-600">Comprehensive feedback on essays, reports, and mathematical solutions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mobile-First Learning</h3>
                    <p className="text-gray-600">Study on your phone, tablet, or computer. Scan problems with your camera.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Gamified Experience</h3>
                    <p className="text-gray-600">Earn XP, unlock achievements, and compete with friends to stay motivated.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Your Progress</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Level 5
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Algebra</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Trigonometry</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Calculus</span>
                      <span>91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium">15 Day Streak</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">12 Badges</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">1,250 XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection openAuth={openAuth} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Math Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the power of AI tutoring and unlock your potential in mathematics
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Try Free Demo</span>
            </Link>
            
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Brain className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Moklik</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Mauritius' leading AI-powered mathematics tutor, helping O-Level students 
                achieve their academic goals with personalized, step-by-step guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/demo" className="hover:text-white transition-colors">Try Demo</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@moklik.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>5259 3285</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Moklik. All rights reserved. Designed and developed with ❤️ for Mauritian students.</p>
          </div>
        </div>
      </footer>

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
