import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast as toastLib } from 'react-hot-toast';
import { SecureOpenAIService, ChatMessage } from '../services/ai/secureOpenAI';

// Note: Direct OpenAI client removed for security
// All AI calls now go through secure Cloud Functions

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

export function useOpenAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save conversation to localStorage
  const saveConversation = useCallback((messages: Message[]) => {
    try {
      const conversations = JSON.parse(localStorage.getItem('moklik_conversations') || '[]');
      const conversationId = nanoid();
      const newConversation = {
        id: conversationId,
        timestamp: new Date().toISOString(),
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        preview: messages[0]?.content.substring(0, 100) || 'New conversation'
      };

      conversations.unshift(newConversation);

      // Keep only the last 50 conversations
      if (conversations.length > 50) {
        conversations.splice(50);
      }

      localStorage.setItem('moklik_conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }, []);

  // Load conversation history
  const loadConversationHistory = useCallback(() => {
    try {
      const conversations = JSON.parse(localStorage.getItem('moklik_conversations') || '[]');
      return conversations;
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  }, []);

  // Load a specific conversation
  const loadConversation = useCallback((conversationId: string) => {
    try {
      const conversations = JSON.parse(localStorage.getItem('moklik_conversations') || '[]');
      const conversation = conversations.find((c: { id: string }) => c.id === conversationId);
      if (conversation) {
        setMessages(conversation.messages.map((msg: { timestamp: string; id: string; role: 'user' | 'assistant'; content: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toastLib.error('Failed to load conversation');
    }
  }, []);

  // Send a message and get a response using secure Cloud Functions
  const sendMessage = useCallback(async (
    content: string,
    imageBase64?: string,
    regenerate: boolean = false
  ) => {
    if (!content.trim()) {
      toastLib.error('Please enter a message');
      return;
    }

    // Check if user is authenticated
    if (!SecureOpenAIService.isAuthenticated()) {
      toastLib.error('Please sign in to use the AI tutor');
      setError('Authentication required');
      return;
    }

    console.log('useOpenAI: Starting sendMessage (secure)', { content, hasImage: !!imageBase64, regenerate });

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to state immediately
      const userMessageId = nanoid();
      const userMessage: Message = {
        id: userMessageId,
        role: 'user',
        content,
        timestamp: new Date()
      };

      if (!regenerate) {
        setMessages(prev => [...prev, userMessage]);
        console.log('useOpenAI: User message added to state');
      }

      let assistantContent: string;

      // Handle image analysis using secure Cloud Function
      if (imageBase64) {
        console.log('useOpenAI: Using secure image analysis');

        const imageResponse = await SecureOpenAIService.analyzeImage(
          imageBase64.replace(/^data:image\/\w+;base64,/, ''), // Remove data URL prefix if present
          content
        );

        if (!imageResponse.success || !imageResponse.message?.content) {
          throw new Error('No response received from image analysis');
        }

        assistantContent = imageResponse.message.content;
        console.log('useOpenAI: Secure image analysis completed');
      } else {
        // Regular chat using secure Cloud Function
        console.log('useOpenAI: Using secure chat API');

        // Prepare conversation history for the API
        const chatMessages: ChatMessage[] = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Add the new user message
        chatMessages.push({
          role: 'user',
          content: content
        });

        const chatResponse = await SecureOpenAIService.chat(chatMessages);

        if (!chatResponse.success || !chatResponse.message?.content) {
          throw new Error('No response received from the assistant');
        }

        assistantContent = chatResponse.message.content;
        console.log('useOpenAI: Secure chat completed');
      }

      // Add assistant message to state
      const newAssistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      if (regenerate) {
        // Replace the last assistant message
        setMessages(prev => {
          const filtered = prev.filter((msg, index) =>
            msg.role !== 'assistant' || index !== prev.length - 1
          );
          const updated = [...filtered, newAssistantMessage];
          saveConversation(updated);
          return updated;
        });
      } else {
        setMessages(prev => {
          const updated = [...prev, newAssistantMessage];
          saveConversation(updated);
          return updated;
        });
      }

      console.log('useOpenAI: Assistant message added to state');

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toastLib.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('useOpenAI: sendMessage completed');
    }
  }, [messages, saveConversation]);

  // Clear all messages
  const clearMessages = useCallback(async () => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    loadConversationHistory,
    loadConversation
  };
}
