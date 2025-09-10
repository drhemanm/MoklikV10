import { test, expect } from '@playwright/test';
import { OWASP } from 'zap-api';

// Security test suite
test.describe('Security Testing', () => {
  let zap;

  test.beforeAll(async () => {
    // Initialize ZAP API client
    zap = new OWASP({
      apiKey: process.env.ZAP_API_KEY,
      proxy: 'http://localhost:8080',
    });
  });

  test('should not have critical vulnerabilities', async () => {
    // Run active scan
    const scanId = await zap.activeScan.scan('https://moklik-46048.web.app');
    
    // Wait for scan to complete
    await zap.activeScan.waitForCompletion(scanId);
    
    // Get scan results
    const alerts = await zap.alert.alerts();
    
    // Filter critical and high alerts
    const criticalAlerts = alerts.filter(
      alert => alert.risk === 'High' || alert.risk === 'Critical'
    );
    
    expect(criticalAlerts.length).toBe(0);
  });

  test('authentication endpoints should have rate limiting', async () => {
    const loginUrl = 'https://moklik-46048.web.app/api/auth/login';
    const responses = [];

    // Attempt rapid login requests
    for (let i = 0; i < 50; i++) {
      const response = await fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      responses.push(response);
    }

    // Verify rate limiting is active
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });

  test('should have secure headers', async ({ page }) => {
    await page.goto('https://moklik-46048.web.app');
    
    const response = await page.request.get('https://moklik-46048.web.app');
    const headers = response.headers();
    
    expect(headers['strict-transport-security']).toBeTruthy();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['content-security-policy']).toBeTruthy();
  });

  test('should prevent XSS attacks', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>';
    
    // Test chat input
    await page.goto('https://moklik-46048.web.app');
    await page.fill('[data-testid="chat-input"]', xssPayload);
    await page.click('[data-testid="send-button"]');
    
    // Verify XSS payload is escaped
    const messageContent = await page.textContent('.message-content');
    expect(messageContent).not.toContain('<script>');
  });

  test('should protect against CSRF', async ({ request }) => {
    const response = await request.post('https://moklik-46048.web.app/api/user/profile', {
      data: {
        name: 'Test User',
      },
    });
    
    // Verify CSRF protection
    expect(response.status()).toBe(403);
  });

  test('should enforce authentication', async ({ request }) => {
    const endpoints = [
      '/api/chat',
      '/api/documents',
      '/api/user/profile',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(
        `https://moklik-46048.web.app${endpoint}`
      );
      expect(response.status()).toBe(401);
    }
  });
});