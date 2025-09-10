export interface Message {
  id: string;
  role: 'user' | 'ai' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  contextType: 'chat' | 'document';
  referencedMessageId?: string;
  isSystemMessage?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}