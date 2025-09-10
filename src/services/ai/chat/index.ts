import { openAIService } from '../openai';
import { SystemPrompts } from '../prompts';
import type { Message } from '../../../hooks/useChat';
import { AIMessage } from '../types';
import { handleAIError } from '../error-handler';
import { processMessageContent } from './message-processor';

export async function getAIResponse(
  question: string,
  topic?: string,
  contextMessages: Message[] = []
): Promise<string> {
  try {
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

    return processMessageContent(response.data);
  } catch (error) {
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

export * from './types';