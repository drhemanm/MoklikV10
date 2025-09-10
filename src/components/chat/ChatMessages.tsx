import React, { useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ErrorMessage } from '../ui/ErrorMessage';
import type { Message } from '../../hooks/useChat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function ChatMessages({ messages, isLoading, error }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {error && <ErrorMessage message={error} />}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <span className="text-sm text-gray-500">Thinking...</span>
        </div>
      )}
    </div>
  );
}