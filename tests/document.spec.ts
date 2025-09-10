import { test, expect } from '@playwright/test';
test.describe('Document Upload and Processing', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.click('text=Sign In');
  });

  test('should process document and reference past papers', async ({ page }) => {
    // Create a test file with math content
    const mathContent = `
      Question 1: Find the derivative of f(x) = x^2 + 3x + 2
      Solution: Using the power rule and constant rule
      f'(x) = 2x + 3
    `;

    await page.setInputFiles('input[type="file"]', {
      name: 'math_test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(mathContent)
    });

    // Wait for processing
    await expect(page.locator('text=Processing file...')).toBeVisible();

    // Verify AI response references past papers
    const messageContent = await page.locator('.message-content').first();
    await expect(messageContent).toContainText(/past paper|marking scheme/i);
    await expect(messageContent).toContainText(/derivative|differentiation/i);
  });

  test('should handle PDF upload and processing', async ({ page }) => {
    // Create a test file input
    await page.setInputFiles('input[type="file"]', {
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Test PDF content')
    });

    // Wait for upload progress
    await expect(page.locator('text=Processing file...')).toBeVisible();

    // Wait for AI response
    await expect(page.locator('.message-content')).toBeVisible();
    
    // Verify response contains analysis
    await expect(page.locator('.message-content')).toContainText(/analysis|content|document/i);
  });

  test('should validate file types', async ({ page }) => {
    // Try uploading invalid file type
    await page.setInputFiles('input[type="file"]', {
      name: 'test.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('Invalid file content')
    });

    // Verify error message
    await expect(page.locator('text=Invalid file type')).toBeVisible();
  });

  test('should handle large files', async ({ page }) => {
    // Create large file (11MB)
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

    // Try uploading
    await page.setInputFiles('input[type="file"]', {
      name: 'large.pdf',
      mimeType: 'application/pdf',
      buffer: largeBuffer
    });

    // Verify size limit error
    await expect(page.locator('text=File size must be less than 10MB')).toBeVisible();
  });

  test('should handle OpenAI API errors gracefully', async ({ page }) => {
    // Force API error by using invalid content
    await page.setInputFiles('input[type="file"]', {
      name: 'empty.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('')
    });

    // Verify error handling
    await expect(page.locator('text=Error processing document')).toBeVisible();
  });

  test('should show upload progress', async ({ page }) => {
    // Create medium size file (5MB)
    const mediumBuffer = Buffer.alloc(5 * 1024 * 1024);

    // Start upload
    await page.setInputFiles('input[type="file"]', {
      name: 'medium.pdf',
      mimeType: 'application/pdf',
      buffer: mediumBuffer
    });

    // Verify progress indicator
    await expect(page.locator('.progress-bar')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('text=Processing file...')).toBeVisible();
    await expect(page.locator('.message-content')).toBeVisible();
  });
});