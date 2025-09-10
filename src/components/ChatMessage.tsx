import { Bot, User } from 'lucide-react';
import type { Message } from '../hooks/useChat';
import { MathContentParser } from './math/MathContentParser';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === 'ai';
  
  return (
    <div
      className={`flex gap-3 p-4 rounded-lg ${
        isAI ? 'bg-gray-100 mr-auto max-w-[90%]' : 'bg-blue-100 ml-auto max-w-[85%]'
      }`}
    >
      <div className={`flex-shrink-0 ${isAI ? 'text-blue-600' : 'text-gray-600'}`}>
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {isAI ? 'Moklik' : 'You'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <MathContentParser content={message.content} />
      </div>
    </div>
  );
}
