import { openai } from '../../config/openai';

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
  extractedText?: string; // Add extracted raw text
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
    try {
      // Handle different file types
      if (file.type === 'text/plain') {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read text file'));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
        });
      }

      // For PDF and DOCX files, we need to use specialized libraries
      // For now, convert to base64 and let OpenAI handle the extraction
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            // Convert file to base64 for OpenAI processing
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    } catch (error) {
      console.error('Text extraction error:', error);
      return null;
    }
  }

  static async processDocument(
    file: File,
    _assistantId: string
  ): Promise<ProcessingResult> {
    try {
      const validationError = this.validateFile(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      const fileContent = await this.extractText(file);
      if (!fileContent) {
        return { success: false, error: 'Failed to read file content' };
      }

      let extractedText = '';
      let messages: any[] = [];

      if (file.type === 'text/plain') {
        // For text files, use content directly
        extractedText = fileContent;
        messages = [
          {
            role: 'system',
            content: `You are an expert mathematics tutor analyzing a student's document. 
              Provide detailed explanations, identify key concepts, and suggest improvements.
              Reference Cambridge O-Level and A-Level standards where applicable.`
          },
          {
            role: 'user',
            content: `Please analyze this document content: ${extractedText}`
          }
        ];
      } else {
        // For PDF/DOCX, use OpenAI's file processing capabilities
        messages = [
          {
            role: 'system',
            content: `You are an expert mathematics tutor analyzing a student's document. 
              Extract the text content first, then provide detailed explanations, 
              identify key mathematical concepts, and suggest improvements.
              Reference Cambridge O-Level and A-Level standards where applicable.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please extract and analyze the content from this ${file.type === 'application/pdf' ? 'PDF' : 'Word'} document. Focus on mathematical concepts and provide educational guidance.`
              }
              // Note: OpenAI's vision API doesn't directly support PDF/DOCX
              // You'll need a proper document parsing library like pdf-parse or mammoth
            ]
          }
        ];
      }

      // Analyze content for mathematical topics
      const mathTopics = extractedText ? this.identifyMathTopics(extractedText) : [];

      // Create chat completion with OpenAI
      const response = await openai.chat.completions.create({
        model: 'gpt-4', // Use GPT-4 for better document analysis
        messages,
        temperature: 0.7,
        max_tokens: 4000
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('No response received from AI');
      }

      const analysisContent = response.choices[0].message.content;

      return {
        success: true,
        content: analysisContent,
        extractedText: extractedText || 'Document processed (binary content)'
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
      'Calculus': /(derivative|integral|differentiation|integration|limit|chain rule)/i,
      'Algebra': /(equation|polynomial|quadratic|linear|factoring|expand)/i,
      'Trigonometry': /(sin|cos|tan|angle|triangle|identity|radian)/i,
      'Vectors': /(vector|magnitude|direction|component|dot product|cross product)/i,
      'Statistics': /(probability|mean|median|mode|standard deviation|distribution)/i,
      'Geometry': /(circle|rectangle|triangle|area|perimeter|volume|theorem)/i,
      'Functions': /(function|domain|range|inverse|composite|graph)/i
    };

    return Object.entries(topicPatterns)
      .filter(([_, pattern]) => pattern.test(content))
      .map(([topic]) => topic);
  }
}
