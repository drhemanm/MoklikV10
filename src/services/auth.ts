// 1. Remove src/types/admin.ts completely (delete the file with hardcoded credentials)

// 2. Replace with Firebase Auth + Custom Claims approach
// src/services/auth.ts
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const adminAuth = {
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get custom claims to check if user is admin
      const tokenResult = await user.getIdTokenResult();
      const isAdmin = tokenResult.claims.role === 'admin';
      
      if (!isAdmin) {
        await signOut(auth);
        throw new Error('Access denied: Admin privileges required');
      }
      
      return { user, isAdmin };
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    await signOut(auth);
  },

  async checkAdminStatus() {
    const user = auth.currentUser;
    if (!user) return false;
    
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.role === 'admin';
  }
};

// 3. Server-side function to set admin claims (Firebase Functions)
// functions/src/admin.ts
import { auth } from 'firebase-admin';
import { https } from 'firebase-functions';

export const setAdminClaim = https.onCall(async (data, context) => {
  // Only existing admins can promote new admins
  // For initial setup, use Firebase Admin SDK directly via CLI
  
  if (!context.auth?.token.role || context.auth.token.role !== 'admin') {
    throw new https.HttpsError('permission-denied', 'Only admins can set admin claims');
  }

  const { uid } = data;
  
  try {
    await auth().setCustomUserClaims(uid, { role: 'admin' });
    return { success: true, message: 'Admin claim set successfully' };
  } catch (error) {
    throw new https.HttpsError('internal', 'Failed to set admin claim');
  }
});

// 4. Updated AdminGuard component
// src/components/AdminGuard.tsx
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { adminAuth } from '../services/auth';
import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await adminAuth.checkAdminStatus();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (loading || isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// 5. New Admin Login Component
// src/components/AdminLogin.tsx
import React, { useState } from 'react';
import { adminAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminAuth.signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
