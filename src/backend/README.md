# Todo App Backend

A robust REST API built with Node.js, Express, TypeScript, and PostgreSQL following Clean Architecture principles.

## 🏗️ Architecture Overview

This backend implements **Clean Architecture** (Hexagonal Architecture) with clear separation of concerns across four layers:

- **Domain Layer**: Core business entities and rules (User, Task, Category, Tag)
- **Application Layer**: Use cases and business logic orchestration
- **Infrastructure Layer**: External concerns (Database, Security, Services)
- **API Layer**: HTTP controllers, routes, and middleware

The architecture ensures that business logic is independent of frameworks, databases, and external systems, making the code highly maintainable and testable.

📚 **For detailed architecture documentation**: [Read CONTEXT.md](./doc/CONTEXT.md)

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 12.0
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository and navigate to backend**

   ```bash
   cd src/backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env` file in the backend root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"

   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="24h"

   # Server Configuration
   PORT=3001
   NODE_ENV="development"

   # Rate Limiting & Logging
   LOGGING_ENABLED=true
   LOG_LEVEL="detailed"
   LOG_COLOR_OUTPUT=true
   SLOW_REQUEST_THRESHOLD=5000
   WARNING_REQUEST_THRESHOLD=1000

   # Cors
   FRONTEND_URL="http://localhost:3000"
   ```

### Database Setup

#### 1. Create PostgreSQL Database

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE todo_app;
CREATE USER todo_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
```

#### 2. Run Prisma Migrations

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
pnpm run db:generate

# Run database migrations
pnpm run db:migrate
```

This will:

- Create all necessary tables (`usuarios`, `tareas`, `categorias`, `etiquetas`, `tarea_etiquetas`)
- Set up relationships and constraints
- Apply the complete database schema

#### 3. Optional: Open Prisma Studio

To visualize and manage your database:

```bash
pnpm run db:studio
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
pnpm run dev
```

Starts the server with hot reload at `http://localhost:3001`

### Production Build

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

```
User (usuarios)
├── id, email, name, password, createdAt
├── → tasks (1:N)
├── → categories (1:N)
└── → tags (1:N)

Task (tareas)
├── id, title, description, completed, priority, dueDate
├── → user (N:1)
├── → category (N:1, optional)
└── → tags (N:N via TaskTag)

Category (categorias)
├── id, name
├── → user (N:1)
└── → tasks (1:N)

Tag (etiquetas)
├── id, name
├── → user (N:1)
└── → tasks (N:N via TaskTag)
```

### Priority Enum

- `baja` (Low)
- `media` (Medium) - Default
- `alta` (High)

## 🛠️ Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `pnpm run dev`         | Start development server with hot reload |
| `pnpm run build`       | Build for production                     |
| `pnpm run start`       | Start production server                  |
| `pnpm run db:migrate`  | Run Prisma database migrations           |
| `pnpm run db:generate` | Generate Prisma client                   |
| `pnpm run db:studio`   | Open Prisma Studio (database GUI)        |

## 🔧 Development Tools

### Database Migrations

When you modify the Prisma schema:

1. **Create and apply migration**:

   ```bash
   pnpm run db:migrate
   ```

   This will prompt you to name your migration and apply it to the database.

2. **Generate updated Prisma client**:
   ```bash
   pnpm run db:generate
   ```

### Reset Database (Development)

```bash
# Reset database and apply all migrations
npx prisma migrate reset
```

⚠️ **Warning**: This will delete all data in your database.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Tasks

- `GET /api/tasks` - Get user tasks (with filtering)
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

### API Documentation

When running in development, visit `http://localhost:3001/api-docs` for interactive Swagger documentation.

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: Bcrypt with salt for secure password storage
- **Rate Limiting**: Multiple tiers to prevent API abuse
- **Input Validation**: Zod schemas for request validation
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Request Logging**: Comprehensive logging with security considerations

## 🛡️ Rate Limiting

| Endpoint Type   | Window | Limit   | Applied To              |
| --------------- | ------ | ------- | ----------------------- |
| General API     | 15 min | 100 req | All endpoints           |
| Authentication  | 15 min | 5 req   | `/auth/login`           |
| Registration    | 1 hour | 3 req   | `/auth/register`        |
| CRUD Operations | 15 min | 200 req | Tasks, Categories, Tags |

## 🗂️ Project Structure

```
src/
├── api/                    # API Layer (Controllers, Routes, Middleware)
│   ├── controllers/        # HTTP request handlers
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Authentication, validation, logging
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── application/           # Application Layer (Use Cases, DTOs, Ports)
│   ├── use-cases/        # Business logic orchestration
│   ├── dtos/             # Data transfer objects
│   └── ports/            # Interface definitions
├── domain/               # Domain Layer (Entities, Business Rules)
│   ├── entities/         # Core business entities
│   └── enums/           # Domain enumerations
├── infrastructure/       # Infrastructure Layer (Database, Services)
│   ├── database/        # Prisma repositories and mappers
│   ├── security/        # Password hashing, JWT services
│   └── di.ts           # Dependency injection container
├── config/              # Configuration files
└── utils/               # Shared utilities
```

## 🧪 Environment Variables

| Variable          | Description                  | Default                 | Required |
| ----------------- | ---------------------------- | ----------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string | -                       | ✅       |
| `JWT_SECRET`      | Secret key for JWT tokens    | -                       | ✅       |
| `JWT_EXPIRES_IN`  | JWT token expiration         | "24h"                   | ❌       |
| `PORT`            | Server port                  | 3001                    | ❌       |
| `NODE_ENV`        | Environment mode             | "development"           | ❌       |
| `FRONTEND_URL`    | Frontend URL for CORS        | "http://localhost:3000" | ❌       |
| `LOGGING_ENABLED` | Enable request logging       | true                    | ❌       |
| `LOG_LEVEL`       | Logging detail level         | "detailed"              | ❌       |

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check `DATABASE_URL` in `.env`
   - Ensure database exists and user has proper permissions

2. **Migration Errors**

   ```bash
   # Reset and reapply migrations
   npx prisma migrate reset
   pnpm run db:migrate
   ```

3. **Port Already in Use**

   ```bash
   # Find and kill process using port 3001
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

4. **Prisma Client Out of Sync**
   ```bash
   pnpm run db:generate
   ```

### Logs and Debugging

- Check console output for detailed request logs
- Rate limiting violations are logged with IP/user information
- Slow requests (>1s) are automatically flagged in logs

## 📚 Additional Documentation

- **[Complete Architecture Guide](./doc/CONTEXT.md)** - Detailed architectural decisions and patterns
- **[API Documentation](./doc/API_DOCUMENTATION.md)** - Comprehensive API reference
- **[Authentication Guide](./doc/AUTHENTICATION_GUIDE.md)** - JWT implementation details
- **[Rate Limiting](./doc/RATE_LIMITING.md)** - Rate limiting configuration
- **[Request Logging](./doc/REQUEST_LOGGING.md)** - Logging system details

## 🤝 Contributing

1. Follow the established Clean Architecture patterns
2. Ensure all use cases have proper error handling
3. Add appropriate validation using Zod schemas
4. Update documentation for new endpoints
5. Test with different user scenarios

---

**Tech Stack**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma, JWT, Bcrypt, Zod, Swagger
