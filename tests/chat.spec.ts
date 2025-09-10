import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.click('text=Sign In');
  });

  test('should send and receive messages', async ({ page }) => {
    await page.fill('input[placeholder="Ask your question..."]', 'What is the derivative of x^2?');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.message-content')).toContainText('2x');
  });

  test('should handle empty messages', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});