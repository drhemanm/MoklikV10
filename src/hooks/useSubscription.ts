import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Menu, 
  X, 
  Home, 
  MessageSquare, 
  PenTool,
  LogOut,
  Mail,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  BarChart3,
  Bell,
  HelpCircle,
  Crown,
  Calendar,
  Download,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const { subscription, loading: subscriptionLoading, plan, daysRemaining, subscriptionStatus, hasAccess } = useSubscription();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsAccountDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { path: '/chat', label: 'AI Tutor', icon: <Brain className="w-4 h-4" /> },
    { path: '/forum', label: 'Forum', icon: <MessageSquare className="w-4 h-4" /> },
    { path: '/writing-review', label: 'Writing Review', icon: <PenTool className="w-4 h-4" /> },
    { path: '/contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> }
  ];

  // Real subscription data
  const isOnTrial = subscriptionStatus === 'trial_active';
  const isTrialExpired = subscriptionStatus === 'trial_expired';
  const trialDaysLeft = daysRemaining;
  
  // Get user-friendly plan name
  const getPlanDisplayName = (planName: string): string => {
    const planMap: { [key: string]: string } = {
      'free': 'Free Trial',
      'monthly': 'Monthly Plan',
      'yearly': 'Yearly Plan'
    };
    return planMap[planName] || planName.charAt(0).toUpperCase() + planName.slice(1);
  };

  const userPlan = getPlanDisplayName(plan);

  // Get pricing display with MUR currency
  const getPlanPrice = (planName: string): string => {
    const priceMap: { [key: string]: string } = {
      'free': '',
      'monthly': 'MUR 200/month',
      'yearly': 'MUR 2000/year'
    };
    return priceMap[planName] || '';
  };

  // Enhanced status display with trial expiration logic
  const getStatusDisplay = () => {
    if (subscriptionLoading) return 'Loading...';
    
    // Critical: Trial expired - must upgrade
    if (isTrialExpired) return 'Trial Expired - Upgrade Required';
    
    // Trial active but ending soon
    if (isOnTrial) {
      if (trialDaysLeft === 0) return 'Trial ends today!';
      if (trialDaysLeft === 1) return '1 day left in trial';
      return `${trialDaysLeft} days left in trial`;
    }
    
    // Payment issues
    if (subscriptionStatus === 'payment_required') return 'Payment Required';
    if (subscriptionStatus === 'canceled') return 'Subscription Canceled';
    
    // Active subscription
    if (subscriptionStatus === 'active') {
      const price = getPlanPrice(plan);
      return price ? `${userPlan} - ${price}` : userPlan;
    }
    
    // Fallback
    return 'Free Trial';
  };

  // Enhanced status color with urgency levels
  const getStatusColor = () => {
    if (isTrialExpired || subscriptionStatus === 'canceled') return 'text-red-600';
    if (subscriptionStatus === 'payment_required') return 'text-orange-600';
    if (isOnTrial) {
      if (trialDaysLeft <= 3) return 'text-red-600'; // Urgent
      if (trialDaysLeft <= 7) return 'text-orange-600'; // Warning
      return 'text-blue-600'; // Normal trial
    }
    if (subscriptionStatus === 'active') return 'text-green-600';
    return 'text-gray-600';
  };

  // Check if user should see urgent upgrade prompts
  const shouldShowUrgentUpgrade = () => {
    return isTrialExpired || (isOnTrial && trialDaysLeft <= 3);
  };

  // Check if user should see warning upgrade prompts
  const shouldShowWarningUpgrade = () => {
    return isOnTrial && trialDaysLeft <= 7 && trialDaysLeft > 3;
  };

  const accountMenuItems = [
    {
      section: 'Account',
      items: [
        { 
          label: 'Profile Settings', 
          icon: <User className="w-4 h-4" />, 
          action: () => navigate('/settings/profile'),
          description: 'Manage your personal information'
        },
        { 
          label: 'Preferences', 
          icon: <Settings className="w-4 h-4" />, 
          action: () => navigate('/settings/preferences'),
          description: 'Customize your experience'
        },
        { 
          label: 'Notifications', 
          icon: <Bell className="w-4 h-4" />, 
          action: () => navigate('/settings/notifications'),
          description: 'Control email and push notifications'
        }
      ]
    },
    {
      section: 'Subscription',
      items: [
        ...(isOnTrial || isTrialExpired ? [{
          label: isTrialExpired ? 'Upgrade Now' : 'Upgrade Plan',
          icon: <Crown className="w-4 h-4" />,
          action: () => navigate('/pricing'),
          description: isTrialExpired ? 'Subscribe to continue using Moklik' : `${trialDaysLeft} days left in trial`
        }] : []),
        { 
          label: 'Billing & Usage', 
          icon: <CreditCard className="w-4 h-4" />, 
          action: () => navigate('/billing'),
          description: subscriptionStatus === 'active' ? 'Manage payment and invoices' : 'View billing information'
        },
        { 
          label: 'Usage Analytics', 
          icon: <BarChart3 className="w-4 h-4" />, 
          action: () => navigate('/analytics'),
          description: 'View your learning progress and stats'
        }
      ]
    },
    {
      section: 'Support',
      items: [
        { 
          label: 'Help Center', 
          icon: <HelpCircle className="w-4 h-4" />, 
          action: () => window.open('/help', '_blank'),
          description: 'Documentation and tutorials'
        },
        { 
          label: 'Export Data', 
          icon: <Download className="w-4 h-4" />, 
          action: () => navigate('/settings/export'),
          description: 'Download your learning data'
        }
      ]
    }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">Moklik</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Account Dropdown Trigger */}
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="hidden md:flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </div>
                      <div className={`text-xs ${getStatusColor()}`}>
                        {getStatusDisplay()}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isAccountDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Account Dropdown Menu */}
                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {isTrialExpired ? (
                                <>
                                  <Shield className="w-3 h-3 text-red-500 animate-pulse" />
                                  <span className="text-xs text-red-600 font-bold">
                                    Trial Expired - Upgrade Required
                                  </span>
                                </>
                              ) : isOnTrial ? (
                                <>
                                  <Calendar className={`w-3 h-3 ${
                                    trialDaysLeft <= 3 ? 'text-red-500 animate-pulse' : 
                                    trialDaysLeft <= 7 ? 'text-orange-500' : 'text-blue-500'
                                  }`} />
                                  <span className={`text-xs font-medium ${
                                    trialDaysLeft <= 3 ? 'text-red-600 font-bold' : 
                                    trialDaysLeft <= 7 ? 'text-orange-600' : 'text-blue-600'
                                  }`}>
                                    {trialDaysLeft === 0 ? 'Trial ends today!' :
                                     trialDaysLeft === 1 ? '1 day left!' :
                                     `${trialDaysLeft} days left`}
                                  </span>
                                </>
                              ) : subscriptionStatus === 'payment_required' ? (
                                <>
                                  <CreditCard className="w-3 h-3 text-orange-500 animate-pulse" />
                                  <span className="text-xs text-orange-600 font-bold">
                                    Payment Required
                                  </span>
                                </>
                              ) : subscriptionStatus === 'active' ? (
                                <>
                                  <Crown className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-600 font-medium">
                                    {userPlan}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Crown className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600 font-medium">
                                    {userPlan}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Comprehensive Upgrade Banner Logic */}
                        {shouldShowUrgentUpgrade() || shouldShowWarningUpgrade() ? (
                          <div className={`mx-4 mb-4 p-4 rounded-lg border-2 ${
                            shouldShowUrgentUpgrade()
                              ? 'bg-red-50 border-red-300 shadow-lg' 
                              : 'bg-orange-50 border-orange-300'
                          }`}>
                            <div className="flex items-center space-x-2 mb-3">
                              <Crown className={`w-5 h-5 ${
                                shouldShowUrgentUpgrade() ? 'text-red-600 animate-pulse' : 'text-orange-600'
                              }`} />
                              <span className={`text-sm font-bold ${
                                shouldShowUrgentUpgrade() ? 'text-red-800' : 'text-orange-800'
                              }`}>
                                {isTrialExpired ? 'Trial Expired' : 
                                 trialDaysLeft === 0 ? 'Trial Ends Today' :
                                 trialDaysLeft <= 3 ? 'Trial Ending Soon' : 
                                 'Upgrade Available'}
                              </span>
                            </div>
                            <p className={`text-sm mb-4 leading-relaxed ${
                              shouldShowUrgentUpgrade() ? 'text-red-700 font-medium' : 'text-orange-700'
                            }`}>
                              {isTrialExpired 
                                ? 'Your free trial has ended. Subscribe now to continue accessing Moklik AI tutoring, homework help, and premium features.'
                                : trialDaysLeft === 0
                                ? 'Your trial ends today! Subscribe now to avoid interruption to your learning.'
                                : trialDaysLeft === 1
                                ? 'Only 1 day left in your trial! Choose your plan to continue learning.'
                                : `${trialDaysLeft} days remaining in your trial. Secure your access with a subscription.`
                              }
                            </p>
                            <div className="space-y-3">
                              <button
                                onClick={() => {
                                  navigate('/pricing?plan=yearly&utm_source=header_urgent');
                                  setIsAccountDropdownOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                                  shouldShowUrgentUpgrade() 
                                    ? 'bg-white border-green-300 hover:border-green-400 hover:shadow-md' 
                                    : 'bg-white border-blue-300 hover:border-blue-400'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">Yearly Plan - Best Value</div>
                                    <div className="text-sm text-gray-700 font-medium">MUR 2000/year</div>
                                    <div className="text-xs text-green-600 font-medium mt-1">Save MUR 400 vs monthly!</div>
                                  </div>
                                  <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                                    RECOMMENDED
                                  </div>
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  navigate('/pricing?plan=monthly&utm_source=header_urgent');
                                  setIsAccountDropdownOpen(false);
                                }}
                                className="w-full text-left p-3 bg-white rounded-lg border hover:border-gray-400 transition-all duration-200"
                              >
                                <div className="text-sm font-medium text-gray-900">Monthly Plan</div>
                                <div className="text-sm text-gray-700">MUR 200/month</div>
                                <div className="text-xs text-gray-500 mt-1">Flexible monthly billing</div>
                              </button>
                            </div>
                            {shouldShowUrgentUpgrade() && (
                              <div className="mt-3 pt-3 border-t border-red-200">
                                <p className="text-xs text-red-600 font-medium text-center">
                                  Subscribe now to restore access immediately
                                </p>
                              </div>
                            )}
                          </div>
                        ) : null}

                        {accountMenuItems.map((section, sectionIndex) => (
                          <div key={section.section}>
                            {sectionIndex > 0 && <div className="border-t border-gray-100 my-2" />}
                            <div className="px-4 py-1">
                              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {section.section}
                              </div>
                            </div>
                            {section.items.map((item) => (
                              <button
                                key={item.label}
                                onClick={() => {
                                  item.action();
                                  setIsAccountDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 group"
                              >
                                <div className="text-gray-400 group-hover:text-gray-600">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 group-hover:text-gray-900">
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {item.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors duration-150 flex items-center space-x-3 group"
                        >
                          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          <div className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                            Sign Out
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user && (
                <>
                  <div className="flex items-center px-3 py-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {subscriptionLoading ? 'Loading...' : getStatusDisplay()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Account Options */}
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/settings/profile"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/billing"
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Billing</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
