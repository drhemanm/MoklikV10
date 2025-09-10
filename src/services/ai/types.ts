export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface AIServiceConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
}