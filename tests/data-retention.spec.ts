import { test, expect } from "@playwright/test";

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;
const cronSecret = process.env.CRON_SECRET;

if (!email || !password) {
  throw new Error(
    "TEST_EMAIL and TEST_PASSWORD environment variables must be set",
  );
}

const TEST_USER = { email, password };

/**
 * Helper: log in and navigate to Settings → Privacy.
 */
async function loginAndGoToPrivacy(page: import("@playwright/test").Page) {
  await page.goto("/auth/login");

  const emailInput = page.getByLabel("Email");
  await expect(emailInput).toBeVisible();
  await emailInput.fill(TEST_USER.email);
  await emailInput.blur();

  const passwordInput = page.getByLabel("Password");
  await passwordInput.fill(TEST_USER.password);
  await passwordInput.blur();

  const loginButton = page.getByRole("button", { name: "Login" });
  await expect(loginButton).toBeEnabled({ timeout: 5000 });
  await loginButton.click();

  await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  // Navigate to Settings → Privacy
  await page.goto("/settings/privacy");
  await page.waitForLoadState("networkidle");
}

test.describe("Data Retention – Policy Read / Write", () => {
  test("should update retention policy and persist after reload", async ({
    page,
  }) => {
    await loginAndGoToPrivacy(page);

    // Find the Data retention card
    const retentionCard = page.locator("text=Data retention").first();
    await expect(retentionCard).toBeVisible({ timeout: 10000 });

    // Open the dropdown and select "12 months"
    const trigger = page
      .locator('[data-slot="select-trigger"]')
      .filter({ hasText: /months|Keep until/i });
    await expect(trigger).toBeVisible({ timeout: 5000 });
    await trigger.click();

    const option12 = page.getByRole("option", { name: "12 months" });
    await expect(option12).toBeVisible({ timeout: 3000 });
    await option12.click();

    // If a confirmation dialog appears (shortening window), confirm it
    const confirmButton = page.getByRole("button", { name: "Confirm" });
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }

    // Wait for success toast
    const toast = page
      .locator('[role="status"]')
      .filter({ hasText: /updated|success/i })
      .first();
    await expect(toast).toBeVisible({ timeout: 10000 });

    // Reload and verify persisted value
    await page.reload();
    await page.waitForLoadState("networkidle");

    const triggerAfterReload = page
      .locator('[data-slot="select-trigger"]')
      .filter({ hasText: /12 months/i });
    await expect(triggerAfterReload).toBeVisible({ timeout: 10000 });
  });

  test("should show confirmation dialog when shortening retention", async ({
    page,
  }) => {
    await loginAndGoToPrivacy(page);

    // First set to "Keep until I delete" (longest)
    const trigger = page
      .locator('[data-slot="select-trigger"]')
      .filter({ hasText: /months|Keep until/i });
    await expect(trigger).toBeVisible({ timeout: 10000 });
    await trigger.click();

    const keepOption = page.getByRole("option", {
      name: "Keep until I delete",
    });
    await expect(keepOption).toBeVisible({ timeout: 3000 });
    await keepOption.click();

    // Wait for save
    await page.waitForTimeout(2000);

    // Now shorten to 6 months → should see confirm dialog
    await trigger.click();
    const option6 = page.getByRole("option", { name: "6 months" });
    await expect(option6).toBeVisible({ timeout: 3000 });
    await option6.click();

    // Confirmation dialog should appear
    const dialogTitle = page.locator("text=Shorten retention period?");
    await expect(dialogTitle).toBeVisible({ timeout: 5000 });

    // Cancel
    const cancelButton = page.getByRole("button", { name: "Cancel" });
    await cancelButton.click();

    // Verify the dropdown still shows the previous value (not 6 months)
    await expect(
      page.locator('[data-slot="select-trigger"]').filter({ hasText: /Keep until/i }),
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Data Retention – Cleanup Endpoint", () => {
  test.skip(!cronSecret, "CRON_SECRET not set – skipping cleanup tests");

  test("cleanup endpoint rejects unauthorized requests", async ({
    request,
  }) => {
    const response = await request.get("/api/cron/retention-cleanup");
    expect(response.status()).toBe(401);
  });

  test("cleanup endpoint returns success with valid secret", async ({
    request,
  }) => {
    const response = await request.get("/api/cron/retention-cleanup", {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.status).toBe("success");
    expect(json.data).toHaveProperty("usersProcessed");
    expect(json.data).toHaveProperty("sessionsDeleted");
  });
});
