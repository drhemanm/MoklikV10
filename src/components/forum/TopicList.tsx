import React from 'react';
import { MessageSquare, ThumbsUp, Eye, Clock, Tag } from 'lucide-react';
import type { ForumTopic } from '../../types/forum';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TopicListProps {
  topics: ForumTopic[];
  onTopicClick: (topicId: string) => void;
  onLike: (topicId: string) => void;
  isLoading: boolean;
}

export function TopicList({ topics, onTopicClick, onLike, isLoading }: TopicListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
        <p className="text-gray-600">Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 cursor-pointer" onClick={() => onTopicClick(topic.id)}>
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {topic.title}
              </h3>
              <p className="text-gray-600 mt-1 line-clamp-2 whitespace-pre-line">{topic.content}</p>
              
              {topic.tags.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onLike(topic.id)}
              className="flex items-center space-x-1 px-2 py-1 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{topic.likes}</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{topic.replyCount} replies</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{topic.views} views</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(topic.createdAt.toMillis()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}