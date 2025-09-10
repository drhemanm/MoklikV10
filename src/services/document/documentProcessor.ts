import { openai } from '../../config/openai';
import { ERROR_MESSAGES } from '../../config/errors';

const CHATPDF_API_KEY = 'sec_XXXXXXXXXXXX'; // Replace with actual key
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

interface ProcessingResult {
  success: boolean;
  content?: string;
  error?: string;
}

export class DocumentProcessor {
  private static validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file format. Only PDF, DOCX, and TXT files are allowed';
    }
    
    return null;
  }

  private static async extractText(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Read file content directly
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file content'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });

    } catch (error) {
      console.error('Text extraction error:', error);
      return null;
    }
  }

  static async processDocument(
    file: File,
    assistantId: string
  ): Promise<ProcessingResult> {
    try {
      const validationError = this.validateFile(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      const content = await this.extractText(file);
      if (!content) {
        return { success: false, error: 'Failed to read file content' };
      }

      // Analyze content for mathematical topics
      const mathTopics = this.identifyMathTopics(content);

      // Create chat completion with OpenAI with context about exam papers
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'system',
            content: `You are an expert mathematics tutor with access to Cambridge O-Level and A-Level past examination papers
              and marking schemes. The following topics have been identified in the document: ${mathTopics.join(', ')}.
              
              Instructions:
              1. Analyze the content and identify key mathematical concepts
              2. Reference specific past paper questions that are similar
              3. Provide detailed explanations using marking scheme guidelines
              4. Compare the approach with standard examination techniques
              5. Suggest improvements based on examiner reports
              
              Always cite specific paper references (e.g., "Similar to Question 3 in May/June 2022 Paper 2")`
          },
          {
            role: 'user',
            content: `Please analyze this document and provide a detailed response, referencing relevant past papers and marking schemes: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        functions: [
          {
            name: "search_past_papers",
            description: "Search through past papers and marking schemes",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to find relevant past papers"
                },
                topics: {
                  type: "array",
                  items: { type: "string" },
                  description: "Mathematical topics identified in the document"
                }
              },
              required: ["query", "topics"]
            }
          }
        ]
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('No response received from AI');
      }

      return {
        success: true,
        content: response.choices[0].message.content
      };
    } catch (error) {
      console.error('Document processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process document'
      };
    }
  }

  private static identifyMathTopics(content: string): string[] {
    const topicPatterns = {
      'Calculus': /(derivative|integral|differentiation|integration)/i,
      'Algebra': /(equation|polynomial|quadratic|linear)/i,
      'Trigonometry': /(sin|cos|tan|angle|triangle)/i,
      'Vectors': /(vector|magnitude|direction|component)/i,
      'Statistics': /(probability|mean|median|mode|standard deviation)/i
    };

    return Object.entries(topicPatterns)
      .filter(([_, pattern]) => pattern.test(content))
      .map(([topic]) => topic);
  }
}