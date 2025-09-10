import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, auth, storage } from '../../config/firebase.js';
import type { UserProfile } from '../../types/user.js';

export const userService = {
  async createUserProfile(userId: string, email: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const now = Timestamp.now();
    const hasProfile = (await getDoc(userRef)).exists();

    // Only create profile if it doesn't exist
    if (!hasProfile) {
      const initialProfile: UserProfile = {
        email,
        role: 'student', // Default role, will be updated in role selection
        createdAt: now,
        lastActive: now,
        gamification: {
          xp: 0,
          level: 1,
          streak: {
            current: 0,
            longest: 0,
            lastStudyDate: now,
            streakSavers: 3
          },
          studyTime: {
            total: 0,
            daily: {},
            byTopic: {}
          },
          achievements: [],
          goals: []
        }
      };

      await setDoc(userRef, initialProfile);
    }
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
  },

  async needsRoleSelection(userId: string): Promise<boolean> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() && !userDoc.data()?.role;
  },

  async updateStudyTime(userId: string, topicId: string, minutes: number): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const today = new Date().toISOString().split('T')[0];

    await updateDoc(userRef, {
      'gamification.studyTime.total': increment(minutes),
      [`gamification.studyTime.daily.${today}`]: increment(minutes),
      [`gamification.studyTime.byTopic.${topicId}`]: increment(minutes),
      'lastActive': Timestamp.now()
    });

    // Update streak
    await this.updateStreak(userId);
  },

  async updateStreak(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return;

    const userData = userDoc.data() as UserProfile;
    const lastStudyDate = userData.gamification.streak.lastStudyDate.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastStudyDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = userData.gamification.streak.current;
    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (daysDiff > 1) {
      if (daysDiff === 2 && userData.gamification.streak.streakSavers > 0) {
        // Use streak saver
        await updateDoc(userRef, {
          'gamification.streak.streakSavers': increment(-1)
        });
      } else {
        // Reset streak
        newStreak = 1;
      }
    }

    await updateDoc(userRef, {
      'gamification.streak.current': newStreak,
      'gamification.streak.longest': Math.max(newStreak, userData.gamification.streak.longest),
      'gamification.streak.lastStudyDate': Timestamp.now()
    });

    // Award XP for streak milestones
    if (newStreak > userData.gamification.streak.current) {
      const streakXP = this.calculateStreakXP(newStreak);
      await this.addXP(userId, streakXP);
    }
  },

  async addXP(userId: string, amount: number): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return;

    const userData = userDoc.data() as UserProfile;
    const currentXP = userData.gamification.xp;
    const newXP = currentXP + amount;
    const currentLevel = userData.gamification.level;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await updateDoc(userRef, {
      'gamification.xp': newXP,
      'gamification.level': newLevel
    });

    // Level up notification
    if (newLevel > currentLevel) {
      await this.addNotification(userId, {
        type: 'level_up',
        message: `Congratulations! You've reached level ${newLevel}!`,
        timestamp: Timestamp.now()
      });
    }
  },

  calculateStreakXP(streak: number): number {
    // Base XP for maintaining streak
    let xp = 50;

    // Bonus XP for milestone days
    if (streak % 7 === 0) xp += 100; // Weekly milestone
    if (streak % 30 === 0) xp += 500; // Monthly milestone
    if (streak % 100 === 0) xp += 2000; // Major milestone

    return xp;
  },

  async addNotification(userId: string, notification: {
    type: string;
    message: string;
    timestamp: Timestamp;
  }): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'gamification.notifications': [notification]
    });
  },

  async deregisterUser(userId: string): Promise<void> {
    try {
      // Delete user data from Firestore
      const batch = writeBatch(db);
      
      // Delete user profile
      batch.delete(doc(db, 'users', userId));
      
      // Delete chat messages
      const messagesQuery = query(collection(db, 'messages'), where('userId', '==', userId));
      const messagesDocs = await getDocs(messagesQuery);
      messagesDocs.forEach(doc => batch.delete(doc.ref));
      
      // Delete user activities
      const activitiesQuery = query(collection(db, 'user_activities'), where('userId', '==', userId));
      const activitiesDocs = await getDocs(activitiesQuery);
      activitiesDocs.forEach(doc => batch.delete(doc.ref));
      
      // Delete user resources
      const resourcesQuery = query(collection(db, 'user_resources'), where('userId', '==', userId));
      const resourcesDocs = await getDocs(resourcesQuery);
      resourcesDocs.forEach(doc => batch.delete(doc.ref));
      
      // Execute batch delete
      await batch.commit();
      
      // Delete user files from Storage
      const userStorageRef = ref(storage, `users/${userId}`);
      const filesList = await listAll(userStorageRef);
      await Promise.all(filesList.items.map((fileRef: any) => deleteObject(fileRef)));
      
      // Delete Firebase Auth account
      const user = auth.currentUser;
      if (user) {
        await user.delete();
      }
      
      // Sign out
      await auth.signOut();
    } catch (error) {
      console.error('Error deregistering user:', error);
      throw error;
    }
  },

  updateReputation: async (_userId: string, _amount: number): Promise<void> => {
    // Placeholder implementation
    console.log('Update reputation not implemented');
  }
};