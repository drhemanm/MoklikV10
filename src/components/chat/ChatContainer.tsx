import { useState, useRef, useEffect } from 'react';
import { useOpenAI } from '../../hooks/useOpenAI.js';
import { ChatInput } from './ChatInput.js';
import { ChatMessage } from './ChatMessage.js';
import { ChatHeader } from './ChatHeader.js';
import { easterEggManager } from '../../utils/easterEggs.js';
import { useVirtualizer } from '@tanstack/react-virtual';
import toast from 'react-hot-toast';

interface ChatContainerProps {
  topic?: string;
}

export function ChatContainer({ topic }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useOpenAI();
  const [solvedProblems, setSolvedProblems] = useState(0);

  useEffect(() => {
    // Check for math enthusiast achievement
    if (solvedProblems === 10) {
      easterEggManager.triggerEasterEgg('MATH_ENTHUSIAST');
    }
  }, [solvedProblems]);
  const parentRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string, fileBase64?: string) => {
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    await sendMessage(content, fileBase64);
    // Increment solved problems when a correct answer is detected
    if (content.toLowerCase().includes('correct') || content.toLowerCase().includes('well done')) {
      setSolvedProblems(prev => prev + 1);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return;
    
    try {
      await sendMessage(lastUserMessage.content, undefined, true);
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast.error('Failed to regenerate response. Please try again.');
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 h-[600px] flex flex-col">
      <ChatHeader 
        topic={topic}
        onClear={clearMessages}
        messageCount={messages.length}
      />
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4" ref={parentRef}>
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Start a conversation with Moklik AI Tutor
            </p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onRegenerate={msg.role === 'assistant' ? handleRegenerate : undefined}
            />
          ))
        )}
      </div>
      
      <ChatInput 
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}