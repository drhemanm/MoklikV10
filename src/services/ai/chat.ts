import { openAIService } from './openai';
import { SystemPrompts } from './prompts.js';
import type { Message } from '../../hooks/useChat.js';
import { AIMessage } from './types.js';
import { handleAIError } from './error-handler.js';
import { env } from '../../config/env.js';

export async function getAIResponse(
  question: string,
  topic?: string,
  contextMessages: Message[] = []
): Promise<string> {
  try {
    // Validate API key before making request
    if (!env.VITE_OPENAI_API_KEY || env.VITE_OPENAI_API_KEY === 'your-api-key-here') {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.');
    }

    const systemPrompt = SystemPrompts.getChatPrompt(topic);
    const messageHistory = prepareMessageHistory(contextMessages);
    
    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messageHistory,
      { role: 'user', content: question }
    ];

    const response = await openAIService.createChatCompletion(messages);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get AI response');
    }

    return response.data;
  } catch (error) {
    console.error('AI Response Error:', error);
    throw handleAIError(error);
  }
}

function prepareMessageHistory(messages: Message[]): AIMessage[] {
  return messages
    .filter(msg => !msg.isSystemMessage)
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}