import { test, expect } from '@playwright/test';

test.describe('OpenAI API Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.click('text=Sign In');
  });

  test('should process chat messages with OpenAI', async ({ page }) => {
    const question = 'What is the derivative of x^2?';
    await page.fill('input[placeholder="Ask your question..."]', question);
    await page.click('button[type="submit"]');
    
    // Verify loading state
    await expect(page.locator('text=Thinking...')).toBeVisible();
    
    // Verify AI response
    await expect(page.locator('.message-content')).toContainText(/2x/);
  });

  test('should handle API rate limiting', async ({ page }) => {
    // Send multiple requests quickly
    for (let i = 0; i < 5; i++) {
      await page.fill('input[placeholder="Ask your question..."]', `Test question ${i}`);
      await page.click('button[type="submit"]');
    }
    
    // Verify rate limit handling
    await expect(page.locator('text=Please wait a moment')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Force an error by sending an empty message
    await page.evaluate(() => {
      window.localStorage.setItem('VITE_OPENAI_API_KEY', 'invalid_key');
    });
    
    await page.fill('input[placeholder="Ask your question..."]', 'Test question');
    await page.click('button[type="submit"]');
    
    // Verify error handling
    await expect(page.locator('text=Error processing your request')).toBeVisible();
  });

  test('should maintain conversation context', async ({ page }) => {
    // Send initial question
    await page.fill('input[placeholder="Ask your question..."]', 'What is x^2 + 2x + 1?');
    await page.click('button[type="submit"]');
    await expect(page.locator('.message-content')).toBeVisible();
    
    // Send follow-up question
    await page.fill('input[placeholder="Ask your question..."]', 'What is its derivative?');
    await page.click('button[type="submit"]');
    
    // Verify context-aware response
    await expect(page.locator('.message-content')).toContainText(/2x \+ 2/);
  });
});