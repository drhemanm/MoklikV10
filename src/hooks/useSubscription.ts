import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'monthly' | 'yearly';
  status: 'trial_active' | 'trial_expired' | 'active' | 'canceled' | 'payment_required';
  startDate: Date;
  endDate: Date;
  trialEndDate?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paymentMethod?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingHistory: Array<{
    id: string;
    amount: number;
    currency: string;
    date: Date;
    status: 'paid' | 'pending' | 'failed';
    invoiceUrl?: string;
  }>;
  features: {
    chatLimit: number;
    fileUploadLimit: number;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    exportData: boolean;
    learningPaths: boolean;
    studyScheduler: boolean;
    aiTutorUnlimited: boolean;
  };
  usage: {
    chatSessions: number;
    filesUploaded: number;
    studyTimeMinutes: number;
    questionsAsked: number;
    lastResetDate: Date;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      achievements: boolean;
      reminders: boolean;
      billing: boolean;
    };
    dashboard: {
      showStreak: boolean;
      showProgress: boolean;
      showRecentActivity: boolean;
      preferredView: 'cards' | 'list' | 'compact';
    };
    learning: {
      difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
      subjects: string[];
      studyReminders: boolean;
      adaptiveLearning: boolean;
    };
  };
}

// Enhanced navigation items with comprehensive features
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  };
  requiresPro?: boolean;
  category: 'learning' | 'tools' | 'community' | 'account' | 'support';
}

// Dashboard stats structure for modern interface
export interface DashboardStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  studyTime: number;
  streak: number;
  questionsAnswered: number;
  achievementsUnlocked: number;
  weeklyGoalProgress: number;
}

// Recent activity for dashboard
export interface RecentActivity {
  id: string;
  type: 'question' | 'achievement' | 'study_session' | 'forum_post' | 'file_upload';
  title: string;
  description: string;
  timestamp: Date;
  xpGained?: number;
  icon: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate days remaining in trial or subscription
  const calculateDaysRemaining = useCallback((endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, []);

  // Enhanced navigation items supporting all interface improvements
  const getNavigationItems = useCallback((): NavItem[] => {
    const isProUser = subscription?.status === 'active';
    
    return [
      // Learning Section
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'Home',
        path: '/dashboard',
        description: 'Overview of your learning progress',
        category: 'learning'
      },
      {
        id: 'chat',
        label: 'AI Tutor',
        icon: 'Brain',
        path: '/chat',
        description: 'Get instant help with math problems',
        badge: { text: 'AI', variant: 'info' },
        category: 'learning'
      },
      {
        id: 'learning-paths',
        label: 'Learning Paths',
        icon: 'BookOpen',
        path: '/learning-paths',
        description: 'Structured courses and curricula',
        badge: isProUser ? undefined : { text: 'Pro', variant: 'purple' },
        requiresPro: true,
        category: 'learning'
      },
      {
        id: 'study-schedule',
        label: 'Study Schedule',
        icon: 'Calendar',
        path: '/schedule',
        description: 'Plan and track your study sessions',
        badge: isProUser ? undefined : { text: 'Pro', variant: 'purple' },
        requiresPro: true,
        category: 'learning'
      },
      
      // Tools Section
      {
        id: 'homework-help',
        label: 'Homework Help',
        icon: 'Upload',
        path: '/homework',
        description: 'Upload and get help with assignments',
        category: 'tools'
      },
      {
        id: 'writing-review',
        label: 'Writing Review',
        icon: 'PenTool',
        path: '/writing-review',
        description: 'Get feedback on your writing',
        category: 'tools'
      },
      {
        id: 'progress-analytics',
        label: 'Analytics',
        icon: 'BarChart3',
        path: '/analytics',
        description: 'Detailed learning analytics',
        badge: isProUser ? undefined : { text: 'Pro', variant: 'purple' },
        requiresPro: true,
        category: 'tools'
      },
      
      // Community Section
      {
        id: 'forum',
        label: 'Study Forum',
        icon: 'MessageSquare',
        path: '/forum',
        description: 'Connect with other learners',
        category: 'community'
      },
      {
        id: 'study-groups',
        label: 'Study Groups',
        icon: 'Users',
        path: '/study-groups',
        description: 'Join collaborative study sessions',
        badge: isProUser ? undefined : { text: 'Pro', variant: 'purple' },
        requiresPro: true,
        category: 'community'
      },
      
      // Account Section
      {
        id: 'achievements',
        label: 'Achievements',
        icon: 'Award',
        path: '/achievements',
        description: 'View your learning milestones',
        category: 'account'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'Settings',
        path: '/settings',
        description: 'Manage your account preferences',
        category: 'account'
      },
      
      // Support Section
      {
        id: 'contact',
        label: 'Contact Support',
        icon: 'Mail',
        path: '/contact',
        description: 'Get help from our team',
        category: 'support'
      }
    ];
  }, [subscription?.status]);

  // Subscription management
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const subscriptionData: Subscription = {
            id: doc.id,
            userId: data.userId,
            plan: data.plan || 'free',
            status: data.status || 'trial_active',
            startDate: data.startDate?.toDate() || new Date(),
            endDate: data.endDate?.toDate() || new Date(),
            trialEndDate: data.trialEndDate?.toDate(),
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            paymentMethod: data.paymentMethod,
            billingHistory: data.billingHistory || [],
            features: {
              chatLimit: data.features?.chatLimit || (data.plan === 'free' ? 10 : -1),
              fileUploadLimit: data.features?.fileUploadLimit || (data.plan === 'free' ? 5 : -1),
              prioritySupport: data.features?.prioritySupport || data.plan !== 'free',
              advancedAnalytics: data.features?.advancedAnalytics || data.plan !== 'free',
              exportData: data.features?.exportData || data.plan !== 'free',
              learningPaths: data.features?.learningPaths || data.plan !== 'free',
              studyScheduler: data.features?.studyScheduler || data.plan !== 'free',
              aiTutorUnlimited: data.features?.aiTutorUnlimited || data.plan !== 'free'
            },
            usage: {
              chatSessions: data.usage?.chatSessions || 0,
              filesUploaded: data.usage?.filesUploaded || 0,
              studyTimeMinutes: data.usage?.studyTimeMinutes || 0,
              questionsAsked: data.usage?.questionsAsked || 0,
              lastResetDate: data.usage?.lastResetDate?.toDate() || new Date()
            },
            preferences: {
              notifications: {
                email: data.preferences?.notifications?.email ?? true,
                push: data.preferences?.notifications?.push ?? true,
                achievements: data.preferences?.notifications?.achievements ?? true,
                reminders: data.preferences?.notifications?.reminders ?? true,
                billing: data.preferences?.notifications?.billing ?? true
              },
              dashboard: {
                showStreak: data.preferences?.dashboard?.showStreak ?? true,
                showProgress: data.preferences?.dashboard?.showProgress ?? true,
                showRecentActivity: data.preferences?.dashboard?.showRecentActivity ?? true,
                preferredView: data.preferences?.dashboard?.preferredView || 'cards'
              },
              learning: {
                difficultyLevel: data.preferences?.learning?.difficultyLevel || 'intermediate',
                subjects: data.preferences?.learning?.subjects || ['mathematics'],
                studyReminders: data.preferences?.learning?.studyReminders ?? true,
                adaptiveLearning: data.preferences?.learning?.adaptiveLearning ?? true
              }
            }
          };
          setSubscription(subscriptionData);
        } else {
          // Create default free trial subscription with enhanced structure
          const defaultSubscription: Subscription = {
            id: user.uid,
            userId: user.uid,
            plan: 'free',
            status: 'trial_active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            billingHistory: [],
            features: {
              chatLimit: 10,
              fileUploadLimit: 5,
              prioritySupport: false,
              advancedAnalytics: false,
              exportData: false,
              learningPaths: false,
              studyScheduler: false,
              aiTutorUnlimited: false
            },
            usage: {
              chatSessions: 0,
              filesUploaded: 0,
              studyTimeMinutes: 0,
              questionsAsked: 0,
              lastResetDate: new Date()
            },
            preferences: {
              notifications: {
                email: true,
                push: true,
                achievements: true,
                reminders: true,
                billing: true
              },
              dashboard: {
                showStreak: true,
                showProgress: true,
                showRecentActivity: true,
                preferredView: 'cards'
              },
              learning: {
                difficultyLevel: 'intermediate',
                subjects: ['mathematics'],
                studyReminders: true,
                adaptiveLearning: true
              }
            }
          };
          setSubscription(defaultSubscription);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Subscription listener error:', error);
        setError('Failed to load subscription data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Update subscription preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<Subscription['preferences']>) => {
    if (!user || !subscription) return;

    try {
      const updatedPreferences = {
        ...subscription.preferences,
        ...newPreferences
      };

      await updateDoc(doc(db, 'subscriptions', user.uid), {
        preferences: updatedPreferences
      });

      setSubscription(prev => prev ? {
        ...prev,
        preferences: updatedPreferences
      } : null);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [user, subscription]);

  // Track usage
  const trackUsage = useCallback(async (type: keyof Subscription['usage'], increment: number = 1) => {
    if (!user || !subscription) return;

    try {
      const newUsage = {
        ...subscription.usage,
        [type]: subscription.usage[type] + increment
      };

      await updateDoc(doc(db, 'subscriptions', user.uid), {
        usage: newUsage
      });

      setSubscription(prev => prev ? {
        ...prev,
        usage: newUsage
      } : null);
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }, [user, subscription]);

  // Derived values
  const plan = subscription?.plan || 'free';
  const subscriptionStatus = subscription?.status || 'trial_active';
  const daysRemaining = subscription ? calculateDaysRemaining(
    subscription.status === 'trial_active' && subscription.trialEndDate 
      ? subscription.trialEndDate 
      : subscription.endDate
  ) : 0;

  // Enhanced access control
  const hasAccess = useCallback((feature: keyof Subscription['features']): boolean => {
    if (!subscription) return false;
    
    // Always allow access during active trial or subscription
    if (['trial_active', 'active'].includes(subscription.status)) {
      return subscription.features[feature] === true || subscription.features[feature] === -1;
    }
    
    return false;
  }, [subscription]);

  // Usage tracking with limits
  const getRemainingUsage = useCallback((type: 'chatLimit' | 'fileUploadLimit'): number => {
    if (!subscription) return 0;
    
    const limit = subscription.features[type];
    if (limit === -1) return -1; // Unlimited
    
    const used = type === 'chatLimit' ? subscription.usage.chatSessions : subscription.usage.filesUploaded;
    return Math.max(0, limit - used);
  }, [subscription]);

  // Enhanced plan benefits with all features
  const getPlanBenefits = useCallback((planType: string) => {
    const benefits = {
      free: {
        price: 'Free Trial',
        duration: '14 days',
        features: [
          'Up to 10 AI chat sessions',
          'Basic file upload (5 files)',
          'Community forum access',
          'Email support',
          'Basic progress tracking'
        ]
      },
      monthly: {
        price: 'MUR 200',
        duration: 'per month',
        features: [
          'Unlimited AI chat sessions',
          'Unlimited file uploads',
          'Learning paths & courses',
          'Study scheduler',
          'Advanced analytics',
          'Priority support',
          'Data export',
          'Study groups',
          'All premium features'
        ]
      },
      yearly: {
        price: 'MUR 2000',
        duration: 'per year',
        savings: 'Save MUR 400',
        features: [
          'Unlimited AI chat sessions',
          'Unlimited file uploads',
          'Learning paths & courses',
          'Study scheduler',
          'Advanced analytics',
          'Priority support',
          'Data export',
          'Study groups',
          'All premium features',
          '2 months free!'
        ]
      }
    };
    
    return benefits[planType as keyof typeof benefits] || benefits.free;
  }, []);

  // Upgrade prompts
  const shouldShowUpgradePrompt = useCallback((): boolean => {
    if (!subscription) return false;
    return subscription.status === 'trial_expired' || 
           (subscription.status === 'trial_active' && daysRemaining <= 3);
  }, [subscription, daysRemaining]);

  const getUpgradeMessage = useCallback((): string => {
    if (!subscription) return '';
    
    if (subscription.status === 'trial_expired') {
      return 'Your free trial has expired. Upgrade to continue using Moklik.';
    }
    
    if (subscription.status === 'trial_active') {
      if (daysRemaining === 0) {
        return 'Your trial ends today! Upgrade now to avoid interruption.';
      }
      if (daysRemaining === 1) {
        return 'Only 1 day left in your trial. Secure your access now.';
      }
      if (daysRemaining <= 3) {
        return `${daysRemaining} days left in your trial. Choose your plan to continue.`;
      }
    }
    
    return '';
  }, [subscription, daysRemaining]);

  // Check if feature requires upgrade
  const requiresUpgrade = useCallback((feature: string): boolean => {
    if (!subscription) return true;
    
    const proFeatures = ['learningPaths', 'studyScheduler', 'advancedAnalytics', 'exportData'];
    return proFeatures.includes(feature) && subscription.status !== 'active';
  }, [subscription]);

  return {
    // Core subscription data
    subscription,
    loading,
    error,
    plan,
    subscriptionStatus,
    daysRemaining,
    
    // Access control
    hasAccess,
    requiresUpgrade,
    getRemainingUsage,
    
    // Plan information
    getPlanBenefits,
    shouldShowUpgradePrompt,
    getUpgradeMessage,
    
    // Navigation and UI support
    navItems: getNavigationItems(),
    
    // Usage tracking
    trackUsage,
    
    // Preferences management
    updatePreferences,
    
    // Helper functions for components
    isProUser: subscriptionStatus === 'active',
    isTrialUser: subscriptionStatus === 'trial_active',
    isTrialExpired: subscriptionStatus === 'trial_expired',
    trialWarningLevel: daysRemaining <= 3 ? 'urgent' : daysRemaining <= 7 ? 'warning' : 'normal'
  };
}
