import { ERROR_MESSAGES } from '../../config/errors.js';

export class AIServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export function handleAIError(error: any): AIServiceError {
  console.error('AI Service Error:', error);

  if (error?.error?.code === 'invalid_api_key' || error?.code === 'invalid_api_key') {
    return new AIServiceError(
      ERROR_MESSAGES.API.KEY_INVALID,
      'invalid_api_key',
      401
    );
  }

  if (error?.error?.code === 'rate_limit_exceeded' || error?.code === 'rate_limit_exceeded') {
    return new AIServiceError(
      ERROR_MESSAGES.API.RATE_LIMIT,
      'rate_limit_exceeded',
      429
    );
  }

  if (error?.code === 'network_error' || error?.message?.includes('network')) {
    return new AIServiceError(
      ERROR_MESSAGES.API.NETWORK_ERROR,
      'network_error',
      503
    );
  }

  return new AIServiceError(
    ERROR_MESSAGES.API.GENERIC,
    'internal_error',
    500
  );
}