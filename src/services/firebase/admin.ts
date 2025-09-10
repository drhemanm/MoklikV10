import { 
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { ADMIN_CREDENTIALS } from '../../types/admin';

export const adminService = {
  async login(username: string, password: string): Promise<boolean> {
    try {
      if (username !== ADMIN_CREDENTIALS.username || 
          password !== ADMIN_CREDENTIALS.password) {
        throw new Error('Invalid credentials');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      // Verify admin role in Firestore
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error('Unauthorized access');
      }

      // Update last login
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        lastLogin: Timestamp.now()
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  },

  async isAdmin(user: User | null): Promise<boolean> {
    if (!user) return false;
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists();
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
};