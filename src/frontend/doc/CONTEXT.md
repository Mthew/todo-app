# Frontend Context Documentation

## Overview

This is a modern **Next.js 15** todo application built with **React 19** and **TypeScript**. The application follows a modular architecture pattern with feature-based organization, implementing a comprehensive task management system with authentication, categories, and advanced filtering capabilities.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Runtime**: React 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: React Context API + Custom Hooks
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with custom HttpManager
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono
- **Theme**: next-themes with dark/light mode support

### Architectural Patterns

1. **Modular Feature-Based Architecture**: Each feature (auth, category, task) is self-contained with its own components, hooks, services, types, and context.

2. **Provider Pattern**: Hierarchical context providers for state management across features.

3. **Custom Hooks Pattern**: Encapsulated business logic in reusable hooks.

4. **Compound Component Pattern**: Complex UI components broken into smaller, composable pieces.

5. **Repository Pattern**: Service layer abstracts API communication from components.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Login page (/)
│   ├── board/             # Main application (/board)
│   └── signup/            # User registration (/signup)
├── components/
│   ├── common/            # Shared application components
│   │   ├── main-navbar.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── features/          # Feature-specific UI components
│   │   └── board/
│   └── ui/                # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── lib/                   # Shared utilities and configuration
│   ├── httpManager.ts     # Axios instance with interceptors
│   ├── types.ts           # Global type definitions
│   └── utils.ts           # Utility functions (cn helper)
└── modules/               # Feature modules
    ├── auth/              # Authentication module
    ├── category/          # Category management module
    └── task/              # Task management module
```

### Module Structure Pattern

Each module follows a consistent structure:

```
module/
├── components/            # React components
├── context/              # Context providers and state
├── hooks/                # Custom hooks
├── services/             # API services
├── types/                # TypeScript definitions
└── index.ts              # Public API exports
```

## 🔧 Core Features

### Authentication System

- **JWT-based authentication** with automatic token management
- **Protected routes** with `ProtectedRoute` component
- **User registration and login** with form validation
- **Persistent session** with localStorage
- **Automatic token refresh** via HTTP interceptors

### Task Management

- **CRUD operations** for tasks with real-time updates
- **Priority levels**: baja, media, alta
- **Due date management** with date picker
- **Task completion** toggle functionality
- **Rich filtering system**:
  - By completion status
  - By category
  - By priority level
  - By due date range
  - Text search in title/description
  - Tag-based filtering
- **Advanced sorting** by creation date, due date, priority, title

### Category System

- **Dynamic category creation** and management
- **Category-based task organization**
- **Visual category columns** in board view
- **Category deletion** with task reassignment options

### UI/UX Features

- **Dark/Light theme** toggle with system preference detection
- **Responsive design** for mobile and desktop
- **Loading states** and error boundaries
- **Form validation** with Zod schemas
- **Optimistic updates** for better UX
- **Accessible components** via Radix UI

## 🔌 State Management

### Context Providers Hierarchy

```tsx
<AuthProvider>
  <CategoryProvider>
    <TaskProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TaskProvider>
  </CategoryProvider>
</AuthProvider>
```

### Custom Hooks

- **useAuth**: Authentication state and actions
- **useCategory**: Category CRUD operations
- **useTask**: Task management and filtering
- **useAuthState**: Granular auth state selectors
- **useUser**: User information access

## 🌐 HTTP Management

### HttpManager Class (Singleton)

- **Centralized Axios configuration** with base URL and timeout
- **Request/Response interceptors** for authentication
- **Automatic token injection** in headers
- **Error handling** with consistent API error format
- **Request/Response logging** for debugging

```typescript
// Environment-based API URL configuration
NEXT_PUBLIC_API_URL = "http://localhost:3001/api";
```

## 🎨 Styling System

### Tailwind CSS + shadcn/ui

- **Utility-first CSS** with Tailwind CSS 4
- **Design system** via shadcn/ui components
- **CSS variables** for theming
- **Component variants** with class-variance-authority
- **Responsive design** utilities

### Theme Configuration

```json
{
  "style": "new-york",
  "baseColor": "neutral",
  "cssVariables": true,
  "iconLibrary": "lucide"
}
```

## 🔐 Security Considerations

- **XSS Prevention**: Proper input sanitization and validation
- **CSRF Protection**: JWT tokens instead of cookies
- **Input Validation**: Zod schemas for form validation
- **Protected Routes**: Authentication guards
- **Token Management**: Secure localStorage usage

## 📝 Development Guidelines

### Code Organization

1. **Feature-first structure**: Group related files by feature
2. **Barrel exports**: Use index.ts files for clean imports
3. **TypeScript strict mode**: Full type safety
4. **Component composition**: Prefer composition over inheritance

### Naming Conventions

- **Components**: PascalCase (e.g., `TaskDialog.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useTask`)
- **Types**: PascalCase interfaces (e.g., `TaskFormData`)
- **Files**: kebab-case for utilities, PascalCase for components

### State Management Patterns

1. **Local state**: useState for component-specific state
2. **Shared state**: Context API for feature-specific state
3. **Server state**: Custom hooks with caching strategies
4. **Form state**: React Hook Form for complex forms

### Error Handling

- **Error boundaries** for component-level error catching
- **Try-catch blocks** in async operations
- **User-friendly error messages** with fallback UI
- **Loading states** for async operations

## 🚀 Performance Optimizations

- **Next.js App Router**: Automatic code splitting
- **React 19 features**: Concurrent rendering
- **Dynamic imports**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Optimistic updates**: Immediate UI feedback

## 🧪 Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Component logic and utilities
2. **Integration Tests**: Feature workflows
3. **E2E Tests**: Critical user journeys
4. **Type Testing**: TypeScript for compile-time safety

### Testing Tools (To be implemented)

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking

## 📦 Dependencies Overview

### Core Dependencies

- `next`: React framework
- `react` & `react-dom`: UI library
- `typescript`: Type safety
- `tailwindcss`: Styling
- `axios`: HTTP client
- `react-hook-form`: Form management
- `zod`: Schema validation

### UI Dependencies

- `@radix-ui/*`: Accessible component primitives
- `lucide-react`: Icon library
- `next-themes`: Theme management
- `class-variance-authority`: Component variants

## 🔧 Configuration Files

- **`next.config.ts`**: Next.js configuration
- **`tsconfig.json`**: TypeScript compiler options
- **`components.json`**: shadcn/ui configuration
- **`postcss.config.mjs`**: PostCSS plugins
- **`eslint.config.mjs`**: ESLint rules

## 🌍 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

## 🔮 Future Enhancements

### Planned Features

- **Real-time updates** with WebSockets
- **Drag & drop** task reordering
- **Bulk operations** for multiple tasks
- **Dashboard analytics** with charts
- **Export functionality** (CSV, JSON)
- **Keyboard shortcuts** for power users
- **Progressive Web App** features

### Technical Improvements

- **Unit test coverage** implementation
- **Performance monitoring** integration
- **Bundle size optimization**
- **Accessibility audit** and improvements
- **Internationalization** (i18n) support

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

---

This documentation serves as a comprehensive guide for developers and AI agents working on this frontend application. The modular architecture and consistent patterns make it easy to extend functionality and maintain code quality.
