import { env } from './env.js';

export const API_CONFIG = {
  OPENAI: {
    API_KEY: env.VITE_OPENAI_API_KEY,
    BASE_URL: 'https://api.openai.com/v1',
    DEFAULT_MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 800,
    TEMPERATURE: 0.7,
    PRESENCE_PENALTY: 0.6,
    FREQUENCY_PENALTY: 0.3,
  }
} as const;