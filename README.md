# Todo App - Full-Stack Application

A comprehensive task management application built as a **monorepo** with modern technologies. This project demonstrates a complete full-stack solution with clean architecture, advanced filtering capabilities, and production-ready features.

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue?style=flat-square&logo=postgresql)

## 🚀 Project Overview

This full-stack todo application was built to demonstrate modern web development practices, including:

- **Clean Architecture** with separation of concerns
- **JWT Authentication** with secure token management
- **Advanced Task Management** with categories, tags, and filtering
- **Real-time Updates** and optimistic UI updates
- **Responsive Design** for desktop and mobile
- **Production-ready** with comprehensive logging and rate limiting

![Todo App Frontend](./doc/frontend.png)

## 🏗️ Architecture

### Monorepo Structure

```
todo-app/
├── src/
│   ├── backend/          # Node.js + Express + TypeScript API
│   └── frontend/         # Next.js + React + TypeScript UI
├── doc/                  # Project documentation
├── collection/           # SQL queries and data analysis
├── package.json          # Monorepo configuration
└── pnpm-workspace.yaml   # PNPM workspace setup
```

### 🔧 Backend Architecture

**Clean Architecture** implementation with four distinct layers:

- **Domain Layer**: Core business entities (User, Task, Category, Tag)
- **Application Layer**: Use cases and business logic orchestration
- **Infrastructure Layer**: Database, security, and external services
- **API Layer**: HTTP controllers, routes, and middleware

**Tech Stack:**

- Node.js + Express.js + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication + Bcrypt
- Swagger/OpenAPI documentation
- Multi-tier rate limiting

📚 **[Backend Architecture Details](./src/backend/doc/CONTEXT.md)**

### 🎨 Frontend Architecture

**Modular, feature-based architecture** with React 19 and Next.js 15:

- **Feature Modules**: Self-contained auth, category, and task modules
- **Component Architecture**: Reusable UI components with shadcn/ui
- **State Management**: React Context API + Custom Hooks
- **Type Safety**: Full TypeScript with Zod validation

**Tech Stack:**

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation
- Axios with custom interceptors

📚 **[Frontend Architecture Details](./src/frontend/doc/CONTEXT.md)**

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 12.0
- **pnpm** (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install all dependencies**

   ```bash
   pnpm install
   ```

3. **Setup PostgreSQL database**

   ```sql
   CREATE DATABASE todo_app;
   CREATE USER todo_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
   ```

4. **Configure environment variables**

   **Backend** (`src/backend/.env`):

   Copy the example environment file and customize it:

   ```bash
   cp src/backend/example.env.txt src/backend/.env
   ```

   Or create manually with these variables:

   ```env
   DATABASE_URL="postgresql://todo_user:your_password@localhost:5432/todo_app"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"

   # Logging Configuration
   LOGGING_ENABLED=true
   LOG_LEVEL=standard
   LOG_INCLUDE_BODY=false
   LOG_INCLUDE_HEADERS=false
   LOG_INCLUDE_USER_INFO=true
   LOG_COLOR_OUTPUT=true

   # Performance Thresholds
   SLOW_REQUEST_THRESHOLD=5000
   WARNING_REQUEST_THRESHOLD=1000

   # Exclusions
   LOG_EXCLUDE_PATHS=/health,/metrics
   ```

   📋 **Environment Template**: A complete example is available at [`src/backend/example.env.txt`](./src/backend/example.env.txt)

   **Frontend** (`src/frontend/.env.local`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

5. **Setup the database**

   ```bash
   # Run database migrations
   pnpm run dev:backend
   # Stop and run migrations
   cd src/backend
   pnpm run db:migrate
   cd ../..
   ```

6. **Seed the database with sample data (Optional)**

   To populate your database with realistic sample data for testing:

   ```bash
   # Connect to your PostgreSQL database and run the seed script
   psql -U todo_user -d todo_app -f collection/seed.sql
   ```

   **🔑 Default Login Credentials:**

   - **Email**: `john.doe@example.com`
   - **Password**: `password123`

   **📊 Sample Data Generated:**

   - 21 users (including the default user)
   - 1,050+ tasks with realistic data
   - Categories and tags for each user
   - Tasks with various priorities, due dates, and completion statuses
   - **All users have the same password**: `password123`

7. **Start development servers**

   ```bash
   # Start both frontend and backend
   pnpm run dev

   # Or start individually:
   pnpm run dev:backend  # Backend at http://localhost:3001
   pnpm run dev:frontend # Frontend at http://localhost:3000
   ```

## 📦 Available Scripts

| Command                   | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `pnpm install`            | Install all dependencies for both projects          |
| `pnpm run dev`            | Start both frontend and backend in development mode |
| `pnpm run dev:backend`    | Start only the backend server                       |
| `pnpm run dev:frontend`   | Start only the frontend server                      |
| `pnpm run build:frontend` | Build frontend for production                       |
| `pnpm test`               | Run tests across all projects                       |

## 🌐 Application Features

### 🔐 Authentication System

- User registration and login with JWT tokens
- Protected routes with automatic token refresh
- Secure password hashing with bcrypt
- Persistent sessions with localStorage
- **User Isolation**: Users can only view and edit their own tasks, categories, and tags

### 📝 Task Management

- **CRUD Operations**: Create, read, update, delete tasks
- **Priority Levels**: Three levels (baja, media, alta)
- **Due Dates**: Set and track task deadlines
- **Completion Status**: Mark tasks as complete/incomplete
- **Rich Descriptions**: Support for detailed task descriptions

### 🏷️ Organization Features

- **Categories**: Organize tasks into custom categories
- **Tags**: Add multiple tags to tasks for better organization
- **Advanced Filtering**: Filter by status, category, priority, due date, tags
- **Search**: Full-text search in task titles and descriptions
- **Sorting**: Sort by creation date, due date, priority, or title

### 🎨 User Experience

- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with system preference
- **Real-time Updates**: Optimistic UI updates for better UX
- **Loading States**: Proper loading indicators and error handling
- **Accessibility**: Built with accessible components via Radix UI

## 📊 Business Intelligence

The project includes comprehensive business intelligence queries that analyze:

1. **User Engagement**: Task creation patterns and user activity
2. **Completion Trends**: Daily completion rates by priority
3. **Category Performance**: Success rates by category
4. **Productivity Patterns**: Peak hours and days analysis
5. **Overdue Analysis**: Task deadline management
6. **Tag Usage**: Most popular tags and their success rates
7. **User Retention**: Weekly retention metrics
8. **Priority Distribution**: Task priority patterns
9. **Seasonal Trends**: Monthly creation and completion patterns
10. **Performance Benchmarking**: Top-performing users analysis

📊 **[View BI Queries](./collection/BI.sql)**

## 🔧 Database Schema

The application uses PostgreSQL with the following entities:

```
User (usuarios) ──┐
                  ├── Tasks (tareas) ──┐
                  ├── Categories (categorias) ──┘
                  └── Tags (etiquetas) ──┐
                                         │
                     TaskTags (tarea_etiquetas) ──┘
```

**Key Features:**

- User isolation (all data belongs to specific users)
- **Privacy Protection**: Users can only view and edit their own tasks, categories, and tags
- Many-to-many relationship between tasks and tags
- Optional category assignment for tasks
- Cascade deletion for data integrity
- Priority enum: `baja`, `media`, `alta`

## 📖 Documentation

### Detailed Documentation

- **[Backend README](./src/backend/README.md)** - Complete backend setup and API documentation
- **[Frontend README](./src/frontend/README.md)** - Frontend setup and development guide
- **[Technical Challenge](./doc/fullstack_todo_challenge.md)** - Original project requirements

### Architecture Documentation

- **[Backend Architecture](./src/backend/doc/CONTEXT.md)** - Clean Architecture implementation details
- **[Frontend Architecture](./src/frontend/doc/CONTEXT.md)** - Modern React patterns and structure
- **[API Documentation](./src/backend/doc/API_DOCUMENTATION.md)** - Complete API reference
- **[Authentication Guide](./src/backend/doc/AUTHENTICATION_GUIDE.md)** - JWT implementation details

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Security**: Bcrypt hashing with salt
- **Rate Limiting**: Multi-tier API protection
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Protection**: Input sanitization and validation
- **Data Isolation**: Users can only access, view, and modify their own data (tasks, categories, tags)

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks

- `GET /api/tasks` - Get user tasks (with advanced filtering)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/complete` - Toggle task completion

### Categories

- `GET /api/category` - Get user categories
- `POST /api/category` - Create category
- `PUT /api/category/:id` - Update category
- `DELETE /api/category/:id` - Delete category

### Tags

- `GET /api/tags` - Get user tags
- `POST /api/tags` - Create tag

**Interactive API Documentation**: Visit `http://localhost:3001/api-docs` when running in development.

## 🎯 Test Data & Sample Users

The project includes a comprehensive seed script (`collection/seed.sql`) that populates the database with realistic sample data for testing and demonstration purposes.

### 🔑 Quick Login Credentials

**Default User:**

- **Email**: `john.doe@example.com`
- **Password**: `password123`

**Additional Test Users:**

- All generated users have the password: `password123`
- Usernames follow the pattern: `usuario1@ejemplo.com`, `usuario2@ejemplo.com`, etc.

### 📊 Sample Data Overview

Running the seed script generates:

- **21 users** (1 default + 20 generated users)
- **1,050+ tasks** with realistic distribution across users
- **Multiple categories** per user (Trabajo, Personal, Estudios)
- **Various tags** for task organization (Urgente, Proyecto Alfa, etc.)
- **Different productivity patterns** (some users complete more tasks than others)
- **Realistic timestamps** spanning the last year
- **Mixed priorities** (baja, media, alta) and completion statuses

### 🚀 Running the Seed Script

```bash
# After setting up your database and running migrations
psql -U todo_user -d todo_app -f collection/seed.sql
```

**Note**: The seed script is idempotent and can be safely run multiple times. It will clear existing data and regenerate fresh sample data.

## 🚨 Troubleshooting

### Common Issues

**Database Connection Issues:**

```bash
# Check PostgreSQL is running
sudo service postgresql status  # Linux
brew services list | grep postgresql  # macOS

# Verify connection
psql -U todo_user -d todo_app -h localhost
```

**Port Conflicts:**

```bash
# Kill process on port 3001 (backend)
npx kill-port 3001

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

**Dependency Issues:**

```bash
# Clear all node_modules and reinstall
pnpm clean
rm -rf node_modules src/*/node_modules
pnpm install
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the established architecture patterns
4. **Add** tests for new functionality
5. **Update** documentation as needed
6. **Submit** a Pull Request

## 📄 License

This project was created as part of a technical challenge for Fracttal.

---

## 🎯 Project Highlights

✅ **Clean Architecture** - Maintainable and testable code structure  
✅ **Modern Tech Stack** - Latest versions of React, Next.js, and Node.js  
✅ **Type Safety** - Full TypeScript implementation  
✅ **Production Ready** - Comprehensive logging, rate limiting, and error handling  
✅ **Responsive UI** - Beautiful interface that works on all devices  
✅ **Advanced Features** - Filtering, searching, sorting, and real-time updates  
✅ **Security First** - JWT authentication, input validation, and SQL injection prevention  
✅ **Business Intelligence** - Comprehensive analytics and reporting queries

**Built with ❤️ using modern web technologies**
