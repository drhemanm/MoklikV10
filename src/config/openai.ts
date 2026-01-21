/**
 * OpenAI Configuration
 *
 * SECURITY NOTE: Direct OpenAI client instantiation has been removed.
 * All AI requests now go through secure Firebase Cloud Functions.
 *
 * The API key is stored securely on the server and never exposed to the client.
 * Use SecureOpenAIService from '../services/ai/secureOpenAI' for AI calls.
 *
 * To configure the OpenAI API key on the server, run:
 * firebase functions:config:set openai.key="sk-your-key"
 */

// Re-export the secure service for backward compatibility
export { SecureOpenAIService as default } from '../services/ai/secureOpenAI';
export { SecureOpenAIService } from '../services/ai/secureOpenAI';

// Legacy export - deprecated, will throw an error if used
export const openai = {
  chat: {
    completions: {
      create: () => {
        throw new Error(
          'Direct OpenAI client is disabled for security. Use SecureOpenAIService instead.'
        );
      }
    }
  },
  beta: {
    threads: {
      create: () => {
        throw new Error(
          'Direct OpenAI client is disabled for security. Use SecureOpenAIService instead.'
        );
      }
    }
  }
};
