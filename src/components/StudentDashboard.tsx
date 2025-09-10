import { ProgressDisplay } from './ProgressDisplay.js';
import { useTopics } from '../hooks/useTopics.js';
import { TopicProgress } from './TopicProgress.js';

export function StudentDashboard() {
  const { selectedTopic, topics } = useTopics();

  const currentTopic = selectedTopic 
    ? topics.find((t: any) => t.id === selectedTopic)
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