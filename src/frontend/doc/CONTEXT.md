# Project Context: Frontend Architecture

This document provides a high-level overview of the frontend's architectural design, core principles, technology stack, and key patterns. It is intended to be the single source of truth for understanding _why_ the application is built this way, serving as a guide for current and future development.

## 1. Core Architectural Philosophy

Our frontend architecture is driven by a set of principles designed to create a scalable, maintainable, and highly performant user interface.

1.  **Strict State Separation:** We make a clear distinction between **Server State** (data fetched from the API) and **UI/Client State** (local component state, global state like auth). These are managed with different, specialized tools. This is the most important principle of our architecture.

2.  **Hook-Based Logic:** All business logic, data fetching, and state management is encapsulated within React Hooks. Components remain as "dumb" as possible, responsible only for presentation. This makes our logic reusable and our components easier to test and reason about.

3.  **Composable, Owned Components:** We use **Shadcn/UI** as a component generator, not a library. We copy its code directly into our project, giving us full ownership and the ability to customize components limitlessly with Tailwind CSS.

4.  **Mobile-First Responsive Design:** All styles are written for mobile devices by default. We then use **Tailwind CSS's** responsive prefixes (`sm:`, `md:`, `lg:`) to progressively enhance the layout for larger screens.

## 2. Technology Stack & Rationale

| Technology                | Purpose                     | Rationale                                                                                                                                                                                                                                                                  |
| :------------------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vite**                  | Build Tool                  | Provides an extremely fast development server (instant HMR) and optimized production builds, significantly improving the developer experience.                                                                                                                             |
| **React Query**           | **Server State Management** | **The cornerstone of our state strategy.** It handles the entire lifecycle of server data: caching, background refetching, loading/error states, and optimistic updates. This eliminates the need for complex `useEffect` chains and manual state management for API data. |
| **React Hook Form & Zod** | Forms & Validation          | This combination offers high-performance forms (by minimizing re-renders) with robust, type-safe validation that can be shared between the frontend and backend.                                                                                                           |
| **Tailwind CSS**          | Styling                     | A utility-first CSS framework that allows us to build complex, responsive designs directly in our JSX without writing custom CSS files. It enforces consistency and speeds up development.                                                                                 |
| **Shadcn/UI**             | Component Toolkit           | Provides beautifully designed, accessible, and unstyled component primitives (built on Radix UI) that we can style with Tailwind. We own the code, ensuring maximum flexibility.                                                                                           |
| **Context API**           | Global UI State             | Used exclusively for managing simple, truly global state that changes infrequently, such as user authentication status.                                                                                                                                                    |
| **React Router**          | Routing                     | The industry standard for client-side routing in React, enabling us to create a seamless single-page application experience with protected routes.                                                                                                                         |
| **Axios**                 | HTTP Client                 | A reliable and easy-to-use client for making API requests. An Axios instance is pre-configured to handle the base URL and can be extended with interceptors to attach auth tokens.                                                                                         |

## 3. Directory Structure Deep Dive

The `src/` directory is organized to promote scalability and modularity.

- `api/`: Contains the pre-configured Axios client instance.
- `components/`:
  - `ui/`: **Houses all components generated by Shadcn/UI.** This is our base component library.
  - `common/`: Generic, reusable components built by composing Shadcn primitives (e.g., `Spinner`, `PageHeader`).
  - `layout/`: Components that define the main structure of the application (e.g., `Header`, `Sidebar`).
- `context/`: Holds React Context providers, primarily `AuthContext`.
- `features/`: **The core of our application's business logic.** Each feature (e.g., `tasks`, `auth`) is a self-contained module that includes its own "smart" components, hooks, and types. This prevents top-level folders like `hooks/` and `components/` from becoming bloated and promotes colocation of related logic.
- `hooks/`: For generic, reusable hooks that are not tied to a specific feature (e.g., `useDebounce`, `useLocalStorage`).
- `lib/`: Home for third-party library initializations (`react-query.ts`) and shared utilities (`utils.ts` for the `cn` function).
- `pages/`: Components that represent an entire page or view, corresponding to a route. These components are responsible for composing layouts and feature components.
- `routes/`: Defines the application's routing structure, including private/public routes.
- `schemas/`: Contains all Zod validation schemas for forms.

## 4. Core Concepts Explained

### a. The Two-State Model: Our State Management Strategy

We avoid monolithic state management libraries like Redux by treating state based on its origin.

1.  **Server State (Managed by React Query):**

    - **What it is:** Any data that lives on the backend (tasks, categories, user profile).
    - **How it's handled:** Managed entirely by React Query hooks (`useQuery`, `useMutation`). Our components simply subscribe to these hooks and receive the data along with status booleans (`isLoading`, `isError`). We never store this data in `useState`.
    - **Key Benefit:** React Query handles caching, invalidation, and background updates automatically, ensuring the UI is always in sync with the backend with minimal effort.

2.  **Global UI State (Managed by Context API):**
    - **What it is:** State that is needed across the entire app but doesn't come from the server (e.g., the current authenticated user object, auth token).
    - **How it's handled:** A simple `AuthContext` provides this data to any component that needs it.

### b. Data Flow Example: Creating a New Task

This flow demonstrates how all layers interact:

1.  **UI (Component):** The user clicks the "New Task" button in a component from `features/tasks/components/`. This opens a `Dialog` containing the `TaskForm`.
2.  **Form (React Hook Form & Zod):** The `TaskForm` uses `useForm` with a Zod resolver. The user fills out the form, and Zod provides real-time validation.
3.  **Submission (Hook):** On submit, the form calls the `useCreateTask` mutation hook (from `features/tasks/hooks/`).
4.  **Mutation (React Query):** The `useCreateTask` hook:
    - Shows a loading state (`isLoading` becomes `true`).
    - Calls the API service, which uses our Axios client to send a `POST` request to `/api/tasks`.
    - On success (`onSuccess` callback), it calls `queryClient.invalidateQueries(['tasks'])`.
5.  **UI Update (React Query):** React Query detects that the `['tasks']` query is now stale. It automatically re-fetches the list of tasks in the background. The component using the `useTasks` hook receives the updated data and re-renders, showing the new task—all without any manual state updates.

## 5. Developer's Guide: How to Add a New Feature

When adding a new feature (e.g., "Comments"), follow this inside-out pattern:

1.  **Schema:** Define the Zod validation schema for the new entity's form in `src/schemas/`.
2.  **API Service:** Add the API call functions (e.g., `createComment`, `getComments`) to a new service file.
3.  **Hooks (React Query):** Create the necessary query and mutation hooks in a new feature directory (`src/features/comments/hooks/`).
4.  **Components:**
    - Generate any new UI primitives needed with Shadcn/UI (e.g., `npx shadcn-ui@latest add avatar`).
    - Build the feature components (e.g., `CommentForm`, `CommentList`) in `src/features/comments/components/`. These components will use the hooks created in the previous step.
5.  **Page:** Compose the new feature components on a page within `src/pages/`.
6.  **Route:** Add the new page to a route in `src/routes/AppRouter.tsx`.
