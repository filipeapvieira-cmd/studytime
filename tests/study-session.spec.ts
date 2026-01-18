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

test.describe('Study Session E2E Tests', () => {
    test('should complete a full study session workflow', async ({ page }) => {
        // 1. Login
        await page.goto('/auth/login');

        const emailInput = page.getByLabel('Email');
        await expect(emailInput).toBeVisible();
        await emailInput.fill(TEST_USER.email);
        await emailInput.blur();

        const passwordInput = page.getByLabel('Password');
        await passwordInput.fill(TEST_USER.password);
        await passwordInput.blur();

        const loginButton = page.getByRole('button', { name: 'Login' });
        await expect(loginButton).toBeEnabled({ timeout: 5000 });
        await loginButton.click();

        // Wait for navigation to /journaling after successful login
        await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');

        // Add additional wait to ensure all components are mounted
        await page.waitForTimeout(2000);

        // 2. Start study session - Click the play button (use first if multiple exist)
        const startSessionButton = page.getByTestId('btn-timer').first();
        await expect(startSessionButton).toBeVisible({ timeout: 10000 });
        await startSessionButton.click();

        // Wait for session to start (timer should start running)
        await page.waitForTimeout(1000);

        // 3. Select the first subject from dropdown
        const subjectButton = page.getByRole('combobox').filter({ hasText: '📚 Subject' });
        await expect(subjectButton).toBeVisible({ timeout: 5000 });
        await subjectButton.click();

        // Wait for dropdown to open and select first subject
        const firstSubject = page.locator('[role="option"]').first();
        await expect(firstSubject).toBeVisible({ timeout: 5000 });
        await firstSubject.click();

        // 4. Write something in the editor
        const editorBlock = page.locator('.ce-paragraph[contenteditable="true"]').first();
        await expect(editorBlock).toBeVisible({ timeout: 5000 });
        await editorBlock.click();
        await editorBlock.fill('This is a test study session entry.');

        // 5. Stop the study session
        const stopSessionButton = page.locator('button').filter({
            has: page.locator('svg.lucide-stop-circle')
        });
        await expect(stopSessionButton).toBeVisible({ timeout: 5000 });
        await stopSessionButton.click();

        // Click Continue on the modal that appears
        const stopContinueButton = page.getByRole('button', { name: 'Continue' });
        await expect(stopContinueButton).toBeVisible({ timeout: 5000 });
        await stopContinueButton.click();

        // 6. Save the session
        const saveButton = page.locator('button').filter({
            has: page.locator('svg.lucide-save')
        });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Click Continue on the modal that appears
        const saveContinueButton = page.getByRole('button', { name: 'Continue' });
        await expect(saveContinueButton).toBeVisible({ timeout: 5000 });
        await saveContinueButton.click();

        // 7. Wait for success message
        const successToast = page.locator('[role="status"]').filter({ hasText: 'Success' }).first();
        await expect(successToast).toBeVisible({ timeout: 10000 });
        await expect(successToast).toContainText('Session saved successfully');

        // Wait a bit for the toast to be readable
        await page.waitForTimeout(2000);

        // 8. Logout
        const userMenuButton = page.locator('button.rounded-full').first();
        await expect(userMenuButton).toBeVisible({ timeout: 5000 });
        await userMenuButton.click();

        const logoutMenuItem = page.getByRole('menuitem', { name: /log out/i });
        await expect(logoutMenuItem).toBeVisible({ timeout: 5000 });
        await logoutMenuItem.click();

        // Verify we're redirected to home page or login page after logout
        await expect(page).toHaveURL(/^\/$|\/auth\/login/, { timeout: 10000 });
    });
});
