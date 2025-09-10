import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { ActivityLog } from './ActivityLog';
import { UsageStats } from './UsageStats';
import { ResourceMetrics } from './ResourceMetrics';
import { UserSettings } from './UserSettings';
import { DashboardHeader } from './DashboardHeader';
import { ErrorBoundary } from '../ErrorBoundary';
import { LiveAnalytics } from './LiveAnalytics';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const { profile, isLoading, error } = useProfile();
  const [activeTab, setActiveTab] = useState<'activity' | 'stats' | 'resources' | 'settings'>('activity');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 glass rounded-xl shadow-purple animate-fade-in">
      <DashboardHeader
        user={user}
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="glass rounded-xl shadow-purple">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActivityLog userId={user?.uid} />
              </motion.div>
            )}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LiveAnalytics userId={user?.uid} />
                <UsageStats userId={user?.uid} />
              </motion.div>
            )}
            {activeTab === 'resources' && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ResourceMetrics userId={user?.uid} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UserSettings userId={user?.uid} profile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        </ErrorBoundary>
      </div>
    </div>
  );
}