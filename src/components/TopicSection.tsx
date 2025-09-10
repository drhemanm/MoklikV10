import React from 'react';
import { Rocket, BookOpen } from 'lucide-react';
import { TopicCard } from './TopicCard';
import { useTopics } from '../hooks/useTopics';

export function TopicSection() {
  const { selectedTopic, selectedCategory, topics, selectTopic, setCategory } = useTopics();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Learning Topics</h2>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => setCategory('o-level')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === 'o-level'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            O-Level
          </button>
          <button
            onClick={() => setCategory('a-level')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === 'a-level'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            A-Level
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {selectedCategory === 'o-level' ? 'Cambridge O-Level' : 'Cambridge A-Level'} Mathematics
          </span>
        </div>
        
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onSelect={selectTopic}
              isSelected={selectedTopic === topic.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}