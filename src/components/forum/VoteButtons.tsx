import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteButtonsProps {
  score: number;
  userVote?: 1 | -1 | null;
  onVote: (value: 1 | -1) => void;
  disabled?: boolean;
}

export function VoteButtons({ score, userVote, onVote, disabled }: VoteButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onVote(1)}
        disabled={disabled}
        className={`p-1 rounded ${
          userVote === 1
            ? 'text-green-600 bg-green-50'
            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
        } transition-colors disabled:opacity-50`}
        title="Upvote"
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      
      <span className={`text-sm font-medium ${
        score > 0 ? 'text-green-600' :
        score < 0 ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {score}
      </span>
      
      <button
        onClick={() => onVote(-1)}
        disabled={disabled}
        className={`p-1 rounded ${
          userVote === -1
            ? 'text-red-600 bg-red-50'
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
        } transition-colors disabled:opacity-50`}
        title="Downvote"
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  );
}