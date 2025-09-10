import { useState, useCallback } from 'react';
import OpenAI from 'openai';
import { nanoid } from 'nanoid';
import { toast as toastLib } from 'react-hot-toast';
import { env } from '../config/env.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_AGENT_ID || 'asst_KpFlU9Rxd4LGJMbYY9KCXrmm';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function useOpenAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Save conversation to localStorage for history
  const saveConversation = (messages: Message[]) => {
    if (messages.length === 0) return;
    
    try {
      const conversations = JSON.parse(localStorage.getItem('moklik_conversations') || '[]');
      const conversationId = Date.now().toString();
      const title = messages.find(m => m.role === 'user')?.content.slice(0, 50) + '...' || 'New Conversation';
      
      const conversation = {
        id: conversationId,
        title,
        messages,
        timestamp: new Date().toISOString(),
        messageCount: messages.length
      };
      
      conversations.unshift(conversation);
      // Keep only last 50 conversations
      if (conversations.length > 50) {
        conversations.splice(50);
      }
      
      localStorage.setItem('moklik_conversations', JSON.stringify(conversations));
    } catch (error) {
      toastLib.error('Failed to save conversation.');
    }
  };

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
      const conversation = conversations.find((c: any) => c.id === conversationId);
      if (conversation) {
        setMessages(conversation.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setThreadId(null); // Reset thread for new conversation
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toastLib.error('Failed to load conversation');
    }
  }, []);

  // Create a new thread if needed
  const ensureThread = useCallback(async () => {
    if (!threadId) {
      try {
        const thread = await openai.beta.threads.create();
        setThreadId(thread.id);
        return thread.id;
      } catch (error) {
        console.error('Error creating thread:', error);
        throw new Error('Failed to create conversation thread');
      }
    }
    return threadId;
  }, [threadId]);

  // Send a message and get a response
  const sendMessage = useCallback(async (
    content: string, 
    analysisContent?: string,
    regenerate: boolean = false
  ) => {
    if (!content.trim()) {
      toastLib.error('Please enter a message');
      return;
    }

    console.log('useOpenAI: Starting sendMessage', { content, regenerate });

    setIsLoading(true);
    setError(null);
    
    try {
      // Validate API key
      if (!env.VITE_OPENAI_API_KEY || env.VITE_OPENAI_API_KEY === 'your-api-key-here') {
        console.error('useOpenAI: Invalid API key');
        throw new Error('OpenAI API key is not configured properly');
      }

      console.log('useOpenAI: API key validated');

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
      
      // Ensure we have a thread
      const currentThreadId = await ensureThread();
      console.log('useOpenAI: Thread ID obtained:', currentThreadId);
      
      // Add message to thread (include analysis content if provided)
      const messageContent = analysisContent ? `${content}\n\nImage Analysis:\n${analysisContent}` : content;
      
      try {
        await openai.beta.threads.messages.create(currentThreadId, {
          role: 'user',
          content: messageContent
        });
        console.log('useOpenAI: Message added to thread');
      } catch (error: any) {
        console.error('useOpenAI: Error adding message to thread:', error);
        if (error.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI configuration.');
        }
        if (error.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw error;
      }
      
      // Run the assistant
      let run;
      try {
        run = await openai.beta.threads.runs.create(currentThreadId, {
          assistant_id: ASSISTANT_ID
        });
        console.log('useOpenAI: Assistant run created:', run.id);
      } catch (error: any) {
        console.error('useOpenAI: Error creating run:', error);
        if (error.status === 404) {
          throw new Error('Assistant not found. Please check the assistant configuration.');
        }
        throw error;
      }
      
      // Poll for completion
      let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      console.log('useOpenAI: Initial run status:', runStatus.status);
      
      while (runStatus.status !== 'completed' && 
             runStatus.status !== 'failed' && 
             runStatus.status !== 'cancelled') {
        // Wait for a second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
          console.log('useOpenAI: Run status update:', runStatus.status);
        } catch (error) {
          console.error('Error polling run status:', error);
          break;
        }
      }
      
      if (runStatus.status === 'failed') {
        console.error('useOpenAI: Run failed:', runStatus.last_error);
        throw new Error(runStatus.last_error?.message || 'Assistant run failed');
      }
      
      if (runStatus.status === 'cancelled') {
        console.error('useOpenAI: Run cancelled');
        throw new Error('Assistant run was cancelled');
      }
      
      // Get the latest messages
      const messagesResponse = await openai.beta.threads.messages.list(currentThreadId);
      console.log('useOpenAI: Retrieved messages:', messagesResponse.data.length);
      
      // Find the assistant's response (should be the most recent)
      const assistantMessage = messagesResponse.data.find(msg => 
        msg.role === 'assistant' && 
        msg.run_id === run.id
      );
      
      if (assistantMessage) {
        console.log('useOpenAI: Found assistant message');
        // Extract the text content
        let responseContent = '';
        
        for (const content of assistantMessage.content) {
          if (content.type === 'text') {
            responseContent += content.text.value;
          }
        }
        
        console.log('useOpenAI: Response content extracted:', responseContent.length, 'characters');

        // Add assistant message to state
        const newAssistantMessage: Message = {
          id: assistantMessage.id,
          role: 'assistant',
          content: responseContent,
          timestamp: new Date()
        };
        
        if (regenerate) {
          // Replace the last assistant message
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.role !== 'assistant' || msg.id !== prev[prev.length - 1].id);
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
      } else {
        console.error('useOpenAI: No assistant message found in response');
        throw new Error('No response received from the assistant');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toastLib.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('useOpenAI: sendMessage completed');
    }
  }, [ensureThread, threadId]);

  // Clear all messages
  const clearMessages = useCallback(async () => {
    setMessages([]);
    setThreadId(null);
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