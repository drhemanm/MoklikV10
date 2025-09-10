import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  User, 
  Clock, 
  Flag,
  Share,
  CheckCircle,
  Tag,
  Send,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Discussion } from './DiscussionList';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
  dislikes: number;
  isAnswer: boolean;
  userVote?: 'up' | 'down' | null;
}

interface DiscussionDetailProps {
  discussion: Discussion;
  replies: Reply[];
  onAddReply: (content: string) => void;
  onVoteDiscussion: (value: 'up' | 'down') => void;
  onVoteReply: (replyId: string, value: 'up' | 'down') => void;
  onMarkAsAnswer: (replyId: string) => void;
  isLoading?: boolean;
}

export function DiscussionDetail({
  discussion,
  replies,
  onAddReply,
  onVoteDiscussion,
  onVoteReply,
  onMarkAsAnswer,
  isLoading = false
}: DiscussionDetailProps) {
  const [replyContent, setReplyContent] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVoteDiscussion = (value: 'up' | 'down') => {
    if (userVote === value) {
      setUserVote(null);
    } else {
      setUserVote(value);
    }
    onVoteDiscussion(value);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onAddReply(replyContent);
    setReplyContent('');
  };

  // Filter for sensitive information
  const filterSensitiveInfo = (content: string): string => {
    // Filter out email patterns
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    content = content.replace(emailRegex, '[EMAIL REDACTED]');
    
    // Filter out phone number patterns
    const phoneRegex = /\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
    content = content.replace(phoneRegex, '[PHONE REDACTED]');
    
    return content;
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-24 bg-gray-200 rounded mb-8"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Discussion */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {discussion.title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            {discussion.author.avatar ? (
              <img 
                src={discussion.author.avatar} 
                alt={discussion.author.name}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <User className="w-4 h-4 mr-2" />
            )}
            <span>{discussion.author.name}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <span>{discussion.views} views</span>
          </div>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-line">
            {filterSensitiveInfo(discussion.content)}
          </p>
        </div>
        
        {discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVoteDiscussion('up')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                userVote === 'up'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{discussion.likes}</span>
            </button>
            
            <button
              onClick={() => handleVoteDiscussion('down')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                userVote === 'down'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
              <Flag className="w-4 h-4" />
              <span className="text-sm">Report</span>
            </button>
          </div>
        </div>
      </Card>
      
      {/* Replies */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          Replies ({replies.length})
        </h2>
        
        {replies.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No replies yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to reply to this discussion!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${
                  reply.isAnswer ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {reply.author.avatar ? (
                      <img 
                        src={reply.author.avatar} 
                        alt={reply.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">
                          {reply.author.name}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {reply.isAnswer && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Best Answer
                        </span>
                      )}
                    </div>
                    
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 whitespace-pre-line">
                        {filterSensitiveInfo(reply.content)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => onVoteReply(reply.id, 'up')}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                            reply.userVote === 'up'
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => onVoteReply(reply.id, 'down')}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                            reply.userVote === 'down'
                              ? 'bg-red-100 text-red-700'
                              : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{reply.dislikes}</span>
                        </button>
                      </div>
                      
                      {!reply.isAnswer && (
                        <button
                          onClick={() => onMarkAsAnswer(reply.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Mark as Answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Add Reply */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Add Your Reply</h3>
          <div className="mb-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReply}
              disabled={!replyContent.trim()}
              variant="primary"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Post Reply
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}