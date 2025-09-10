export const APP_CONFIG = {
  APP_NAME: 'Moklik',
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  PRESENCE_PENALTY: 0.6,
  FREQUENCY_PENALTY: 0.3,
  UPLOAD_CHUNK_SIZE: 1024 * 1024, // 1MB chunks
  MAX_CHAT_MESSAGES: 100, // Limit for optimal performance
  CONNECTION_POOL: {
    MIN_CONNECTIONS: 5,
    MAX_CONNECTIONS: 20,
    IDLE_TIMEOUT: 30000
  }
} as const;

export const API_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  API_BASE_URL: 'https://api.openai.com/v1'
} as const;

export const ERROR_MESSAGES = {
  API_KEY_INVALID: 'OpenAI API key is invalid or not configured. Please check your environment variables.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.'
} as const;