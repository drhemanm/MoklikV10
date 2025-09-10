export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'o-level' | 'a-level';
}

export interface TopicState {
  selectedTopic: string | null;
  selectedCategory: 'o-level' | 'a-level';
}