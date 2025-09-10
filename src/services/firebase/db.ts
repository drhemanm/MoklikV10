import { 
  collection,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// Add real-time subscription helper
export function subscribeToUserData(userId: string, callback: (data: any) => void) {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
}

export const firestoreService = {
  // User related operations
  async createUser(userId: string, userData: any) {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
  },

  async getUser(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUser(userId: string, data: Partial<DocumentData>) {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      lastActive: serverTimestamp()
    });
  },

  // Progress tracking
  async saveProgress(userId: string, topicId: string, progressData: any) {
    await setDoc(doc(db, 'progress', `${userId}_${topicId}`), {
      userId,
      topicId,
      ...progressData,
      updatedAt: serverTimestamp()
    });
  },

  async getProgress(userId: string, topicId: string) {
    const progressDoc = await getDoc(doc(db, 'progress', `${userId}_${topicId}`));
    return progressDoc.exists() ? progressDoc.data() : null;
  },

  // Assignment handling
  async saveAssignment(userId: string, assignmentData: any) {
    const assignmentRef = doc(collection(db, 'assignments'));
    await setDoc(assignmentRef, {
      userId,
      ...assignmentData,
      status: 'pending',
      submittedAt: Timestamp.now()
    });
    return assignmentRef.id;
  },

  async getAssignments(userId: string) {
    const q = query(
      collection(db, 'assignments'),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Chat history
  async saveChatMessage(userId: string, messageData: any) {
    const messageRef = doc(collection(db, 'messages'));
    await setDoc(messageRef, {
      userId,
      ...messageData,
      timestamp: Timestamp.now()
    });
    return messageRef.id;
  },

  async getChatHistory(userId: string, limit = 50) {
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getUserActivities(userId: string, startDate: Date, limit = 50) {
    const activitiesRef = collection(db, 'user_activities');
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async getUserResourceMetrics(userId: string) {
    const resourcesRef = collection(db, 'user_resources');
    const q = query(resourcesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
};