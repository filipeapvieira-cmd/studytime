# Authorization Documentation

> **OWASP ASVS Compliance**: V8.1.1 - This document defines rules for restricting function-level and data-specific access based on consumer permissions and resource attributes.

## Table of Contents

1. [Overview](#overview)
2. [User Roles and Permissions](#user-roles-and-permissions)
3. [Authentication Architecture](#authentication-architecture)
4. [Route-Level Authorization](#route-level-authorization)
5. [Function-Level Access Control](#function-level-access-control)
6. [Data-Level Access Control](#data-level-access-control)
7. [Authorization Matrix](#authorization-matrix)

---

## Overview

StudyTime implements a multi-layer authorization model consisting of:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Authentication** | NextAuth.js (v5 Beta) | Identity verification via credentials or OAuth (Google) |
| **Session Management** | JWT tokens | Stateless session handling with role claims |
| **Route Protection** | Next.js Middleware | Function-level access control at route level |
| **Data Access Control** | Prisma ORM | User-scoped database queries |

---

## User Roles and Permissions

### Role Definitions

Defined in [`prisma/schema.prisma`](file:///c:/Repos/studytime/prisma/schema.prisma#L11-14):

```prisma
enum UserRole {
  USER    // Default role - standard application access
  ADMIN   // Administrative privileges
}
```

### Role Hierarchy

```
ADMIN
  └── USER
        └── Anonymous/Unauthenticated
```

### Permission Summary

| Capability | Anonymous | USER | ADMIN |
|------------|:---------:|:----:|:-----:|
| View public pages | Yes | Yes | Yes |
| Authentication pages | Yes | No | No |
| Create study sessions | No | Yes | Yes |
| View own sessions | No | Yes | Yes |
| Modify own sessions | No | Yes | Yes |
| Delete own sessions | No | Yes | Yes |
| Access admin panel | No | No | Yes |
| Manage image config | No | Yes | Yes |

---

## Authentication Architecture

### Authentication Flow

Implemented in [`src/auth.ts`](file:///c:/Repos/studytime/src/auth.ts), [`src/auth.config.ts`](file:///c:/Repos/studytime/src/auth.config.ts), and enforced via [`src/middleware.ts`](file:///c:/Repos/studytime/src/middleware.ts).

**Sequence:**

1. **User** makes a request (page, API, or server component).
2. **Middleware** runs for all matched routes (see `middleware.ts` matcher).
    *   It does **not** run for Next.js internals/static assets.
    *   It does run for most `/api/*` routes.
    *   It skips `/api/auth/*` explicitly (`apiAuthPrefix`).
3. **Token/session validation** happens inside NextAuth:
    *   The middleware is wrapped by `NextAuth(authConfig)`, which populates `req.auth`.
    *   If the JWT/session is invalid or missing, `req.auth` is undefined.
    *   `currentRole()` also calls `auth()` again to read the session/role.
4. **Middleware rules** are applied:
    *   **API auth routes** (`/api/auth/*`) → allow (no middleware gating).
    *   **Auth routes** (`/auth/login`, `/auth/register`, etc.)
        *   Logged in → redirect to `/journaling`
        *   Not logged in → allow
    *   **Protected routes** (anything not public/auth)
        *   Not logged in → redirect to `/auth/login`
    *   **Role-gated routes** (currently `/admin`)
        *   If role is missing or not allowed -> redirect to `/auth/not-authorized`
5. **If not redirected**, the request reaches the route handler / server component.

### Authentication Providers

| Provider | Implementation | Email Verification |
|----------|---------------|-------------------|
| **Credentials** | Email/password with `bcryptjs` | Required |
| **Google OAuth** | OAuth 2.0 | Auto-verified on link |

---

## Route-Level Authorization

### Route Configuration

Defined in [`src/routes.ts`](file:///c:/Repos/studytime/src/routes.ts):

#### Public Routes
Routes accessible without authentication:
```typescript
export const publicRoutes = [
  "/",                        // Landing page
  "/auth/new-verification",   // Email verification callback
];
```

#### Authentication Routes
Routes for unauthenticated users only (redirect logged-in users):
```typescript
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];
```

#### Role-Protected Routes
Routes requiring specific roles:
```typescript
export const authorizationRoutes = [
  {
    path: "/admin",
    roles: ["ADMIN"],
  },
];
```

### Middleware Implementation

Implemented in [`src/middleware.ts`](file:///c:/Repos/studytime/src/middleware.ts):

**Request Flow:**

1. **API Auth Route?** → Yes: Allow (Auth.js handles)
2. **Auth Route?**
   - User logged in → Redirect to `/journaling`
   - User not logged in → Allow access
3. **User logged in?**
   - No → Is Public Route?
     - Yes → Allow access
     - No → Redirect to `/auth/login`
   - Yes → Is Role-Protected? (Checked via `authorizationRoutes`)
     - Yes → Has required role?
       - Yes → Allow access
       - No → Redirect to `/auth/not-authorized`
     - No → Allow access

---

## Function-Level Access Control

### API Route Authorization

| Endpoint | Method | Middleware Auth | Role Required (Code) | Ownership Check | Notes |
|----------|--------|:---------------:|:--------------------:|:---------------:|-------|
| `/api/auth/*` | ALL | Yes | - | - | Handled by NextAuth framework |
| `/api/session/save` | POST | Yes | Authenticated | N/A | Creates new session binded to userId |
| `/api/session/get/sessions` | GET | Yes | Authenticated | Yes | User scoped query |
| `/api/session/get/[sessionId]` | GET | Yes | Authenticated | Yes | Verified in handler via `currentUser()` |
| `/api/session/delete/[sessionId]` | DELETE | Yes | Authenticated | Yes | Verified in handler via `currentUser()` |
| `/api/session/update/[sessionId]` | PUT | Yes | Authenticated | Yes | Verified in handler via `currentUser()` |
| `/api/session/get/unique-topics` | GET | Yes | Authenticated | Yes | Uses `getUniqueTopicTitles(userId)` |
| `/api/session/get/unique-hashtags` | GET | Yes | Authenticated | Yes | Uses `getUniqueHashtags(userId)` |
| `/api/session/get/communityVsUser` | GET | Yes | Authenticated | Aggregation | Aggregated community totals, no per-user data leak. |
| `/api/user/img-config` | GET | Yes | Authenticated | Yes | Scoped by userId |
| `/api/editor/uploadImage` | POST | Yes | Authenticated | Yes | Uses `getUserImageConfigurationById(userId)` |

### Server Actions Authorization

| Action | Location | Auth Check | Notes |
|--------|----------|:----------:|-------|
| `imageUploadSettings` | `image-upload.ts` | Yes | Proper user validation |
| `updateTopicsAndHashtags` | `update-topics-and-hashtags.ts` | Yes | Authenticated & scoped to user sessions |
| `login` | `login.ts` | N/A | Public action |
| `register` | `register.ts` | N/A | Public action |
| `reset` | `reset.ts` | N/A | Public action |
| `newVerification` | `new-verification.ts` | N/A | Token-based verification (Public) |
| `newPasswordRequest` | `new-password.ts` | N/A | Token-based reset (Public) |

---

## Data-Level Access Control

### Database Schema Relationships

| Entity | Key Fields | Relationship | Related Entity |
|--------|------------|--------------|----------------|
| **User** | `id` (PK), `email` (UK), `role` | owns many | StudySession |
| **User** | `id` (PK) | configures one | CloudinaryConfig |
| **StudySession** | `id` (PK), `userId` (FK) | contains many | Topic |
| **StudySession** | `id` (PK), `userId` (FK) | has one | Feeling |
| **Topic** | `id` (PK), `sessionId` (FK) | belongs to | StudySession |
| **Feeling** | `id` (PK), `sessionId` (FK) | belongs to | StudySession |
| **CloudinaryConfig** | `id` (PK), `userId` (FK, UK) | belongs to | User |

### Resource Ownership Rules

| Resource | Owner Field | Cascade Delete | Access Pattern |
|----------|-------------|:--------------:|----------------|
| `StudySession` | `userId` | Yes | Filter by `userId` |
| `Topic` | via `StudySession.userId` | Yes | Join through session |
| `Feeling` | via `StudySession.userId` | Yes | Join through session |
| `CloudinaryConfig` | `userId` | Yes | Filter by `userId` |

---

## Authorization Matrix

| Resource | Action | Anonymous | USER (Own) | USER (Other) | ADMIN |
|----------|--------|:---------:|:----------:|:------------:|:-----:|
| **Public Pages** | View | Yes | Yes | Yes | Yes |
| **Auth Pages** | View | Yes | Redirect | Redirect | Redirect |
| **Admin Pages** | View | Redirect | No (403) | No (403) | Yes |
| **Study Session** | Create | No (401) | Yes | N/A | Yes (own only) |
| **Study Session** | Read | No (401) | Yes | No (403) | Yes (own only) |
| **Study Session** | Update | No (401) | Yes | No (403) | Yes (own only) |
| **Study Session** | Delete | No (401) | Yes | No (403) | Yes (own only) |
| **Topic** | Create | No (401) | Yes | No (403) | Yes (own only) |
| **Topic** | Read | No (401) | Yes | No (403) | Yes (own only) |
| **Topic** | Update | No (401) | Yes | No (403) | Yes (own only) |
| **Cloudinary Config** | Manage | No (401) | Yes | No (403) | Yes (own only) |
| **Image Upload** | Create | No (401) | Yes | N/A | Yes (own only) |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.3 | 2026-02-01 | Filipe Vieira | Align docs with current middleware role-gate behavior; clarify ADMIN data access as "own only". |
| 1.2 | 2026-02-01 | Filipe Vieira | Security Hardening: Remediated "MISSING" auth and ownership checks in API routes and server actions. |
| 1.1 | 2026-01-31 | Filipe Vieira | Corrections based on code review (Middleware logic, library versions, missing server actions, corrected ownership checks). |
| 1.0 | 2026-01-31 | Filipe Vieira | Initial authorization documentation. |
