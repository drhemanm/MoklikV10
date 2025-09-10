import React from 'react';
import { Brain, Trash2, Settings, Download } from 'lucide-react';

interface ChatHeaderProps {
  topic?: string;
  onClear: () => void;
  messageCount: number;
}

export function ChatHeader({ 
  topic, 
  onClear, 
  messageCount 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Brain className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Moklik AI Tutor
          </h2>
          {topic && (
            <p className="text-sm text-gray-600">
              Current topic: {topic}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {messageCount > 0 && (
          <>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              title="Download chat"
            >
              <Download size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClear}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}