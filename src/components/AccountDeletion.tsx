import React, { useState } from 'react';
import { Trash2, AlertTriangle, Lock, X } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import toast from 'react-hot-toast';

interface AccountDeletionProps {
  onClose?: () => void;
}

export function AccountDeletion({ onClose }: AccountDeletionProps) {
  const { deleteAccount } = useSubscription();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      // User will be automatically logged out
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      if (error.message.includes('recent login')) {
        toast.error('Please log out and log back in before deleting your account for security reasons.');
      } else {
        toast.error(error.message || 'Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirmation) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-600">Permanently remove your Moklik account</p>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-red-900">Account Deletion Warning</h4>
              <p className="text-sm text-red-800">
                Deleting your account will permanently remove all your data and cannot be undone. This includes:
              </p>
              <ul className="text-sm text-red-800 space-y-1 ml-4">
                <li>• Your learning progress and achievements</li>
                <li>• Chat history with the AI tutor</li>
                <li>• Subscription and payment information</li>
                <li>• Forum posts and community interactions</li>
                <li>• All uploaded files and documents</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Security Requirements</h4>
              <p className="text-sm text-blue-800">
                For security reasons, you may need to log out and log back in before deleting your account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>I Understand, Delete My Account</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-red-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Final Confirmation</h3>
            <p className="text-sm text-red-600">This action cannot be undone</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowConfirmation(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h4 className="font-medium text-red-900 mb-2">Data Deletion Notice</h4>
        <p className="text-sm text-red-800 mb-3">
          By proceeding, you acknowledge that ALL your data will be permanently deleted, including:
        </p>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-red-800">
          <div>• Learning progress & statistics</div>
          <div>• Chat conversations</div>
          <div>• Achievement badges</div>
          <div>• Subscription history</div>
          <div>• Forum posts & comments</div>
          <div>• Uploaded documents</div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-gray-900">
            Type "DELETE MY ACCOUNT" to confirm:
          </span>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="DELETE MY ACCOUNT"
            disabled={isDeleting}
          />
        </label>

        <div className="text-xs text-gray-500">
          This confirmation is case-sensitive and must be typed exactly as shown.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDeleteAccount}
          disabled={confirmationText !== 'DELETE MY ACCOUNT' || isDeleting}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
            confirmationText === 'DELETE MY ACCOUNT' && !isDeleting
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Deleting Account...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Permanently Delete Account</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => setShowConfirmation(false)}
          disabled={isDeleting}
          className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Go Back
        </button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <strong>Legal Notice:</strong> Account deletion complies with GDPR and Mauritius Data Protection Act. 
        Some anonymized data may be retained for legal compliance as outlined in our Privacy Policy.
      </div>
    </div>
  );
}

// Compact version for settings page
export function AccountDeletionButton() {
  const [showDeletion, setShowDeletion] = useState(false);

  if (showDeletion) {
    return <AccountDeletion onClose={() => setShowDeletion(false)} />;
  }

  return (
    <div className="border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Delete Account</h3>
          <p className="text-sm text-gray-600">Permanently remove your account and all data</p>
        </div>
        <button
          onClick={() => setShowDeletion(true)}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
