import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Message } from '../../types/chat';

const MESSAGES_PER_PAGE = 50;

export const chatService = {
  async saveMessage(userId: string, message: Message) {
    try {
      await addDoc(collection(db, 'messages'), {
        userId,
        role: message.role,
        content: message.content,
        timestamp: serverTimestamp(),
        referencedMessageId: message.referencedMessageId,
        isSystemMessage: message.isSystemMessage
      });
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

  async getChatHistory(
    userId: string,
    lastTimestamp?: Date,
    pageSize = MESSAGES_PER_PAGE
  ): Promise<Message[]> {
    try {
      let q = query(
        collection(db, 'messages'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );

      if (lastTimestamp) {
        q = query(q, where('timestamp', '<', lastTimestamp));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        role: doc.data().role,
        content: doc.data().content,
        timestamp: doc.data().timestamp.toMillis(),
        referencedMessageId: doc.data().referencedMessageId,
        isSystemMessage: doc.data().isSystemMessage
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  },

  async clearChatHistory(userId: string) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
};