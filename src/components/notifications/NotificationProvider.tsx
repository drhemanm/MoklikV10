// src/components/notifications/NotificationProvider.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X, 
  Bell,
  Trophy,
  Zap,
  Crown,
  Calendar
} from 'lucide-react';
import { Typography, Badge } from '../ui/ComponentLibrary';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'trial';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  showSuccess: (title: string, message: string, action?: Notification['action']) => void;
  showError: (title: string, message: string, action?: Notification['action']) => void;
  showWarning: (title: string, message: string, action?: Notification['action']) => void;
  showInfo: (title: string, message: string, action?: Notification['action']) => void;
  showAchievement: (title: string, message: string, xp?: number) => void;
  showTrialWarning: (daysLeft: number, action?: Notification['action']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration ?? (notification.persistent ? undefined : 5000)
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'success', title, message, action });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'error', title, message, action, duration: 8000 });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'warning', title, message, action, duration: 7000 });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'info', title, message, action });
  }, [addNotification]);

  const showAchievement = useCallback((title: string, message: string, xp?: number) => {
    addNotification({ 
      type: 'achievement', 
      title, 
      message: xp ? `${message} (+${xp} XP)` : message,
      duration: 6000
    });
  }, [addNotification]);

  const showTrialWarning = useCallback((daysLeft: number, action?: Notification['action']) => {
    const title = daysLeft <= 0 ? 'Trial Expired' : `${daysLeft} Days Left`;
    const message = daysLeft <= 0 
      ? 'Your free trial has ended. Subscribe to continue learning.'
      : `Your trial expires soon. Upgrade to maintain access to all features.`;
    
    addNotification({ 
      type: 'trial', 
      title, 
      message, 
      action: action || { label: 'Upgrade Now', onClick: () => {} },
      persistent: daysLeft <= 0,
      duration: daysLeft <= 0 ? undefined : 10000
    });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAchievement,
    showTrialWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

// Notification Container Component
interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationCard 
            key={notification.id} 
            notification={notification} 
            onRemove={onRemove} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual Notification Card
interface NotificationCardProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function NotificationCard({ notification, onRemove }: NotificationCardProps) {
  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: AlertCircle,
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-800',
          messageColor: 'text-orange-700'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      case 'achievement':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200',
          icon: Trophy,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'trial':
        return {
          bg: 'bg-purple-50 border-purple-200',
          icon: Crown,
          iconColor: 'text-purple-600',
          titleColor: 'text-purple-800',
          messageColor: 'text-purple-700'
        };
    }
  };

  const styles = getNotificationStyles(notification.type);
  const Icon = styles.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 500 }}
      className={`p-4 rounded-xl border shadow-lg ${styles.bg} max-w-sm`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${notification.type === 'achievement' ? 'animate-pulse' : ''}`}>
          <Icon className={`h-6 w-6 ${styles.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Typography.BodySmall className={`font-semibold ${styles.titleColor}`}>
              {notification.title}
            </Typography.BodySmall>
            <button
              onClick={() => onRemove(notification.id)}
              className={`ml-2 ${styles.iconColor} hover:opacity-70 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <Typography.Caption className={`mt-1 ${styles.messageColor}`}>
            {notification.message}
          </Typography.Caption>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`mt-3 text-sm font-medium ${styles.titleColor} hover:underline`}
            >
              {notification.action.label}
            </button>
          )}
          
          {notification.timestamp && (
            <Typography.Caption className="text-gray-500 mt-2">
              {notification.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography.Caption>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// src/components/notifications/NotificationCenter.tsx
export function NotificationCenter() {
  const { notifications, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Typography.H4>Notifications</Typography.H4>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Typography.BodySmall className="text-gray-600">
                    No new notifications
                  </Typography.BodySmall>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                          {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                          {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                          {notification.type === 'achievement' && <Trophy className="h-5 w-5 text-yellow-500" />}
                          {notification.type === 'trial' && <Crown className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography.BodySmall className="font-medium text-gray-900">
                            {notification.title}
                          </Typography.BodySmall>
                          <Typography.Caption className="text-gray-600 mt-1">
                            {notification.message}
                          </Typography.Caption>
                          {notification.timestamp && (
                            <Typography.Caption className="text-gray-500 mt-1">
                              {notification.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Typography.Caption>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// src/hooks/useNotificationEffects.ts
export function useNotificationEffects() {
  const { showAchievement, showTrialWarning, showSuccess, showError } = useNotifications();

  // XP gain notifications
  const notifyXPGain = useCallback((amount: number, reason: string) => {
    showAchievement('XP Gained!', reason, amount);
  }, [showAchievement]);

  // Achievement unlock notifications
  const notifyAchievement = useCallback((title: string, description: string) => {
    showAchievement(`Achievement Unlocked: ${title}`, description);
  }, [showAchievement]);

  // Trial status notifications
  const notifyTrialStatus = useCallback((daysLeft: number, onUpgrade: () => void) => {
    showTrialWarning(daysLeft, { label: 'Upgrade Now', onClick: onUpgrade });
  }, [showTrialWarning]);

  // Learning milestone notifications
  const notifyMilestone = useCallback((milestone: string, details: string) => {
    showSuccess(`Milestone Reached!`, `${milestone}: ${details}`);
  }, [showSuccess]);

  // Error notifications with retry
  const notifyError = useCallback((title: string, message: string, onRetry?: () => void) => {
    showError(title, message, onRetry ? { label: 'Retry', onClick: onRetry } : undefined);
  }, [showError]);

  return {
    notifyXPGain,
    notifyAchievement,
    notifyTrialStatus,
    notifyMilestone,
    notifyError
  };
}
