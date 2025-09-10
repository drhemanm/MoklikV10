import { openai } from '../../config/openai.js';
import { SystemPrompts } from './prompts.js';

export async function submitAssignment(file: File): Promise<string> {
  try {
    const fileContent = await fileToBase64(file);
    const systemPrompt = SystemPrompts.getAssignmentReviewPrompt();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Please review this assignment: ${file.name}\nContent: ${fileContent}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || 'Unable to process the assignment.';
  } catch (error) {
    console.error('Assignment submission error:', error);
    throw new Error('Failed to submit assignment for review. Please try again.');
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}