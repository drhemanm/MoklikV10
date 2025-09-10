import { ChevronRight, BookOpen, Star, Award } from 'lucide-react';
import { useProgress } from '../hooks/useProgress.js';
import { useChat } from '../hooks/useChat.js';
import { useGamification } from '../hooks/useGamification.js';
import type { Topic } from '../types/topic.js';

interface TopicCardProps {
  topic: Topic;
  onSelect: (topicId: string) => void;
  isSelected: boolean;
}

export function TopicCard({ topic, onSelect, isSelected }: TopicCardProps) {
  const { getTopicProgress } = useProgress();
  const { sendMessage } = useChat();
  const { stats } = useGamification();
  const progress = getTopicProgress(topic.id);

  const difficultyColor = {
    beginner: 'text-green-600',
    intermediate: 'text-yellow-600',
    advanced: 'text-red-600'
  }[topic.difficulty];

  const handleTopicSelect = async () => {
    onSelect(topic.id);
    await sendMessage(
      `I want to learn about ${topic.title}. Can you list the key topics and concepts I should focus on?`,
      topic.id
    );
  };
  const getMasteryBadge = () => {
    if (!progress) return null;
    if (progress.completionPercentage >= 100) return <Award className="w-5 h-5 text-yellow-500" />;
    if (progress.completionPercentage >= 75) return <Award className="w-5 h-5 text-gray-400" />;
    if (progress.completionPercentage >= 50) return <Award className="w-5 h-5 text-orange-300" />;
    return null;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 transform scale-[1.02] bg-blue-50' : ''
      }`}
      onClick={handleTopicSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {getMasteryBadge()}
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <p className="text-base text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className={`w-4 h-4 ${difficultyColor}`} />
          <span className={`text-sm font-medium capitalize ${difficultyColor}`}>
            {topic.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600 font-medium">
            {progress?.completionPercentage || 0}% Complete
          </div>
          {isSelected && (
            <span className="text-sm text-green-600 font-medium animate-pulse">
              Studying...
            </span>
          )}
          <div className="w-24">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress?.completionPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}