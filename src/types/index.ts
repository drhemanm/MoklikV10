export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Question {
  id: string;
  topicId: string;
  content: string;
  solution?: string;
}

export interface UserProgress {
  topicId: string;
  completed: boolean;
  score: number;
  level: 'o-level' | 'a-level';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document';
  url: string;
  level: 'o-level' | 'a-level' | 'both';
}