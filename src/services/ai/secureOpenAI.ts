/**
 * Secure OpenAI Service
 *
 * This service calls Firebase Cloud Functions instead of making direct OpenAI API calls.
 * The API key is stored securely on the server, never exposed to the client.
 *
 * Benefits:
 * - API key is never in client-side code
 * - Server-side rate limiting
 * - User authentication required
 * - Usage monitoring and logging
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// Types for the secure API
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message: {
    role: string;
    content: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ImageAnalysisResponse {
  success: boolean;
  message: {
    role: string;
    content: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Get Firebase Functions instance
const functions = getFunctions();

// Cloud Function references
const chatWithAIFunction = httpsCallable<
  { messages: ChatMessage[]; model?: string; maxTokens?: number },
  ChatResponse
>(functions, 'chatWithAI');

const analyzeImageFunction = httpsCallable<
  { imageBase64: string; prompt?: string },
  ImageAnalysisResponse
>(functions, 'analyzeImage');

/**
 * Secure OpenAI Service class
 * All AI requests go through Cloud Functions for security
 */
export class SecureOpenAIService {
  /**
   * Send a chat message to the AI tutor
   * @param messages - Array of chat messages (conversation history)
   * @param options - Optional parameters for the request
   * @returns Promise with the AI response
   */
  static async chat(
    messages: ChatMessage[],
    options?: { model?: string; maxTokens?: number }
  ): Promise<ChatResponse> {
    const auth = getAuth();

    if (!auth.currentUser) {
      throw new Error('You must be signed in to use the AI tutor');
    }

    try {
      const result = await chatWithAIFunction({
        messages,
        model: options?.model || 'gpt-4o-mini',
        maxTokens: options?.maxTokens || 1000,
      });

      return result.data;
    } catch (error: any) {
      // Handle Firebase Function errors
      if (error.code === 'functions/unauthenticated') {
        throw new Error('Please sign in to use the AI tutor');
      }
      if (error.code === 'functions/resource-exhausted') {
        throw new Error('Too many requests. Please wait a moment.');
      }
      if (error.code === 'functions/failed-precondition') {
        throw new Error('AI service is not configured. Please contact support.');
      }

      console.error('Chat error:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }
  }

  /**
   * Analyze an image using GPT-4 Vision
   * @param imageBase64 - Base64 encoded image data
   * @param prompt - Optional prompt for the analysis
   * @returns Promise with the analysis result
   */
  static async analyzeImage(
    imageBase64: string,
    prompt?: string
  ): Promise<ImageAnalysisResponse> {
    const auth = getAuth();

    if (!auth.currentUser) {
      throw new Error('You must be signed in to analyze images');
    }

    try {
      const result = await analyzeImageFunction({
        imageBase64,
        prompt: prompt || 'Analyze this mathematical content and help solve any problems shown.',
      });

      return result.data;
    } catch (error: any) {
      if (error.code === 'functions/unauthenticated') {
        throw new Error('Please sign in to analyze images');
      }
      if (error.code === 'functions/resource-exhausted') {
        throw new Error('Too many requests. Please wait a moment.');
      }
      if (error.code === 'functions/invalid-argument') {
        throw new Error('Image is invalid or too large. Please try a smaller image.');
      }

      console.error('Image analysis error:', error);
      throw new Error(error.message || 'Failed to analyze image');
    }
  }

  /**
   * Check if the user is authenticated and can use AI features
   */
  static isAuthenticated(): boolean {
    const auth = getAuth();
    return !!auth.currentUser;
  }
}

// Export default instance for easy importing
export default SecureOpenAIService;
