import { useState, useCallback } from 'react';
import { firestoreService } from '../services/firebase/db.js';

export function useFirestore() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Firestore error:', error);
    setError(error.message || 'An error occurred');
    setIsLoading(false);
  };

  const saveProgress = useCallback(async (userId: string, topicId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await firestoreService.saveProgress(userId, topicId, data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProgress = useCallback(async (userId: string, topicId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const progress = await firestoreService.getProgress(userId, topicId);
      return progress;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAssignment = useCallback(async (userId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const assignmentId = await firestoreService.saveAssignment(userId, data);
      return assignmentId;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAssignments = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const assignments = await firestoreService.getAssignments(userId);
      return assignments;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveChatMessage = useCallback(async (userId: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const messageId = await firestoreService.saveChatMessage(userId, data);
      return messageId;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getChatHistory = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const messages = await firestoreService.getChatHistory(userId);
      return messages;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    saveProgress,
    getProgress,
    saveAssignment,
    getAssignments,
    saveChatMessage,
    getChatHistory
  };
}