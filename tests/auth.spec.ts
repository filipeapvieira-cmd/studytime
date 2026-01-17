import { test, expect } from '@playwright/test';

test.describe('Authentication E2E Tests', () => {
    test('should access the application home page', async ({ page }) => {
        await page.goto('/');

        // Verify the page loads successfully by checking for content
        await expect(page).toHaveURL('/');

        // Check that essential content is present (hero section)
        await expect(page.locator('main')).toBeVisible();
    });
});
