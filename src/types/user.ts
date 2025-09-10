import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'other';
  createdAt: Timestamp;
  lastActive: Timestamp;
  gamification: {
    xp: number;
    level: number;
    streak: {
      current: number;
      longest: number;
      lastStudyDate: Timestamp;
      streakSavers: number;
    };
    studyTime: {
      total: number;
      daily: Record<string, number>;
      byTopic: Record<string, number>;
    };
    achievements: Achievement[];
    goals: StudyGoal[];
  };
  notifications?: Notification[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: Timestamp;
  type: 'streak' | 'study_time' | 'quiz_score' | 'level' | 'topic_mastery';
}

export interface StudyGoal {
  id: string;
  type: 'daily' | 'weekly';
  target: number;
  progress: number;
  startTime: Timestamp;
  endTime: Timestamp;
  completed: boolean;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'streak' | 'level_up' | 'goal';
  message: string;
  timestamp: Timestamp;
  read: boolean;
  dataRetentionPeriod?: number;
  dataUsageConsent?: boolean;
  marketingConsent?: boolean;
  thirdPartyConsent?: boolean;
}