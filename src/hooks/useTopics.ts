import { useState, useCallback } from 'react';
import { topics } from '../data/topics';
import type { Topic, TopicState } from '../types/topic';

export function useTopics() {
  const [state, setState] = useState<TopicState>({
    selectedTopic: null,
    selectedCategory: 'o-level'
  });

  const getTopicsByCategory = useCallback((category: 'o-level' | 'a-level') => {
    return topics.filter(topic => topic.category === category);
  }, []);

  const selectTopic = useCallback((topicId: string) => {
    setState(prev => ({
      ...prev,
      selectedTopic: topicId
    }));
  }, []);

  const setCategory = useCallback((category: 'o-level' | 'a-level') => {
    setState(prev => ({
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