import { API_CONFIG } from '../../config/api.js';
import { z } from 'zod';

const aiConfigSchema = z.object({
  apiKey: z.string().min(1),
  model: z.string().min(1),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().positive(),
  presencePenalty: z.number().min(-2).max(2),
  frequencyPenalty: z.number().min(-2).max(2),
});

export type AIConfig = z.infer<typeof aiConfigSchema>;

export function createAIConfig(): AIConfig {
  const config = {
    apiKey: API_CONFIG.OPENAI.API_KEY,
    model: API_CONFIG.OPENAI.DEFAULT_MODEL,
    temperature: API_CONFIG.OPENAI.TEMPERATURE,
    maxTokens: API_CONFIG.OPENAI.MAX_TOKENS,
    presencePenalty: API_CONFIG.OPENAI.PRESENCE_PENALTY,
    frequencyPenalty: API_CONFIG.OPENAI.FREQUENCY_PENALTY,
  };

  const parsed = aiConfigSchema.safeParse(config);
  
  if (!parsed.success) {
    throw new Error('Invalid AI configuration: ' + 
      parsed.error.errors.map(e => e.message).join(', ')
    );
  }

  return parsed.data;
}