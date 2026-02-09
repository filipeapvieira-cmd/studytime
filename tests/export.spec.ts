import { test, expect } from '@playwright/test';

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

if (!email || !password) {
  throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables must be set');
}

const TEST_USER = {
  email,
  password,
};

test.describe('Personal Data Export', () => {
  test('should return 401 for unauthorized access to export endpoint', async ({ request }) => {
    const response = await request.get('/api/user/export');
    expect(response.status()).toBe(401);
  });

  test('should export data as JSON for authenticated user', async ({ page }) => {
    // 1. Login
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });

    // 2. Request export via API (using browser context to share auth cookie)
    const response = await page.request.get('/api/user/export?format=json');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()['content-disposition']).toContain('attachment; filename="studytime-export-');
    expect(response.headers()['content-disposition']).toContain('.json"');
    expect(response.headers()['cache-control']).toContain('private, no-store');

    const body = await response.json();
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('user');
    expect(body.user).not.toHaveProperty('password'); // Ensure no sensitive data
    expect(body).toHaveProperty('records');
    expect(body.records).toHaveProperty('studySessions');
  });

  test('should export data as CSV for authenticated user', async ({ page }) => {
    // 1. Login
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });

    // 2. Request export via API
    const response = await page.request.get('/api/user/export?format=csv');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/csv');
    expect(response.headers()['content-disposition']).toContain('attachment; filename="studytime-export-');
    expect(response.headers()['content-disposition']).toContain('.csv"');

    const text = await response.text();
    // Check for header row
    expect(text).toContain('Session ID,Start Time,End Time,Pause Duration (ms),Created At,Topics (Title | Time),Feeling');
  });
});
