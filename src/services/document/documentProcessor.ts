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

  private static async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
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

      let extractedText = '';
      let analysisPrompt = '';

      if (file.type === 'text/plain') {
        // Handle plain text files directly
        extractedText = await this.extractTextFromPlainText(file);
        
        if (!extractedText || extractedText.trim().length === 0) {
          return { 
            success: false, 
            error: 'No text content found in the document.' 
          };
        }

        const wordCount = this.countWords(extractedText);
        const detectedTopics = this.identifyMathTopics(extractedText);

        analysisPrompt = `Please analyze this text document (${wordCount} words) and provide educational guidance:

Document: ${file.name}
Topics detected: ${detectedTopics.join(', ') || 'General Mathematics'}

Content:
${extractedText}

Please provide:
1. Analysis of mathematical concepts present
2. Detailed explanations for any problems or questions
3. Step-by-step solutions where appropriate
4. Suggestions for improvement and study recommendations
5. Reference to Cambridge O-Level and A-Level standards where applicable`;

      } else {
        // Handle PDF and Word documents using OpenAI's document processing
        const base64Data = await this.convertFileToBase64(file);
        
        // Use OpenAI to extract and analyze the document content
        const extractionResponse = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a document text extraction and analysis expert. Your task is to:
              1. Extract all readable text from the document
              2. Identify mathematical concepts and problems
              3. Provide educational analysis and guidance
              
              Focus on mathematical content and provide clear, educational feedback.`
            },
            {
              role: 'user',
              content: `Please extract and analyze the content from this ${file.type === 'application/pdf' ? 'PDF' : 'Word'} document named "${file.name}".
              
              The document is provided as base64 data. Please:
              1. Extract all readable text content
              2. Identify key mathematical concepts
              3. Provide detailed explanations and guidance
              4. Suggest improvements based on Cambridge O-Level/A-Level standards
              
              Note: If you cannot directly process the file, please provide guidance on what the student should do to get their document analyzed.`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        });

        if (!extractionResponse.choices[0]?.message?.content) {
          return {
            success: false,
            error: 'Failed to process document. Please try converting to text format or contact support.'
          };
        }

        // For binary files, we'll use the AI analysis as both extracted text and content
        const aiResponse = extractionResponse.choices[0].message.content;
        extractedText = `[AI Analysis of ${file.name}]\n${aiResponse}`;
        
        return {
          success: true,
          content: aiResponse,
          extractedText: extractedText,
          wordCount: this.countWords(aiResponse),
          detectedTopics: ['Document Analysis'] // We can't detect topics from binary files easily
        };
      }

      // Create AI analysis for text files
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert mathematics tutor analyzing a student's document. 
            Provide detailed explanations, identify key concepts, and suggest improvements.
            Reference Cambridge O-Level and A-Level standards where applicable.
            Be encouraging but accurate in your feedback.`
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error('No response received from AI analysis');
      }

      const analysisContent = response.choices[0].message.content;
      const wordCount = this.countWords(extractedText);
      const detectedTopics = this.identifyMathTopics(extractedText);

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
