---
inclusion: always
---
# Artiklo - AI Coding Rules

This document contains the rules and guidelines for the AI to follow when generating or editing code for the Artiklo project.

## 1. Project Overview

- **Core Mission:** Artiklo is a web application that simplifies complex legal and bureaucratic Turkish documents into plain, easy-to-understand language for the average citizen.
- **Target Audience:** Non-lawyer Turkish citizens who need to understand official documents.
- **Key Functionality:** User authentication, a dashboard to submit text, and an AI-powered simplification engine.

## 2. Core Technologies

The project is built on a modern tech stack. All generated code must be compatible with these technologies:

- **Framework:** React 18+
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Supabase
- **Icons:** lucide-react

## 3. Coding Style and Conventions

- **Language:** All code must be written in TypeScript with strict typing. Use interfaces (`interface`) or types (`type`) for defining object shapes.
- **Components:** Always use **functional components** with React Hooks (`useState`, `useEffect`, etc.). **Do not use class components.**
- **Naming:**
  - Components: `PascalCase` (e.g., `DocumentSimplifier.tsx`)
  - Functions, variables, and hooks: `camelCase` (e.g., `handleSimplify`, `isLoading`)
- **Styling:**
  - Use **Tailwind CSS utility classes** directly in the JSX for all styling.
  - Avoid writing separate `.css` files unless a complex, reusable, non-utility style is absolutely necessary.
  - Components should be responsive and mobile-first.
- **File Structure:**
  - All reusable components should be placed in a `src/components/` directory.
  - Pages or main views should be in a `src/pages/` directory if applicable.
- **Readability:** Prioritize clean, readable, and self-documenting code. Add comments only for complex business logic that isn't immediately obvious from the code itself.

## 4. Supabase Integration Rules

Supabase is our all-in-one backend. Follow these rules strictly.

- **Client:** The Supabase client should be initialized **once** in a central file (e.g., `src/lib/supabaseClient.ts`) and imported where needed. Do not re-initialize the client in multiple components.
- **Authentication:** All user management (Sign Up, Log In, Log Out, session management) must be handled using the `supabase.auth` methods.
- **Database:**
  - All database operations (CRUD) must use the Supabase JS library: `supabase.from('table_name').select()`, `.insert()`, `.update()`, etc.
  - Always handle asynchronous database calls correctly using `async/await`.
  - Always include error handling (e.g., `try...catch` blocks) for database operations.
- **Security:** Never expose secret keys or the service role key on the client-side. All client-side code must use the public `anon` key. Sensitive operations should be handled via Supabase Edge Functions.

## 5. Component-Specific Guidelines

- **Icons:** Use icons from the `lucide-react` library. Import them like: `import { IconName } from 'lucide-react';`
- **Forms:** Use React state (`useState`) to manage form inputs. Perform basic client-side validation (e.g., checking for empty fields, valid email format) before submitting.
- **State Management:** For simple, component-level state, use `useState`. For more complex global state (like user session), use React Context or a dedicated state management library if the project grows.

## 6. General Instructions for the AI

- **Error Handling:** Always generate code that is robust. Anticipate potential errors (e.g., network failures, empty data) and handle them gracefully.
- **No `any`:** Avoid using the `any` type in TypeScript. Define specific types or interfaces for all data.
- **Dependencies:** Do not add new dependencies unless explicitly asked. Rely on the existing packages in `package.json`.