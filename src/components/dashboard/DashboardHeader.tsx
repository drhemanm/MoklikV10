import React from 'react';
import { User } from 'firebase/auth';
import { Activity, BarChart2, BookOpen, Settings } from 'lucide-react';
import type { UserProfile } from '../../types/user';

interface DashboardHeaderProps {
  user: User | null;
  profile: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: 'activity' | 'stats' | 'resources' | 'settings') => void;
}

export function DashboardHeader({ user, profile, activeTab, onTabChange }: DashboardHeaderProps) {
  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'stats', label: 'Statistics', icon: BarChart2 },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
        </div>
        
        {profile && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Role: {profile.role}</p>
            <p className="text-sm text-gray-600">Member since {profile.createdAt.toDate().toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 mr-2
                ${activeTab === id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}