import { useState } from 'react';
import { Save, Bell, Shield, User } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { Modal } from '../ui/Modal.js';
import { userService } from '../../services/firebase/user.js';
import type { UserProfile } from '../../types/user.js';

interface UserSettingsProps {
  userId: string | undefined;
  profile: UserProfile | null;
}

export function UserSettings({ userId, profile }: UserSettingsProps) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      achievements: true,
      studyReminders: true
    },
    privacy: {
      showProgress: true,
      showActivity: true,
      showStats: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeregisterModal, setShowDeregisterModal] = useState(false);
  const [deregisterConfirm, setDeregisterConfirm] = useState('');
  const [isDeregistering, setIsDeregistering] = useState(false);
  const [showGoodbyeModal, setShowGoodbyeModal] = useState(false);

  const handleSave = async () => {
    if (!userId) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        settings: settings
      });

      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeregister = async () => {
    if (!userId || deregisterConfirm !== 'DELETE') return;
    
    setIsDeregistering(true);
    try {
      await userService.deregisterUser(userId);
      setShowDeregisterModal(false);
      setShowGoodbyeModal(true);
      // Redirect after showing goodbye message
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Error deregistering:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to deregister account'
      });
    } finally {
      setIsDeregistering(false);
      setShowDeregisterModal(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={profile?.role || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        [key]: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        [key]: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Account Deletion Section */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
          <p className="text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeregisterModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>

        {/* Deregistration Modal */}
        {showDeregisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Account</h3>
              <div className="space-y-4">
                <p className="text-gray-600">This will:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Permanently delete your account</li>
                  <li>Remove all your personal data</li>
                  <li>Delete your chat history and preferences</li>
                  <li>Cancel any active subscriptions</li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Type DELETE to confirm account deletion
                  </p>
                  <input
                    type="text"
                    value={deregisterConfirm}
                    onChange={(e) => setDeregisterConfirm(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowDeregisterModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeregister}
                    disabled={deregisterConfirm !== 'DELETE' || isDeregistering}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeregistering ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* Goodbye Modal */}
        <Modal
          isOpen={showGoodbyeModal}
          onClose={() => setShowGoodbyeModal(false)}
        >
          <div className="text-center py-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              I am so sorry to see you go
            </h3>
            <p className="text-gray-600">
              Thank you for being part of our learning journey. We hope to see you again!
            </p>
          </div>
        </Modal>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-4">
          {saveMessage && (
            <p className={`text-sm ${
              saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveMessage.text}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
  );
}