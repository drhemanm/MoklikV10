// src/pages/settings/SettingsLayout.tsx
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Bell, 
  CreditCard, 
  Shield, 
  Download,
  ChevronRight
} from 'lucide-react';
import { Typography, Card } from '../../components/ui/ComponentLibrary';
import { EnhancedLayout } from '../../components/layout/EnhancedLayout';

interface SettingsLayoutProps {
  children: ReactNode;
}

interface SettingsNavItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();

  const settingsNavItems: SettingsNavItem[] = [
    {
      id: 'profile',
      label: 'Profile Settings',
      description: 'Manage your personal information',
      icon: User,
      path: '/settings/profile'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Customize your learning experience',
      icon: Settings,
      path: '/settings/preferences'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Control email and push notifications',
      icon: Bell,
      path: '/settings/notifications'
    },
    {
      id: 'billing',
      label: 'Billing & Usage',
      description: 'Manage subscription and payments',
      icon: CreditCard,
      path: '/settings/billing'
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password and account security',
      icon: Shield,
      path: '/settings/security'
    },
    {
      id: 'export',
      label: 'Data Export',
      description: 'Download your learning data',
      icon: Download,
      path: '/settings/export'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <EnhancedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Typography.H2 className="mb-2">Account Settings</Typography.H2>
            <Typography.Body className="text-gray-600">
              Manage your account preferences and settings
            </Typography.Body>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card variant="elevated" padding="none" className="sticky top-8">
                <div className="p-4 border-b border-gray-100">
                  <Typography.H4>Settings Menu</Typography.H4>
                </div>
                <nav className="p-2">
                  {settingsNavItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 group ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`h-5 w-5 ${
                          isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <div>
                          <Typography.BodySmall className={`font-medium ${
                            isActive(item.path) ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </Typography.BodySmall>
                          <Typography.Caption className={
                            isActive(item.path) ? 'text-blue-700' : 'text-gray-500'
                          }>
                            {item.description}
                          </Typography.Caption>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${
                        isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </Link>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </EnhancedLayout>
  );
}

// src/pages/settings/ProfileSettings.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Typography, Card, Input, Button, Badge } from '../../components/ui/ComponentLibrary';
import { Camera, Save, AlertCircle } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    grade: 'O-Level', // Default grade
    school: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex-1">
            <Typography.H3 className="mb-2">
              {user?.displayName || 'Student Profile'}
            </Typography.H3>
            <Typography.Body className="text-gray-600 mb-4">
              Update your profile information and learning preferences
            </Typography.Body>
            <div className="flex items-center space-x-3">
              <Badge variant="success">Verified Email</Badge>
              <Badge variant="info">O-Level Student</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card variant="elevated" padding="lg">
        <Typography.H4 className="mb-6">Personal Information</Typography.H4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.displayName}
            onChange={(value) => setFormData(prev => ({ ...prev, displayName: value }))}
            placeholder="Enter your full name"
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="Enter your email"
            disabled
            helpText="Contact support to change your email address"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
            placeholder="+230 XXXX XXXX"
          />
          
          <div className="space-y-1">
            <Typography.Label>Grade Level</Typography.Label>
            <select 
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="O-Level">O-Level</option>
              <option value="A-Level">A-Level</option>
              <option value="University">University</option>
            </select>
          </div>
          
          <Input
            label="School/Institution"
            value={formData.school}
            onChange={(value) => setFormData(prev => ({ ...prev, school: value }))}
            placeholder="Enter your school name"
          />
        </div>

        <div className="mt-6">
          <Typography.Label>About Me</Typography.Label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about your learning goals and interests..."
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Typography.Caption className="mt-1">
            This information helps us personalize your learning experience
          </Typography.Caption>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Changes are saved automatically</span>
          </div>
          <div className="flex items-center space-x-3">
            {success && (
              <Typography.BodySmall className="text-green-600 font-medium">
                Profile updated successfully!
              </Typography.BodySmall>
            )}
            <Button
              variant="primary"
              icon={Save}
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Statistics */}
      <Card variant="elevated" padding="lg">
        <Typography.H4 className="mb-6">Account Statistics</Typography.H4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Typography.H3 className="text-blue-600">147 days</Typography.H3>
            <Typography.BodySmall className="text-gray-600">Member since</Typography.BodySmall>
          </div>
          <div className="text-center">
            <Typography.H3 className="text-green-600">234</Typography.H3>
            <Typography.BodySmall className="text-gray-600">Questions answered</Typography.BodySmall>
          </div>
          <div className="text-center">
            <Typography.H3 className="text-purple-600">1,250 XP</Typography.H3>
            <Typography.BodySmall className="text-gray-600">Total experience</Typography.BodySmall>
          </div>
        </div>
      </Card>
    </div>
  );
}

// src/pages/settings/NotificationSettings.tsx
export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    dailyProgress: true,
    weeklyReport: true,
    newMessages: true,
    achievementUnlocked: true,
    trialReminders: true,
    marketingEmails: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    studyReminders: true,
    breakReminders: true,
    newForumPosts: false,
    liveHelpSessions: true
  });

  const handleEmailToggle = (key: string) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePushToggle = (key: string) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-8">
      <Card variant="elevated" padding="lg">
        <Typography.H4 className="mb-6">Email Notifications</Typography.H4>
        <div className="space-y-4">
          {Object.entries(emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <Typography.BodySmall className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography.BodySmall>
                <Typography.Caption className="text-gray-600">
                  {key === 'dailyProgress' ? 'Daily learning progress summary' :
                   key === 'weeklyReport' ? 'Weekly achievement and progress reports' :
                   key === 'newMessages' ? 'Notifications for new chat messages' :
                   key === 'achievementUnlocked' ? 'Celebration emails for new achievements' :
                   key === 'trialReminders' ? 'Reminders about trial expiration' :
                   'Marketing emails and product updates'}
                </Typography.Caption>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleEmailToggle(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="elevated" padding="lg">
        <Typography.H4 className="mb-6">Push Notifications</Typography.H4>
        <div className="space-y-4">
          {Object.entries(pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <Typography.BodySmall className="font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography.BodySmall>
                <Typography.Caption className="text-gray-600">
                  {key === 'studyReminders' ? 'Reminders to maintain your study streak' :
                   key === 'breakReminders' ? 'Gentle reminders to take breaks' :
                   key === 'newForumPosts' ? 'Notifications for forum activity' :
                   'Alerts for live tutoring sessions'}
                </Typography.Caption>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handlePushToggle(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
