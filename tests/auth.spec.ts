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

test.describe('Authentication E2E Tests', () => {
    test('should access the application home page', async ({ page }) => {
        await page.goto('/');

        // Verify the page loads successfully by checking for content
        // await expect(page).toHaveURL('/');
        await expect(page).toHaveURL('/fail'); // Intentional failure for testing deployment blockage

        // Check that essential content is present (hero section)
        await expect(page.locator('main')).toBeVisible();
    });
    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        // Wait for the login form to be visible
        const emailInput = page.getByLabel('Email');
        await expect(emailInput).toBeVisible();

        await emailInput.fill(TEST_USER.email);
        await emailInput.blur();

        const passwordInput = page.getByLabel('Password');
        await passwordInput.fill(TEST_USER.password);
        await passwordInput.blur();

        // Wait for the form to become valid (button should be enabled)
        const loginButton = page.getByRole('button', { name: 'Login' });
        await expect(loginButton).toBeEnabled({ timeout: 5000 });

        await loginButton.click();

        // Wait for navigation to /journaling after successful login (DEFAULT_LOGIN_REDIRECT)
        await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });
    });

    test('should logout successfully', async ({ page }) => {
        await page.goto('/auth/login');

        const emailInput = page.getByLabel('Email');
        await emailInput.fill(TEST_USER.email);
        await emailInput.blur();

        const passwordInput = page.getByLabel('Password');
        await passwordInput.fill(TEST_USER.password);
        await passwordInput.blur();

        const loginButton = page.getByRole('button', { name: 'Login' });
        await expect(loginButton).toBeEnabled({ timeout: 5000 });
        await loginButton.click();

        // Wait for /journaling to load
        await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });

        // Wait for the page content to fully load
        await page.waitForLoadState('networkidle');

        // Find the user menu button
        const userMenuButton = page.locator('button.rounded-full').first();
        await expect(userMenuButton).toBeVisible({ timeout: 5000 });
        await userMenuButton.click();

        // Wait for dropdown to open and click logout
        const logoutMenuItem = page.getByRole('menuitem', { name: /log out/i });
        await expect(logoutMenuItem).toBeVisible({ timeout: 5000 });
        await logoutMenuItem.click();

        // Verify we're redirected to home page or login page after logout
        await expect(page).toHaveURL(/^\/$|\/auth\/login/, { timeout: 10000 });
    });
});

