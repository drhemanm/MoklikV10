import { useState, useCallback } from 'react';
import { generateId } from '../utils/id.js';
import { submitAssignment } from '../services/ai/index.js';

interface PendingAssignment {
  id: string;
  file: File;
  filename: string;
  remove: () => void;
}

export function useAssignments() {
  const [pendingAssignments, setPendingAssignments] = useState<PendingAssignment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadAssignment = useCallback((file: File) => {
    const id = generateId('assignment');
    setPendingAssignments(prev => [...prev, {
      id,
      file,
      filename: file.name,
      remove: () => setPendingAssignments(prev => prev.filter(a => a.id !== id))
    }]);
  }, []);

  const submitPendingAssignments = async () => {
    try {
      setIsSubmitting(true);
      for (const assignment of pendingAssignments) {
        await submitAssignment(assignment.file);
      }
      setPendingAssignments([]);
    } catch (error) {
      console.error('Error submitting assignments:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    pendingAssignments,
    isSubmitting,
    uploadAssignment,
    submitPendingAssignments
  };
}