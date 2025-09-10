import { useState, useEffect, useCallback } from 'react';
import { UserProgress, ProgressUpdate, TopicProgress } from '../types/progress.js';
import { topics } from '../data/topics.js';

const STORAGE_KEY = 'moklik_progress';
const XP_PER_LEVEL = 1000;

const createInitialTopicProgress = (topicId: string): TopicProgress => ({
  id: crypto.randomUUID(),
  topicId,
  completionPercentage: 0,
  lastAccessed: Date.now(),
  exercises: {
    total: 0,
    completed: 0,
    correct: 0
  },
  timeSpent: 0
});

const createInitialProgress = (): UserProgress => ({
  userId: crypto.randomUUID(),
  xp: 0,
  level: 1,
  streak: {
    current: 0,
    lastActive: Date.now()
  },
  topics: topics.reduce((acc, topic) => ({
    ...acc,
    [topic.id]: createInitialTopicProgress(topic.id)
  }), {} as Record<string, TopicProgress>)
});

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return createInitialProgress();
      
      const parsed = JSON.parse(stored);
      // Ensure all topics exist in the progress
      const updatedTopics = topics.reduce((acc: Record<string, TopicProgress>, topic: any) => ({
        ...acc,
        [topic.id]: parsed.topics[topic.id] || createInitialTopicProgress(topic.id)
      }), {} as Record<string, TopicProgress>);

      return {
        ...parsed,
        topics: updatedTopics
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return createInitialProgress();
    }
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [progress]);

  // Update streak daily
  useEffect(() => {
    const lastActive = new Date(progress.streak.lastActive || Date.now()).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (today > lastActive) {
      const isConsecutive = (today - lastActive) === 86400000; // 24 hours in ms
      
      setProgress((prev: UserProgress) => ({
        ...prev,
        streak: {
          current: isConsecutive ? prev.streak.current + 1 : 1,
          lastActive: Date.now()
        },
        xp: prev.xp + (isConsecutive ? 100 : 0) // Bonus XP for maintaining streak
      }));
    }
  }, []);

  const updateProgress = useCallback((update: ProgressUpdate) => {
    setProgress(prev => {
      const topicProgress = prev.topics[update.topicId];
      if (!topicProgress) return prev;

      let xpGained = 0;
      const updatedTopic: TopicProgress = { ...topicProgress };

      switch (update.type) {
        case 'exercise':
          if (update.data.correct !== undefined) {
            updatedTopic.exercises.completed++;
            if (update.data.correct) {
              updatedTopic.exercises.correct++;
              xpGained += 50;
            }
          }
          break;
        case 'study':
          if (update.data.timeSpent) {
            updatedTopic.timeSpent += update.data.timeSpent;
            xpGained += Math.floor(update.data.timeSpent / 5); // XP per 5 minutes
          }
          break;
        case 'quiz':
          if (update.data.completionPercentage !== undefined) {
            updatedTopic.completionPercentage = Math.max(
              topicProgress.completionPercentage,
              update.data.completionPercentage
            );
            xpGained += Math.floor(update.data.completionPercentage * 2);
          }
          break;
      }

      const newXP = prev.xp + xpGained;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        topics: {
          ...prev.topics,
          [update.topicId]: {
            ...updatedTopic,
            lastAccessed: Date.now()
          }
        }
      };
    });
  }, []);

  const getTopicProgress = useCallback((topicId: string) => {
    return progress.topics[topicId] || createInitialTopicProgress(topicId);
  }, [progress.topics]);

  const getOverallProgress = useCallback(() => {
    if (!progress.topics || Object.keys(progress.topics).length === 0) return 0;
    
    const totalTopics = Object.keys(progress.topics).length;
    const totalCompletion = Object.values(progress.topics)
      .reduce((sum: number, topic: TopicProgress) => sum + (topic.completionPercentage || 0), 0);
    
    return Math.round(totalCompletion / totalTopics);
  }, [progress.topics]);

  const getTotalStudyTime = useCallback(() => {
    if (!progress.topics) return 0;
    return Object.values(progress.topics)
      .reduce((total: number, topic: TopicProgress) => total + (topic.timeSpent || 0), 0);
  }, [progress.topics]);

  return {
    progress,
    level: progress.level,
    xp: progress.xp,
    streak: progress.streak.current,
    updateProgress,
    getTopicProgress,
    getOverallProgress,
    getTotalStudyTime
  };
}