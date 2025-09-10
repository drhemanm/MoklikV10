import React from 'react';
import { ArrowLeft, ThumbsUp, Clock, User } from 'lucide-react';
import type { ForumTopic, ForumPost } from '../../types/forum.js';
import { RichTextEditor } from './RichTextEditor.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';

interface TopicViewProps {
  topic: ForumTopic;
  posts: ForumPost[];
  onBack: () => void;
  onReply: (topicId: string, content: string, authorId: string, authorName: string, parentId?: string) => Promise<string>;
  onLike: (id: string, type: 'topic' | 'post') => void;
  isLoading: boolean;
}

export function TopicView({
  topic,
  posts,
  onBack,
  onReply,
  onLike,
  isLoading
}: TopicViewProps) {
  const [replyContent, setReplyContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(topic.id, replyContent, topic.authorId, topic.authorName);
      setReplyContent('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discussions</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">{topic.title}</h1>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{topic.authorName}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(topic.createdAt.toMillis()).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onLike(topic.id, 'topic')}
            className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{topic.likes}</span>
          </button>
        </div>

        <div className="prose max-w-none mb-4">
          {topic.content}
        </div>

        {topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {topic.tags.map((tag: any) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-lg shadow-sm p-6 ${
              post.parentId ? 'ml-8 border-l-4 border-gray-100' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.createdAt.toMillis()).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onLike(post.id, 'post')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Reply</h3>
        <RichTextEditor
          value={replyContent}
          onChange={setReplyContent}
          placeholder="Share your thoughts..."
          userId="demo-user"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitReply}
            disabled={isSubmitting || !replyContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <LoadingSpinner /> : 'Post Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}