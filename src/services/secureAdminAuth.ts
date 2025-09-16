import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const secureAdminAuth = {
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
      console.error('Secure admin sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    await signOut(auth);
  },

  async checkAdminStatus() {
    const user = auth.currentUser;
    if (!user) return false;
    
    try {
      const tokenResult = await user.getIdTokenResult();
      return tokenResult.claims.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};
