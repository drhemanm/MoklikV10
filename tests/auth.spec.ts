import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should allow user registration', async ({ page }) => {
    await page.click('text=Need an account?');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.fill('input[id="confirmPassword"]', 'Test123!@#');
    await page.click('text=Sign Up');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle invalid login', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('text=Sign In');
    
    await expect(page.locator('text=No account found with this email')).toBeVisible();
  });
});