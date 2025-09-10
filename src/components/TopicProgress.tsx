import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import type { Topic } from '../types/topic';

interface TopicProgressProps {
  topic: Topic;
}

export function TopicProgress({ topic }: TopicProgressProps) {
  const { getTopicProgress } = useProgress();
  const progress = getTopicProgress(topic.id);

  if (!progress) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium text-gray-900">{topic.title}</h3>
        </div>
        {progress.completionPercentage >= 100 && (
          <Award className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Completion</span>
            <span className="font-medium">{progress.completionPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Exercises</p>
            <p className="font-medium">
              {progress.exercises.completed}/{progress.exercises.total}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="font-medium">
              {progress.exercises.completed > 0
                ? Math.round((progress.exercises.correct / progress.exercises.completed) * 100)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time</p>
            <p className="font-medium">{progress.timeSpent} mins</p>
          </div>
        </div>
      </div>
    </div>
  );
}