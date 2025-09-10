export interface TopicProgress {
  id: string;
  topicId: string;
  completionPercentage: number;
  lastAccessed: number;
  exercises: {
    total: number;
    completed: number;
    correct: number;
  };
  timeSpent: number; // in minutes
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  streak: {
    current: number;
    lastActive: number;
  };
  topics: Record<string, TopicProgress>;
}

export interface ProgressUpdate {
  type: 'exercise' | 'study' | 'quiz';
  topicId: string;
  data: {
    correct?: boolean;
    timeSpent?: number;
    completionPercentage?: number;
  };
}