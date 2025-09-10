import OpenAI from 'openai';
import { API_CONFIG } from '../../config/api';

const openai = new OpenAI({
  apiKey: API_CONFIG.OPENAI.API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ImageAnalysisResult {
  success: boolean;
  isMathRelated: boolean;
  content?: string;
  error?: string;
  suggestions?: string[];
}

export class ImageAnalysisService {
  static async analyzeImage(imageBase64: string, fileName: string): Promise<ImageAnalysisResult> {
    try {
      // First, check if the image contains math content
      const mathValidationResponse = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are a mathematics content validator. Analyze the uploaded image and determine if it contains mathematical content such as:
            - Mathematical equations or expressions
            - Geometric figures or diagrams
            - Mathematical graphs or charts
            - Mathematical word problems
            - Mathematical formulas or calculations
            - Mathematical homework or assignments
            - Mathematical textbook pages
            
            Respond with a JSON object containing:
            {
              "isMathRelated": boolean,
              "confidence": number (0-100),
              "mathTopics": string[] (list of identified math topics),
              "reason": string (explanation of your decision)
            }`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image and determine if it contains mathematical content: ${fileName}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      });

      const validationContent = mathValidationResponse.choices[0]?.message?.content;
      if (!validationContent) {
        throw new Error('No validation response received');
      }

      let validationResult;
      try {
        validationResult = JSON.parse(validationContent);
      } catch (error) {
        // Fallback if JSON parsing fails
        const isMathRelated = validationContent.toLowerCase().includes('true') || 
                             validationContent.toLowerCase().includes('math') ||
                             validationContent.toLowerCase().includes('equation');
        validationResult = { isMathRelated, confidence: 50, reason: 'Fallback validation' };
      }

      // If not math-related, return early with suggestions
      if (!validationResult.isMathRelated || validationResult.confidence < 30) {
        return {
          success: true,
          isMathRelated: false,
          error: "This image doesn't appear to contain mathematical content.",
          suggestions: [
            "Please upload an image containing mathematical equations, problems, or diagrams",
            "Make sure the image is clear and the mathematical content is visible",
            "Try uploading homework problems, textbook pages, or handwritten math work",
            "Ensure good lighting and focus when taking photos of math problems"
          ]
        };
      }

      // If math-related, proceed with detailed analysis
      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are Moklik, an expert mathematics tutor. Analyze the mathematical content in this image and provide:

            1. A clear description of what mathematical concepts/problems are shown
            2. Step-by-step solutions for any problems visible
            3. Explanations of key concepts
            4. Common mistakes students make with these types of problems
            5. Practice suggestions

            Format your response with proper mathematical notation using LaTeX:
            - Use \\(...\\) for inline math: \\(x^2 + 2x + 1\\)
            - Use \\[...\\] for display math: \\[\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\]
            
            Be encouraging and educational in your tone. If you see any errors in the student's work, point them out gently and explain the correct approach.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this mathematical image and help me understand the content: ${fileName}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });

      const analysisContent = analysisResponse.choices[0]?.message?.content;
      if (!analysisContent) {
        throw new Error('No analysis response received');
      }

      return {
        success: true,
        isMathRelated: true,
        content: analysisContent
      };

    } catch (error) {
      console.error('Image analysis error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('rate_limit')) {
          return {
            success: false,
            isMathRelated: false,
            error: 'Too many requests. Please wait a moment before uploading another image.'
          };
        }
        
        if (error.message.includes('invalid_api_key')) {
          return {
            success: false,
            isMathRelated: false,
            error: 'API configuration error. Please contact support.'
          };
        }
      }

      return {
        success: false,
        isMathRelated: false,
        error: 'Failed to analyze the image. Please try again or ensure the image is clear and contains mathematical content.'
      };
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'Image size must be less than 5MB' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
    }

    return { valid: true };
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}