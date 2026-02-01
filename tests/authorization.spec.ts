import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PASSWORD;

if (!email || !password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables must be set');
}

// User A (The Attacker) - using the standard test credentials
const ATTACKER_USER = {
    email,
    password,
};

let victimUser: any;
let victimSession: any;

/**
 * Authorization Security Tests
 * 
 * Verifies that authenticated users cannot access or modify resources 
 * belonging to other users (Broken Object Level Authorization).
 */
test.describe('Authorization Security Tests (BOLA)', () => {

    test.beforeAll(async () => {
        // Create a Victim User directly in the DB
        try {
            victimUser = await prisma.user.create({
                data: {
                    name: 'Victim User',
                    email: `victim-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`,
                    password: 'password123', // Not needed for login, just presence
                    role: 'USER',
                    emailVerified: new Date(),
                }
            });
            console.log(`Created victim user: ${victimUser.id}`);

            // Create a session for the victim
            victimSession = await prisma.studySession.create({
                data: {
                    startTime: new Date(),
                    endTime: new Date(Date.now() + 3600000), // +1 hour
                    userId: victimUser.id,
                    pauseDuration: 0,
                    topic: {
                        create: {
                            title: 'Victim Topic',
                            timeOfStudy: 0,
                        }
                    }
                }
            });
            console.log(`Created victim session: ${victimSession.id}`);
        } catch (error) {
            console.error('Error in setup:', error);
            throw error;
        }
    });

    test.afterAll(async () => {
        // Cleanup victim data
        if (victimUser) {
            await prisma.user.delete({ where: { id: victimUser.id } }).catch(e => console.error("Cleanup error:", e));
        }
        await prisma.$disconnect();
    });

    /**
     * Verifies that the DELETE endpoint rejects cross-user session deletion.
     */
    test('DELETE endpoint should reject deletion of another users session', async ({ page }) => {
        // Step 1: Login as ATTACKER
        await page.goto('/auth/login');

        await page.getByLabel('Email').fill(ATTACKER_USER.email);
        await page.getByLabel('Password').fill(ATTACKER_USER.password);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });

        // Step 2: Attempt to delete the VICTIM'S session
        // We use the browser context request (which has the Attacker's cookies)
        const deleteResponse = await page.request.delete(`/api/session/delete/${victimSession.id}`);

        // Step 3: Verify security
        // EXPECTED: 403 Forbidden (or 404 if secured by filtering)
        // VULNERABLE BEHAVIOR: 200 OK

        // Note: We check for 403 or 401 or 404 (any rejection is good)
        // EXPECTED: 403 Forbidden (Secure)
        expect([401, 403, 404]).toContain(deleteResponse.status());
    });

    /**
     * Verifies that the UPDATE endpoint rejects cross-user session updates.
     */
    test('UPDATE endpoint should reject updates to another users session', async ({ page }) => {
        // Step 1: Login as ATTACKER
        await page.goto('/auth/login');

        await page.getByLabel('Email').fill(ATTACKER_USER.email);
        await page.getByLabel('Password').fill(ATTACKER_USER.password);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/.*journaling/, { timeout: 15000 });

        // Step 2: Attempt to update the VICTIM'S session
        const updateResponse = await page.request.put(`/api/session/update/${victimSession.id}`, {
            data: {
                topics: [],
                hashtags: [],
            }
        });

        // EXPECTED: 403/401/404
        // EXPECTED: 403 Forbidden (Secure)
        expect([401, 403, 404]).toContain(updateResponse.status());
    });

});
