import { useState, useCallback, useEffect } from 'react';
import { getAIResponse } from '../services/ai/chat';
import { chatService } from '../services/firebase/chat';
import { useAuth } from './useAuth';
import { generateId } from '../utils/id';
import { ERROR_MESSAGES } from '../config/constants';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  referencedMessageId?: string;
  isSystemMessage?: boolean;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const sendMessage = useCallback(async (
    content: string, 
    topic?: string, 
    referencedMessageId?: string | null,
    isSystemMessage = false
  ) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const messageId = generateId('msg');

      // Special handling for document review
      const contextType = topic === 'document-review' ? 'document' : 'chat';
      
      if (isSystemMessage) {
        const aiMessage: Message = {
          id: messageId,
          role: 'ai',
          content,
          timestamp: Date.now(),
          contextType,
          isSystemMessage: true
        };
        setState(prev => ({
          ...prev,
          messages: [aiMessage],
          isLoading: false
        }));
        return;
      }

      const userMessage: Message = {
        id: messageId,
        role: 'user',
        content,
        timestamp: Date.now(),
        contextType,
        referencedMessageId
      };
      
      addMessage(userMessage);
      
      const response = await getAIResponse(content, topic, state.messages);
      
      const aiMessage: Message = {
        id: generateId('resp'),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
        contextType,
        referencedMessageId: messageId
      };
      
      addMessage(aiMessage);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
        isLoading: false
      }));
    }
  }, [state.messages, addMessage]);

  const clearChat = useCallback(async () => {
    setState({
      messages: [],
      isLoading: false,
      error: null
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat
  };
}