import OpenAI from 'openai';
import { AIMessage, AIResponse } from './types.js';
import { handleAIError } from './error-handler.js';
import { createAIConfig } from './config.js';
import { ERROR_MESSAGES } from '../../config/errors.js';
import { env } from '../../config/env.js';

export class OpenAIService {
  private client: OpenAI;
  private config: ReturnType<typeof createAIConfig>;

  constructor() {
    try {
      // Validate API key exists
      if (!env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is missing from environment variables');
      }

      this.config = createAIConfig();
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        dangerouslyAllowBrowser: true
      });

      console.log('OpenAI client initialized successfully');
    } catch (error) {
      console.error('OpenAI Service initialization failed:', error);
      throw new Error(ERROR_MESSAGES.VALIDATION.API_CONFIG);
    }
  }

  public async createChatCompletion(messages: AIMessage[]): Promise<AIResponse> {
    try {
      console.log('Sending request to OpenAI with', messages.length, 'messages');
      
      // Check if any message contains images
      const hasImages = messages.some(msg => 
        Array.isArray(msg.content) && 
        msg.content.some(part => part.type === 'image_url')
      );
      
      // Use vision model if images are present, otherwise use configured model
      const modelToUse = hasImages ? 'gpt-4o' : this.config.model;
      
      console.log('Using model:', modelToUse, hasImages ? '(vision enabled)' : '(text only)');
      
      const response = await this.client.chat.completions.create({
        model: modelToUse,
        messages,
        temperature: this.config.temperature,
        max_tokens: hasImages ? 1500 : this.config.maxTokens,
        presence_penalty: this.config.presencePenalty,
        frequency_penalty: this.config.frequencyPenalty
      });

      console.log('OpenAI response received successfully');

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error(ERROR_MESSAGES.API.NO_RESPONSE);
      }

      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      const aiError = handleAIError(error);
      return {
        success: false,
        error: aiError.message
      };
    }
  }
}

export const openAIService = new OpenAIService();
