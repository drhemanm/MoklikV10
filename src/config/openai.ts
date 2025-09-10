import OpenAI from 'openai';
import { API_CONFIG } from './constants';

export const openai = new OpenAI({
  apiKey: API_CONFIG.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});