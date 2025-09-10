import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Test123!@#');
    await page.click('text=Sign In');
  });

  test('should navigate between tabs', async ({ page }) => {
    await page.click('text=Dashboard');
    
    await page.click('text=Statistics');
    await expect(page.locator('text=Study Time')).toBeVisible();
    
    await page.click('text=Resources');
    await expect(page.locator('text=Learning Resources')).toBeVisible();
    
    await page.click('text=Settings');
    await expect(page.locator('text=Profile Information')).toBeVisible();
  });
});