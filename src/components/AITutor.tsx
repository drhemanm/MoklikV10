import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAssistantTips } from '../hooks/useAssistantTips';
import { ChatMessage } from './ChatMessage';
import { ErrorMessage } from './ui/ErrorMessage';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { SystemPrompts } from '../services/ai/prompts';
import { AvatarAssistant } from './Avatar/AvatarAssistant';

interface AITutorProps {
  selectedTopic?: string;
}

export function AITutor({ selectedTopic }: AITutorProps) {
  const [question, setQuestion] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { currentTip, generateTip } = useAssistantTips(selectedTopic);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [initialized, setInitialized] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    
    try {
      await sendMessage(question, selectedTopic);
      setQuestion('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (!initialized && messages.length === 0) {
      const initializeChat = async () => {
        try {
          await sendMessage(SystemPrompts.getInitialMessage(), undefined, undefined, true);
          generateTip('info');
          setInitialized(true);
        } catch (error) {
          console.error('Error initializing chat:', error);
        }
      };
      initializeChat();
    }
  }, [initialized, messages.length, sendMessage, generateTip]);

  // Update assistant message based on chat state
  useEffect(() => {
    if (isLoading) {
      setAssistantMessage("I'm thinking about your question...");
      return;
    }

    if (error) {
      setAssistantMessage("I encountered an error. Let me help you with something else.");
      generateTip('error');
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'ai' && !lastMessage.isSystemMessage) {
      generateTip('success');
    }
  }, [isLoading, error, messages, generateTip]);

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 h-[500px] md:h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Chat with Moklik</h2>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700"
              title="Clear chat"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg: any) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {error && <ErrorMessage message={error} />}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

      <AvatarAssistant 
        topic={selectedTopic}
        isThinking={isLoading}
        message={assistantMessage || currentTip?.content}
      />
    </div>
  );
}