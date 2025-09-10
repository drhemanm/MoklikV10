import { z } from 'zod';

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockedAt: z.number().optional(),
  progress: z.number().optional(),
  requiredValue: z.number(),
  type: z.enum(['streak', 'study_time', 'quiz_score', 'level', 'topic_mastery'])
});

export const levelSchema = z.object({
  level: z.number(),
  xpRequired: z.number(),
  title: z.string(),
  rewards: z.array(z.string())
});

export const studyGoalSchema = z.object({
  id: z.string(),
  type: z.enum(['daily', 'weekly']),
  target: z.number(),
  progress: z.number(),
  startTime: z.number(),
  endTime: z.number(),
  completed: z.boolean()
});

export type Achievement = z.infer<typeof achievementSchema>;
export type Level = z.infer<typeof levelSchema>;
export type StudyGoal = z.infer<typeof studyGoalSchema>;

export interface GamificationState {
  xp: number;
  level: number;
  streak: {
    current: number;
    longest: number;
    lastStudyDate: number;
    streakSavers: number;
  };
  studyTime: {
    total: number;
    daily: Record<string, number>;
    byTopic: Record<string, number>;
  };
  achievements: Achievement[];
  goals: StudyGoal[];
  notifications: {
    id: string;
    type: 'achievement' | 'streak' | 'goal' | 'level';
    message: string;
    timestamp: number;
    read: boolean;
  }[];
}