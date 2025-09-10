import { useState, useCallback } from 'react';
import { topics } from '../data/topics.js';
import type { TopicState } from '../types/topic.js';

export function useTopics() {
  const [state, setState] = useState<TopicState>({
    selectedTopic: null,
    selectedCategory: 'o-level'
  });

  const getTopicsByCategory = useCallback((category: 'o-level' | 'a-level') => {
    return topics.filter((topic: any) => topic.category === category);
  }, []);

  const selectTopic = useCallback((topicId: string) => {
    setState((prev: TopicState) => ({
      ...prev,
      selectedTopic: topicId
    }));
  }, []);

  const setCategory = useCallback((category: 'o-level' | 'a-level') => {
    setState((prev: TopicState) => ({
      ...prev,
      selectedCategory: category,
      selectedTopic: null // Reset selected topic when changing category
    }));
  }, []);

  return {
    selectedTopic: state.selectedTopic,
    selectedCategory: state.selectedCategory,
    topics: getTopicsByCategory(state.selectedCategory),
    selectTopic,
    setCategory
  };
}