# 📚 StudyTime Logger

An intuitive application designed for students to efficiently log, retrieve, and analyze their study sessions.

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

-   **Node.js**: Version 22.x or higher (required).
-   **Package Manager**: `npm` (recommended).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/studytime-logger.git
    cd studytime-logger
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory. You will need the following variables:
    *   `DOMAIN`: The domain of your application.
    *   `POSTGRES_PRISMA_URL`: Connection string for your PostgreSQL database.
    *   `AUTH_SECRET`: Secret key for authentication (NextAuth).
    *   `RESEND_API_KEY`: API key for email services (Resend).
    *   `ENCRYPTION_KEY`: Key used for encryption tasks.
    *   `TEST_EMAIL` & `TEST_PASSWORD`: Credentials for running tests.

4.  **Database Setup**:
    Generate the Prisma client:
    ```bash
    npx prisma generate
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run db:studio` | Opens Prisma Studio to view and edit database data. |
| `npm run lint` | Runs Next.js linting. |
| `npm run format` | Formats code using Biome. |
| `npm run fix` | Fixes linting and formatting issues using Biome. |
| `npm run test` | Runs all Playwright tests (headless). |
| `npm run test:ui` | Opens the Playwright interactive UI. |
| `npm run prepare` | Performs lint, test, and build in sequence. |

## 🧪 Testing

We use Playwright for end-to-end and security testing.

### Running Tests
- **All tests**: `npm run test`
- **Specific test file**: `npx playwright test tests/auth.spec.ts`

### Execution Modes
- **Default (Headless)**: `npm run test` (Background execution)
- **Headed mode**: `npx playwright test --headed` (Visible browser window)
- **UI mode**: `npm run test:ui` (Interactive test runner)

### Example: Authorization Security Tests
- **Default**: `npx playwright test tests/authorization.spec.ts`
- **Headed mode**: `npx playwright test tests/authorization.spec.ts --headed`
- **UI mode**: `npx playwright test tests/authorization.spec.ts --ui`

## 🛡️ Security Compliance (OWASP ASVS)

This application is designed to meet key security requirements from the **OWASP ASVS (Application Security Verification Standard)**:

- **ASVS 8.2.1**: Verified that function‑level access is restricted to consumers with explicit permissions. All sensitive API routes and server actions enforce `currentUser()` validation.
- **ASVS 8.2.2**: Verified that data‑specific access is restricted via ownership checks. Endpoints are protected against **BOLA (Broken Object Level Authorization)** and **IDOR** by verifying that the requesting user owns the specific resource being accessed.

## 🎯 Objective

StudyTime Logger simplifies the student's journey by offering:

-   **Logging Sessions**: Easily record each study session with relevant details.
-   **Retrieval**: Swiftly access past entries without any hassle.
-   **Analytics**: Get a statistical breakdown of your study hours, helping you understand your study patterns better.

## 🛠️ Tech Stack

-   **Frontend**: React (19), TypeScript, Tailwind CSS
-   **Backend**: Next.js (16)
-   **Database**: PostgreSQL, Prisma ORM
-   **UI Components**: shadcn/ui, Radix UI
-   **Auth**: NextAuth.js
-   **Tools**: Biome (Linting/Formatting), Playwright (E2E Testing)

## 🌟 Inspired By

-   [taxonomy](https://github.com/shadcn/taxonomy)
-   [nextjs-postgres-auth-starter](https://github.com/vercel/nextjs-postgres-auth-starter)
