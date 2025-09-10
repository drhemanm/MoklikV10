import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').refine(
    (key) => key !== 'your-api-key-here' && key.startsWith('sk-'),
    'OpenAI API key must be a valid key starting with sk-'
  ),
});

export function validateEnv() {
  const parsed = envSchema.safeParse({
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      'Invalid environment variables: ' + 
      parsed.error.errors.map(e => e.message).join(', ')
    );
  }

  return parsed.data;
}

export const env = (() => {
  try {
    return validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    // Return a fallback object to prevent app crashes
    return {
      VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || ''
    };
  }
})();