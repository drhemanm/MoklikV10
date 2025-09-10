export const ERROR_MESSAGES = {
  API: {
    KEY_INVALID: 'OpenAI API key is invalid. Please check your configuration.',
    RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    GENERIC: 'An unexpected error occurred. Please try again.',
    NO_RESPONSE: 'No response received from the AI service.',
  },
  VALIDATION: {
    ENV_VARS: 'Invalid environment variables configuration.',
    API_CONFIG: 'Invalid API configuration.',
  }
} as const;