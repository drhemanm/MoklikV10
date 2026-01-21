/**
 * Admin Types
 *
 * Admin authentication is handled via Firebase Custom Claims.
 * Admins are identified by having role: 'admin' in their custom claims.
 *
 * To create an admin:
 * 1. Create a regular user account
 * 2. Use the setAdminClaim Cloud Function to grant admin access
 *
 * Example (from Firebase Console or Admin SDK):
 * firebase functions:call setAdminClaim --data '{"uid": "user-uid", "makeAdmin": true}'
 */

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  lastLogin?: Date;
}

export interface AdminLoginResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

// Admin custom claim structure
export interface AdminClaims {
  role?: 'admin' | null;
}
