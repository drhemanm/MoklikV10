import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  PenTool,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  Crown,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription.jsx';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isPro?: boolean;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isInTrial, daysRemaining, hasActiveSubscription } = useSubscription();

  const mainNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/chat', label: 'AI Tutor', icon: <MessageSquare className="w-5 h-5" />, badge: 'AI' },
    { path: '/writing-review', label: 'Writing Review', icon: <PenTool className="w-5 h-5" /> },
    { path: '/forum', label: 'Community', icon: <Users className="w-5 h-5" /> },
  ];

  const learningNavItems: NavItem[] = [
    { path: '/resources', label: 'Resources', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/exam-papers', label: 'Exam Papers', icon: <FileText className="w-5 h-5" /> },
    { path: '/achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
    { path: '/progress', label: 'My Progress', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
        isActive(item.path)
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}>
        {item.icon}
      </span>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium text-sm whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !isCollapsed && (
        <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
          isActive(item.path) ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
        }`}>
          {item.badge}
        </span>
      )}
      {item.isPro && !isCollapsed && (
        <Crown className="w-4 h-4 ml-auto text-yellow-500" />
      )}
    </Link>
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl text-gray-900"
              >
                Moklik
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Main
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        {/* Learning Section */}
        <div className="mt-6 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Learning
            </p>
          )}
          {learningNavItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        {/* Settings Section */}
        <div className="mt-6 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Account
            </p>
          )}
          <NavLink item={{ path: '/account', label: 'Settings', icon: <Settings className="w-5 h-5" /> }} />
          <NavLink item={{ path: '/help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> }} />
        </div>
      </nav>

      {/* Subscription Banner */}
      {!isCollapsed && isInTrial && (
        <div className="mx-3 mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Free Trial</span>
          </div>
          <p className="text-xs text-amber-700 mb-2">
            {daysRemaining} days remaining
          </p>
          <Link
            to="/upgrade"
            className="block w-full text-center py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {/* User Profile */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {hasActiveSubscription ? 'Premium' : 'Free Plan'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
