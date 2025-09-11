import { openai } from '../../config/openai';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

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
  extractedText?: string;
  wordCount?: number;
  detectedTopics?: string[];
}

export class DocumentProcessor {
  private static validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file format. Only PDF, DOCX, DOC, and TXT files are allowed';
    }
    
    return null;
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse(Buffer.from(arrayBuffer));
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. The file may be corrupted or password-protected.');
    }
  }

  private static async extractTextFromWord(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (result.messages.length > 0) {
        console.warn('Word extraction warnings:', result.messages);
      }
      
      return result.value;
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Failed to extract text from Word document. The file may be corrupted or in an unsupported format.');
    }
  }

  private static async extractTextFromPlainText(file: File): Promise<string> {
    try {
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
        reader.readAsText(file, 'UTF-8');
      });
    } catch (error) {
      console.error('Text file extraction error:', error);
      throw new Error('Failed to read text file.');
    }
  }

  private static async extractText(file: File): Promise<string> {
    const fileType = file.type;
    
    switch (fileType) {
      case 'application/pdf':
        return await this.extractTextFromPDF(file);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return await this.extractTextFromWord(file);
      
      case 'text/plain':
        return await this.extractTextFromPlainText(file);
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private static identifyMathTopics(content: string): string[] {
    const topicPatterns = {
      'Calculus': /(derivative|integral|differentiation|integration|limit|chain rule|product rule|quotient rule)/i,
      'Algebra': /(equation|polynomial|quadratic|linear|factoring|expand|simplify|solve)/i,
      'Trigonometry': /(sin|cos|tan|angle|triangle|identity|radian|degree|unit circle)/i,
      'Vectors': /(vector|magnitude|direction|component|dot product|cross product|scalar)/i,
      'Statistics': /(probability|mean|median|mode|standard deviation|distribution|variance|correlation)/i,
      'Geometry': /(circle|rectangle|triangle|area|perimeter|volume|theorem|proof|angle)/i,
      'Functions': /(function|domain|range|inverse|composite|graph|plot|transformation)/i,
      'Matrices': /(matrix|determinant|eigenvalue|eigenvector|linear transformation)/i,
      'Number Theory': /(prime|factor|gcd|lcm|modular|congruence)/i,
      'Complex Numbers': /(complex|imaginary|real part|modulus|argument)/i
    };

    return Object.entries(topicPatterns)
      .filter(([_, pattern]) => pattern.test(content))
      .map(([topic]) => topic);
  }

  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  static async processDocument(
    file: File,
    _assistantId: string
  ): Promise<ProcessingResult> {
    try {
      // Validate file
      const validationError = this.validateFile(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Extract text from document
      const extractedText = await this.extractText(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        return { 
          success: false, 
          error: 'No text content found in the document. The file may be empty or contain only images.' 
        };
      }

      // Count words and identify topics
      const wordCount = this.countWords(extractedText);
      const detectedTopics = this.identifyMathTopics(extractedText);

      // Create AI analysis prompt
      const systemPrompt = `You are an expert mathematics tutor analyzing a student's document. 
        The document contains ${wordCount} words and covers these mathematical topics: ${detectedTopics.join(', ') || 'General Mathematics'}.
        
        Your task:
        1. Analyze the mathematical content and identify key concepts
        2. Provide detailed explanations for any problems or questions found
        3. Reference Cambridge O-Level and A-Level standards where applicable
        4. Suggest improvements and study recommendations
        5. Point out any errors or misconceptions
        6. Provide step-by-step solutions where appropriate
        
        Be encouraging but accurate in your feedback.`;

      const userPrompt = `Please analyze this ${file.name} document content and provide educational guidance:

${extractedText}

Focus on the mathematical concepts present and provide helpful explanations and feedback.`;

      // Get AI analysis
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('No response received from AI analysis');
      }

      const analysisContent = response.choices[0].message.content;

      return {
        success: true,
        content: analysisContent,
        extractedText: extractedText,
        wordCount: wordCount,
        detectedTopics: detectedTopics
      };

    } catch (error) {
      console.error('Document processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process document'
      };
    }
  }
}
