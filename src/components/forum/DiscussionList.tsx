import React from 'react';
import { MessageSquare, ThumbsUp, Eye, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  likes: number;
  views: number;
  replies: number;
  solved: boolean;
}

interface DiscussionListProps {
  discussions: Discussion[];
  onSelectDiscussion: (discussion: Discussion) => void;
  isLoading?: boolean;
}

export function DiscussionList({ 
  discussions, 
  onSelectDiscussion,
  isLoading = false
}: DiscussionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
        <p className="text-gray-600 mb-6">
          Start the conversation! Ask questions, share insights, or help other students.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <motion.div
          key={discussion.id}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
          onClick={() => onSelectDiscussion(discussion)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                {discussion.title}
                <ArrowRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-600 line-clamp-2 mb-3">
                {discussion.content}
              </p>
              
              {discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
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
            </div>
            
            {discussion.solved && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                Solved
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
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
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{discussion.replies}</span>
              </div>
              
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{discussion.views}</span>
              </div>
              
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>{discussion.likes}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}