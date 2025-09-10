import { test, expect } from '@playwright/test';

// User Acceptance Test Suite
test.describe('User Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://sunny-cobbler-5bdbd6.netlify.app');
  });

  test('Authentication Flow', async ({ page }) => {
    // Test registration and login
    await test.step('User Registration', async () => {
      await page.click('text=Need an account?');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Test123!@#');
      await page.fill('input[id="confirmPassword"]', 'Test123!@#');
      await page.click('text=Sign Up');
      
      // Verify successful registration
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test('Chat Functionality', async ({ page }) => {
    // Login first
    await test.step('Login', async () => {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Test123!@#');
      await page.click('text=Sign In');
    });

    // Test chat features
    await test.step('Send Message', async () => {
      await page.fill('input[placeholder="Ask your question..."]', 'What is the derivative of x^2?');
      await page.click('button[type="submit"]');
      
      // Verify response
      await expect(page.locator('.message-content')).toContainText('2x');
    });
  });

  test('Dashboard Features', async ({ page }) => {
    // Login first
    await test.step('Login', async () => {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Test123!@#');
      await page.click('text=Sign In');
    });

    // Test dashboard navigation
    await test.step('Dashboard Navigation', async () => {
      await page.click('text=Dashboard');
      
      // Test tab switching
      await page.click('text=Statistics');
      await expect(page.locator('text=Study Time')).toBeVisible();
      
      await page.click('text=Resources');
      await expect(page.locator('text=Learning Resources')).toBeVisible();
      
      await page.click('text=Settings');
      await expect(page.locator('text=Profile Information')).toBeVisible();
    });
  });

  test('Resource Library', async ({ page }) => {
    // Login first
    await test.step('Login', async () => {
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'Test123!@#');
      await page.click('text=Sign In');
    });

    // Test resource library
    await test.step('Access Resources', async () => {
      await page.click('text=Learning Resources');
      
      // Verify resource categories
      await expect(page.locator('text=Course Syllabus')).toBeVisible();
      await expect(page.locator('text=Practice Workbook')).toBeVisible();
      await expect(page.locator('text=Past Examination Papers')).toBeVisible();
    });
  });

  test('Contact Information', async ({ page }) => {
    await test.step('Verify Contact Details', async () => {
      await page.click('text=Contact');
      
      // Verify contact information
      await expect(page.locator('text=5259 3285')).toBeVisible();
      await expect(page.locator('text=contact@moklik.org')).toBeVisible();
      await expect(page.locator('text=Monday to Friday')).toBeVisible();
      await expect(page.locator('text=9:00 AM - 5:00 PM')).toBeVisible();
    });
  });

  test('Responsive Design', async ({ page }) => {
    // Test different viewport sizes
    await test.step('Mobile View', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
    });

    await test.step('Tablet View', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('nav')).toBeVisible();
    });

    await test.step('Desktop View', async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(page.locator('nav')).toBeVisible();
    });
  });

  test('Error Handling', async ({ page }) => {
    await test.step('Invalid Login', async () => {
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('text=Sign In');
      
      // Verify error message
      await expect(page.locator('text=No account found with this email')).toBeVisible();
    });

    await test.step('Empty Chat Message', async () => {
      await page.click('button[type="submit"]');
      // Verify button is disabled
      await expect(page.locator('button[type="submit"]')).toBeDisabled();
    });
  });
});