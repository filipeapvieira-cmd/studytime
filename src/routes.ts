/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 */
export const publicRoutes = [
  "/",
  // This route is here because it can be accessed by both logged in and logged out users
  "/auth/new-verification",
  "/privacy",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect LOGGED IN users to /journaling
 * Hence, they are not accessible to logged in users. (only available to logged out users)
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * An array of protected routes with the roles required to access them.
 */
export const authorizationRoutes = [
  {
    path: "/admin",
    roles: ["ADMIN"],
  },
];

/**
 * The prefix for API routes that are used for authentication.
 * Auth needs these routers to operate correctly.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/journaling";
