import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  DocumentData
} from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import type { Resource } from '../../types/resource.js';

export const resourceService = {
  async getResources(level?: 'o-level' | 'a-level'): Promise<Resource[]> {
    try {
      let q = query(
        collection(db, 'resources'),
        orderBy('updatedAt', 'desc')
      );

      if (level) {
        q = query(
          collection(db, 'resources'),
          where('level', 'in', [level, 'both']),
          orderBy('updatedAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: (doc.data().updatedAt as Timestamp).toMillis()
      })) as Resource[];
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw new Error('Failed to fetch resources');
    }
  },

  async addResource(resource: Omit<Resource, 'id' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resource,
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw new Error('Failed to add resource');
    }
  },

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
};

// Initialize sample resources if they don't exist
export async function initializeSampleResources() {
  try {
    const snapshot = await getDocs(collection(db, 'resources'));
    if (snapshot.empty) {
      const sampleResources = [
        {
          title: 'O-Level Mathematics Formula Sheet',
          description: 'Complete formula reference for O-Level Mathematics',
          url: 'https://firebasestorage.googleapis.com/v0/b/moklik-46048.appspot.com/o/resources%2Fo-level-math-formulas.pdf',
          type: 'pdf',
          category: 'formulas',
          level: 'o-level',
          updatedAt: Timestamp.now()
        },
        {
          title: 'A-Level Calculus Study Guide',
          description: 'Comprehensive study guide for A-Level Calculus topics',
          url: 'https://firebasestorage.googleapis.com/v0/b/moklik-46048.appspot.com/o/resources%2Fa-level-calculus-guide.pdf',
          type: 'pdf',
          category: 'study-guides',
          level: 'a-level',
          updatedAt: Timestamp.now()
        },
        {
          title: 'Trigonometry Practice Problems',
          description: 'Collection of practice problems with step-by-step solutions',
          url: 'https://firebasestorage.googleapis.com/v0/b/moklik-46048.appspot.com/o/resources%2Ftrigonometry-practice.pdf',
          type: 'pdf',
          category: 'practice',
          level: 'both',
          updatedAt: Timestamp.now()
        }
      ];

      for (const resource of sampleResources) {
        await addDoc(collection(db, 'resources'), resource);
      }
    }
  } catch (error) {
    console.error('Error initializing sample resources:', error);
  }
}