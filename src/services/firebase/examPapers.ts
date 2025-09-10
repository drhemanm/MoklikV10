import { 
  ref, 
  getDownloadURL, 
  uploadBytes,
} from 'firebase/storage';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  doc,
  updateDoc,
  orderBy 
} from 'firebase/firestore';
import { storage, db } from '../../config/firebase.js';
import { type ExamPaper, type ExamPaperFilter } from '../../types/examPaper.js';

export class ExamPaperService {
  private static STORAGE_PATH = 'exam-papers';
  private static COLLECTION = 'examPapers';

  static parseFilename(filename: string): Partial<ExamPaper> {
    const match = filename.match(/^(\d{4})_(S|W)(\d{2})_(MS|QP)$/);
    if (!match) throw new Error('Invalid filename format');

    const [_, syllabusCode, session, year, documentType] = match;
    return {
      syllabusCode,
      session: session as 'S' | 'W',
      year,
      documentType: documentType as 'MS' | 'QP'
    };
  }

  static createFilename(paper: Partial<ExamPaper>): string {
    return `${paper.syllabusCode}_${paper.session}${paper.year}_${paper.documentType}`;
  }

  static async uploadPaper(file: File, metadata: Partial<ExamPaper>): Promise<string> {
    try {
      // Validate file type
      if (!file.type.match(/(pdf|msword|vnd.openxmlformats-officedocument)/)) {
        throw new Error('Invalid file type. Only PDF and Word documents are allowed.');
      }

      const filename = this.createFilename(metadata);
      const storageRef = ref(storage, `${this.STORAGE_PATH}/${filename}`);

      // Upload file
      await uploadBytes(storageRef, file, {
        customMetadata: {
          syllabusCode: metadata.syllabusCode!,
          session: metadata.session!,
          year: metadata.year!,
          documentType: metadata.documentType!
        }
      });

      // Get download URL
      const url = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...metadata,
        url,
        uploadedAt: Date.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error uploading exam paper:', error);
      throw error;
    }
  }

  static async searchPapers(filter: ExamPaperFilter): Promise<ExamPaper[]> {
    try {
      let q = query(collection(db, this.COLLECTION));

      // Apply filters
      if (filter.syllabusCode) {
        q = query(q, where('syllabusCode', '==', filter.syllabusCode));
      }
      if (filter.session) {
        q = query(q, where('session', '==', filter.session));
      }
      if (filter.year) {
        q = query(q, where('year', '==', filter.year));
      }
      if (filter.documentType) {
        q = query(q, where('documentType', '==', filter.documentType));
      }

      // Order by upload date
      q = query(q, orderBy('uploadedAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExamPaper));
    } catch (error) {
      console.error('Error searching exam papers:', error);
      throw error;
    }
  }

  static async getRelatedPapers(paper: ExamPaper): Promise<ExamPaper[]> {
    try {
      // Get marking scheme for question paper or vice versa
      const relatedType = paper.documentType === 'QP' ? 'MS' : 'QP';
      
      const q = query(
        collection(db, this.COLLECTION),
        where('syllabusCode', '==', paper.syllabusCode),
        where('session', '==', paper.session),
        where('year', '==', paper.year),
        where('documentType', '==', relatedType)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ExamPaper));
    } catch (error) {
      console.error('Error getting related papers:', error);
      throw error;
    }
  }

  static async updateLastAccessed(paperId: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, paperId);
      await updateDoc(docRef, {
        lastAccessed: Date.now()
      });
    } catch (error) {
      console.error('Error updating last accessed:', error);
      throw error;
    }
  }
}