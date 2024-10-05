/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to /journaling
 */
export const authRoutes = ["/login", "/register"];

/**
 * The prefix for API routes that are used for authentication.
 * Auth needs these routers to operate correctly.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/journaling";
