import { z } from 'zod';

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const passwordHistorySchema = z.array(z.string()).max(5);

export class PasswordPolicy {
  static validatePassword(password: string): { valid: boolean; error?: string } {
    try {
      passwordSchema.parse(password);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, error: error.errors[0].message };
      }
      return { valid: false, error: 'Invalid password' };
    }
  }

  static checkPasswordHistory(password: string, history: string[]): boolean {
    return !history.includes(password);
  }

  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password123', 'qwerty123', '12345678', 'admin123',
      'letmein123', 'welcome123', 'monkey123', 'football123'
    ];
    return commonPasswords.includes(password.toLowerCase());
  }
}