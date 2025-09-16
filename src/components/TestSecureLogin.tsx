import React, { useState } from 'react';
import { secureAdminAuth } from '../services/secureAdminAuth';

export const TestSecureLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await secureAdminAuth.signIn(email, password);
      setResult(`✅ SUCCESS: Logged in as admin! UID: ${response.user.uid}`);
      setIsLoggedIn(true);
    } catch (error: any) {
      setResult(`❌ FAILED: ${error.message}`);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await secureAdminAuth.signOut();
      setResult('✅ Logged out successfully');
      setIsLoggedIn(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setResult(`❌ Logout failed: ${error.message}`);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const isAdmin = await secureAdminAuth.checkAdminStatus();
      setResult(`🔍 Admin Status: ${isAdmin ? '✅ You are an admin!' : '❌ Not an admin'}`);
    } catch (error: any) {
      setResult(`❌ Status check failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🔐 Test Secure Admin Login</h2>
      
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? '🔄 Testing Login...' : '🚀 Test Secure Login'}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <p className="text-green-600 font-medium">✅ Logged in as Admin!</p>
          
          <div className="flex space-x-2">
            <button
              onClick={checkAdminStatus}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              🔍 Check Status
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm font-mono whitespace-pre-wrap">{result}</p>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
        <p>💡 This component tests the secure admin authentication.</p>
        <p>Use the email/password from your setup script.</p>
      </div>
    </div>
  );
};
