// src/services/secureAIService.ts (NEW FILE - Replaces direct OpenAI calls)

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ChatResponse {
  success: boolean;
  data?: {
    content: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    model: string;
  };
  error?: string;
  type?: string;
}

class SecureAIService {
  private baseUrl: string;

  constructor() {
    // Use your Netlify site URL or localhost for development
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/.netlify/functions' 
      : 'http://localhost:8888/.netlify/functions';
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      return data;
    } catch (error) {
      console.error('Secure AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'network_error'
      };
    }
  }

  // Helper method for math tutoring
  async getMathHelp(question: string, context?: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a helpful math tutor. Explain concepts clearly and show step-by-step solutions. 
                 Use proper mathematical notation and be encouraging. Focus on O-Level and A-Level mathematics.
                 ${context ? `Additional context: ${context}` : ''}`
      },
      {
        role: 'user',
        content: question
      }
    ];

    const response = await this.chat({ 
      messages, 
      model: 'gpt-4', 
      maxTokens: 1000,
      temperature: 0.7 
    });

    if (response.success && response.data) {
      return response.data.content;
    } else {
      throw new Error(response.error || 'Failed to get math help');
    }
  }

  // Helper method for document analysis
  async analyzeDocument(content: string, analysisType: string = 'general'): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an AI assistant that analyzes academic documents. 
                 Provide helpful feedback and suggestions for improvement.
                 Analysis type: ${analysisType}`
      },
      {
        role: 'user',
        content: `Please analyze this document: ${content}`
      }
    ];

    const response = await this.chat({ 
      messages, 
      model: 'gpt-4', 
      maxTokens: 1500,
      temperature: 0.5 
    });

    if (response.success && response.data) {
      return response.data.content;
    } else {
      throw new Error(response.error || 'Failed to analyze document');
    }
  }

  // Helper method for conversation continuation
  async continueConversation(conversationHistory: ChatMessage[]): Promise<string> {
    const response = await this.chat({ 
      messages: conversationHistory,
      model: 'gpt-4',
      maxTokens: 800,
      temperature: 0.7
    });

    if (response.success && response.data) {
      return response.data.content;
    } else {
      throw new Error(response.error || 'Failed to continue conversation');
    }
  }
}

// Export a singleton instance
export const secureAIService = new SecureAIService();

// Export the class for custom instances if needed
export default SecureAIService;
