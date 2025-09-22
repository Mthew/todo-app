# Todo App Frontend

A modern, feature-rich todo application built with Next.js 15, React 19, and TypeScript. This frontend application provides a comprehensive task management system with authentication, categories, advanced filtering, and a beautiful responsive UI.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **Task Management** - Create, edit, delete, and organize tasks
- 🏷️ **Categories & Tags** - Organize tasks with custom categories and tags
- 🔍 **Advanced Filtering** - Filter by status, category, priority, due date, and search
- 📊 **Priority Levels** - Three priority levels (baja, media, alta)
- 📅 **Due Dates** - Set and track task deadlines
- 🌓 **Dark/Light Theme** - Toggle between themes with system preference support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ♿ **Accessibility** - Built with accessible components via Radix UI

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **pnpm** (recommended) or npm/yarn
- **Backend API** running on `http://localhost:3001` (see backend documentation)

### Installation

1. **Clone the repository** (if not already done):

   ```bash
   git clone <repository-url>
   cd todo-app/src/frontend
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
   ```

4. **Start the development server**:

   ```bash
   pnpm run dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development server with Turbopack
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Run ESLint
pnpm run lint
```

## 🏗️ Architecture Overview

This application follows a **modular, feature-based architecture** designed for scalability and maintainability:

### 🔧 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API + Custom Hooks
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with custom interceptors
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

### 📁 Project Structure

```
src/
├── app/                    # Next.js App Router (pages)
├── components/
│   ├── common/            # Shared components
│   ├── features/          # Feature-specific components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configuration
└── modules/               # Feature modules
    ├── auth/              # Authentication
    ├── category/          # Category management
    └── task/              # Task management
```

### 🧩 Module Architecture

Each feature module follows a consistent pattern:

- **`components/`** - React components
- **`context/`** - State management
- **`hooks/`** - Custom hooks
- **`services/`** - API communication
- **`types/`** - TypeScript definitions

### 🔄 State Management

The application uses a hierarchical context provider pattern:

```tsx
<AuthProvider>
  <CategoryProvider>
    <TaskProvider>
      <ThemeProvider>{/* App Components */}</ThemeProvider>
    </TaskProvider>
  </CategoryProvider>
</AuthProvider>
```

## 📚 Documentation

For detailed architecture information, development guidelines, and API documentation:

👉 **[View Complete Architecture Documentation](./doc/CONTEXT.md)**

## 🌐 API Integration

The frontend communicates with a RESTful API backend. Default configuration:

- **Base URL**: `http://localhost:3001/api`
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Centralized error management with user-friendly messages

### Environment Variables

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

## 🎨 UI Components

Built with **shadcn/ui** components providing:

- **Accessible** components via Radix UI primitives
- **Customizable** design system with CSS variables
- **Responsive** design patterns
- **Dark/Light** theme support
- **Type-safe** component props

## 🔐 Authentication Flow

1. **Registration/Login** - JWT token received from backend
2. **Token Storage** - Securely stored in localStorage
3. **Auto-injection** - Automatic token injection in API requests
4. **Protected Routes** - Route guards for authenticated pages
5. **Auto-refresh** - Automatic token refresh on expiry

## 🚦 Development Workflow

### Getting Started for Development

1. **Start the backend** (see backend README)
2. **Install frontend dependencies**: `pnpm install`
3. **Start development server**: `pnpm run dev`
4. **Open browser**: Visit `http://localhost:3000`

### Code Style & Guidelines

- **TypeScript strict mode** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting (configured via ESLint)
- **Component-first** development approach
- **Feature-based** file organization

## 🛠️ Troubleshooting

### Common Issues

**❌ "API connection failed"**

- Ensure backend server is running on `http://localhost:3001`
- Check `NEXT_PUBLIC_API_URL` environment variable

**❌ "Module not found" errors**

- Run `pnpm install` to install dependencies
- Clear Next.js cache: `rm -rf .next`

**❌ "Authentication errors"**

- Clear localStorage: Developer Tools → Application → Local Storage
- Restart both frontend and backend servers

### Development Tips

- Use **React Developer Tools** for debugging
- Check **Network tab** for API request issues
- Enable **TypeScript strict mode** in your IDE
- Use **Tailwind CSS IntelliSense** extension

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the existing code patterns and architecture
4. **Test** your changes thoroughly
5. **Commit** with clear, descriptive messages
6. **Submit** a Pull Request

## 📄 License

This project is part of a technical challenge for Fracttal.

---

## 🔗 Related Documentation

- 📖 **[Architecture & Context Documentation](./doc/CONTEXT.md)** - Detailed technical documentation
- 🔧 **Backend API Documentation** - See `../backend/doc/` folder
- 🎯 **Project Requirements** - See `../../doc/fullstack_todo_challenge.md`

---

**Built with ❤️ using Next.js, React, and TypeScript**
