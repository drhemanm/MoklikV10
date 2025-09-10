import React from 'react';
import { ProgressDisplay } from './ProgressDisplay';
import { useProgress } from '../hooks/useProgress';
import { useTopics } from '../hooks/useTopics';
import { TopicProgress } from './TopicProgress';

export function StudentDashboard() {
  const { selectedTopic, topics } = useTopics();
  const { getOverallProgress } = useProgress();

  const currentTopic = selectedTopic 
    ? topics.find(t => t.id === selectedTopic)
    : null;

  return (
    <div className="space-y-8">
      <ProgressDisplay />
      
      {currentTopic && (
        <div className="mt-8 glass rounded-2xl shadow-glass p-6 hover:shadow-glow transition-all">
          <TopicProgress topic={currentTopic} />
        </div>
      )}
    </div>
  );
}