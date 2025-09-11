// src/components/layout/EnhancedLayout.tsx
import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Menu, 
  X, 
  Home, 
  MessageSquare, 
  PenTool,
  Mail,
  Settings,
  BarChart3,
  HelpCircle,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Upload,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { Typography, Card, Badge, Button } from '../ui/ComponentLibrary';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  description?: string;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  };
  requiresPro?: boolean;
}

export function EnhancedLayout({ children, showSidebar = true }: EnhancedLayoutProps) {
  const { user } = useAuth();
  const { subscriptionStatus, trialDaysLeft, isOnTrial, isTrialExpired } = useSubscription();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      description: 'Overview and quick actions'
    },
    {
      id: 'ai-tutor',
      label: 'AI Tutor',
      icon: Brain,
      path: '/chat',
      description: 'Get instant math help',
      badge: { text: 'AI', variant: 'info' }
    },
    {
      id: 'learning',
      label: 'Learning Path',
      icon: BookOpen,
      path: '/learning',
      description: 'Structured courses',
      requiresPro: true
    },
    {
      id: 'homework',
      label: 'Homework Help',
      icon: Upload,
      path: '/homework',
      description: 'Upload and analyze assignments'
    },
    {
      id: 'writing',
      label: 'Writing Review',
      icon: PenTool,
      path: '/writing-review',
      description: 'Essay feedback and improvement'
    },
    {
      id: 'forum',
      label: 'Study Forum',
      icon: Users,
      path: '/forum',
      description: 'Connect with other students'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      path: '/progress',
      description: 'Track your learning journey'
    },
    {
      id: 'schedule',
      label: 'Study Schedule',
      icon: Calendar,
      path: '/schedule',
      description: 'Plan your study time',
      requiresPro: true
    }
  ];

  const supportItems: NavItem[] = [
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      path: '/help',
      description: 'Guides and tutorials'
    },
    {
      id: 'contact',
      label: 'Contact Support',
      icon: Mail,
      path: '/contact',
      description: 'Get help from our team'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Account and preferences'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const canAccessFeature = (item: NavItem) => {
    if (!item.requiresPro) return true;
    return subscriptionStatus === 'active' || isOnTrial;
  };

  const handleNavClick = (item: NavItem) => {
    if (!canAccessFeature(item)) {
      navigate('/pricing');
      return;
    }
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={`flex items-center px-4 py-6 border-b border-gray-100 ${sidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <Typography.H4 className="text-gray-900">
              Moklik
            </Typography.H4>
          )}
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            icon={sidebarCollapsed ? ChevronRight : ChevronLeft}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
          />
        )}
      </div>

      {/* Search Bar */}
      {(!sidebarCollapsed || isMobile) && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, topics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      )}

      {/* Trial Status Banner */}
      {(isOnTrial || isTrialExpired) && (!sidebarCollapsed || isMobile) && (
        <div className="mx-4 mt-4">
          <Card 
            variant="outlined" 
            padding="sm"
            className={`${isTrialExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}
          >
            <div className="flex items-center space-x-2">
              <Award className={`w-4 h-4 ${isTrialExpired ? 'text-red-600' : 'text-orange-600'}`} />
              <div className="flex-1 min-w-0">
                <Typography.Caption className={isTrialExpired ? 'text-red-700' : 'text-orange-700'}>
                  {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} days left`}
                </Typography.Caption>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => navigate('/pricing')}
              className="mt-2"
            >
              Upgrade Now
            </Button>
          </Card>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            {(!sidebarCollapsed || isMobile) && (
              <Typography.Caption className="px-2 mb-3 text-gray-500 uppercase tracking-wider">
                Learning
              </Typography.Caption>
            )}
            <div className="space-y-1">
              {navItems.map((item) => {
                const canAccess = canAccessFeature(item);
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : canAccess
                        ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-gray-400 hover:bg-gray-50'
                    } ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${
                      active ? 'text-white' : canAccess ? 'text-gray-500 group-hover:text-gray-700' : 'text-gray-300'
                    }`} />
                    {(!sidebarCollapsed || isMobile) && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge variant={item.badge.variant} size="sm">
                                {item.badge.text}
                              </Badge>
                            )}
                            {item.requiresPro && !canAccess && (
                              <Badge variant="warning" size="sm">
                                Pro
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <Typography.Caption className={`${
                              active ? 'text-blue-100' : 'text-gray-500'
                            } mt-0.5`}>
                              {item.description}
                            </Typography.Caption>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Support Section */}
          <div>
            {(!sidebarCollapsed || isMobile) && (
              <Typography.Caption className="px-2 mb-3 text-gray-500 uppercase tracking-wider">
                Support
              </Typography.Caption>
            )}
            <div className="space-y-1">
              {supportItems.map((item) => {
                const active = isActive(item.path);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } ${sidebarCollapsed && !isMobile ? 'justify-center' : ''}`}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${
                      active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    {(!sidebarCollapsed || isMobile) && (
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">
                          {item.label}
                        </span>
                        {item.description && (
                          <Typography.Caption className={`${
                            active ? 'text-blue-100' : 'text-gray-500'
                          } mt-0.5 block`}>
                            {item.description}
                          </Typography.Caption>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* User Section */}
      {(!sidebarCollapsed || isMobile) && user && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <Typography.BodySmall className="font-medium text-gray-900 truncate">
                {user.displayName || user.email?.split('@')[0]}
              </Typography.BodySmall>
              <Typography.Caption className="text-gray-500">
                {subscriptionStatus === 'active' ? 'Pro Member' : 'Free Trial'}
              </Typography.Caption>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } transition-all duration-300`}>
          <div className="bg-white border-r border-gray-200 shadow-sm">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 flex flex-col w-80 bg-white shadow-xl z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Typography.H4>Navigation</Typography.H4>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent isMobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      {showSidebar && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon={Menu}
            onClick={() => setMobileMenuOpen(true)}
          />
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <Typography.H4>Moklik</Typography.H4>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={Bell}
            onClick={() => {/* Handle notifications */}}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`${showSidebar ? (sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72') : ''} transition-all duration-300`}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
