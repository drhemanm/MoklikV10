export interface ChatMessage {
  content: string;
  timestamp: number;
  type: 'text' | 'math' | 'plot' | 'chart';
  data?: any;
}

export interface ChatResponse {
  messages: ChatMessage[];
  error?: string;
}