import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAIResponse } from '../services/ai';

export interface Exercise {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  hints: string[];
  currentHintIndex: number;
}

interface ExamMode {
  isActive: boolean;
  timeLimit: number;
  startTime?: number;
  exercises: Exercise[];
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [examMode, setExamMode] = useState<ExamMode>({
    isActive: false,
    timeLimit: 0,
    exercises: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const generateExercises = useCallback(async (
    topic: string,
    count: number = 3,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) => {
    setIsLoading(true);
    try {
      const prompt = `Generate ${count} ${difficulty} math exercises for ${topic}. 
        For each exercise, provide:
        1. The question
        2. A step-by-step solution
        3. Three progressive hints
        Format as JSON array: [{"question": "", "solution": "", "hints": []}]`;

      const response = await getAIResponse(prompt);
      const exerciseData = JSON.parse(response);

      const formattedExercises = exerciseData.map((ex: any) => ({
        id: uuidv4(),
        question: ex.question,
        solution: ex.solution,
        hints: ex.hints,
        difficulty,
        currentHintIndex: 0,
        isCorrect: undefined,
        userAnswer: undefined
      }));

      setExercises(formattedExercises);
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startExamMode = useCallback(async (topic: string, duration: number) => {
    setIsLoading(true);
    try {
      const prompt = `Generate 5 exam-style questions for ${topic} with varying difficulty.
        Include a mix of conceptual and calculation questions.
        Format as JSON array: [{"question": "", "solution": "", "hints": []}]`;

      const response = await getAIResponse(prompt);
      const examQuestions = JSON.parse(response);

      const formattedQuestions = examQuestions.map((q: any) => ({
        id: uuidv4(),
        question: q.question,
        solution: q.solution,
        hints: q.hints,
        difficulty: 'medium',
        currentHintIndex: 0,
        isCorrect: undefined,
        userAnswer: undefined
      }));

      setExamMode({
        isActive: true,
        timeLimit: duration,
        startTime: Date.now(),
        exercises: formattedQuestions
      });
    } catch (error) {
      console.error('Error starting exam mode:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (exerciseId: string, answer: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        userAnswer: answer,
        isCorrect: undefined // Will be evaluated by AI
      };
    }));

    try {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (!exercise) return;

      const prompt = `Evaluate this answer for the question: "${exercise.question}"
        Student's answer: "${answer}"
        Correct solution: "${exercise.solution}"
        Provide feedback and state if the answer is correct.`;

      const feedback = await getAIResponse(prompt);
      const isCorrect = feedback.toLowerCase().includes('correct');

      setExercises(prev => prev.map(ex => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          isCorrect,
          feedback
        };
      }));

      return feedback;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      throw error;
    }
  }, [exercises]);

  const showNextHint = useCallback((exerciseId: string) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        currentHintIndex: Math.min(ex.currentHintIndex + 1, ex.hints.length - 1)
      };
    }));
  }, []);

  const endExamMode = useCallback(() => {
    setExamMode(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  return {
    exercises,
    examMode,
    isLoading,
    generateExercises,
    startExamMode,
    endExamMode,
    submitAnswer,
    showNextHint
  };
}