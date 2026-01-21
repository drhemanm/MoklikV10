/**
 * Admin Service
 *
 * Handles admin authentication using Firebase Custom Claims.
 * No hardcoded credentials - admin status is determined by custom claims.
 *
 * To set up an admin:
 * 1. User signs up normally
 * 2. Call the setAdminClaim Cloud Function to grant admin access
 */

import {
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import {
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db } from '../../config/firebase';
import { AdminUser } from '../../types/admin';

// Get Cloud Functions reference
const functions = getFunctions();
const checkAdminStatusFn = httpsCallable<void, { isAdmin: boolean }>(functions, 'checkAdminStatus');

export const adminService = {
  /**
   * Login as admin using email/password
   * After authentication, verifies admin status via custom claims
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check admin status via custom claims
      const isAdmin = await this.isAdmin(user);

      if (!isAdmin) {
        // Not an admin - sign out and reject
        await signOut(auth);
        console.warn('User attempted admin login without admin privileges:', user.email);
        return false;
      }

      // Update last login timestamp
      try {
        await setDoc(doc(db, 'admin_activity', user.uid), {
          lastLogin: Timestamp.now(),
          email: user.email
        }, { merge: true });
      } catch (err) {
        // Non-critical - don't fail login if activity logging fails
        console.error('Failed to log admin activity:', err);
      }

      console.log('Admin login successful:', user.email);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Admin login error:', message);
      return false;
    }
  },

  /**
   * Check if a user has admin privileges
   * Uses Firebase Custom Claims for verification
   */
  async isAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;

    try {
      // Force token refresh to get latest custom claims
      const idTokenResult = await user.getIdTokenResult(true);

      // Check for admin role in custom claims
      const isAdmin = idTokenResult.claims.role === 'admin';

      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Check admin status using Cloud Function (more secure)
   * Use this when you need server-side verification
   */
  async verifyAdminStatus(): Promise<boolean> {
    try {
      const result = await checkAdminStatusFn();
      return result.data.isAdmin;
    } catch (error) {
      console.error('Error verifying admin status:', error);
      return false;
    }
  },

  /**
   * Get admin user details
   */
  async getAdminUser(user: User | null): Promise<AdminUser | null> {
    if (!user) return null;

    const isAdmin = await this.isAdmin(user);

    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || undefined,
      isAdmin
    };
  },

  /**
   * Logout admin user
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }
};
