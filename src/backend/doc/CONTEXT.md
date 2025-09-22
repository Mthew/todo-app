# Project Context: Backend Architecture

This document provides a comprehensive analysis of the backend's architectural design, implementation details, API endpoints, database schema, and key decisions. Its purpose is to onboard developers quickly and ensure the long-term maintainability and scalability of the codebase.

## 1. Core Architectural Philosophy: Clean Architecture

This project is built following the principles of **Clean Architecture** (also known as Ports and Adapters or Hexagonal Architecture). The primary goal is the **separation of concerns**, ensuring that the core business logic is independent of external frameworks, databases, and UI.

The fundamental rule governing this architecture is **The Dependency Rule**: _Source code dependencies must only point inwards._

```
+-------------------------------------------------------------------+
|  Layer 4: API & Infrastructure (Express, Prisma, Bcrypt)          |
|      +-------------------------------------------------------+    |
|      |        Layer 2: Application (Use Cases)               |    |
|      |            +-----------------------------------+       |    |
|      |            |      Layer 1: Domain (Entities)   |       |    |
|      |            +-----------------------------------+       |    |
|      +-------------------------------------------------------+    |
+-------------------------------------------------------------------+
       <---------- Dependencies Point Inwards (arrow direction) ----
```

This means:

- The **Domain** knows nothing about the other layers.
- The **Application** layer only knows about the **Domain**.
- The **Infrastructure** and **API** layers know about the Application and Domain, but the reverse is not true.

## 2. Database Schema & Entity Relationship Diagram

The application uses **PostgreSQL** with **Prisma ORM** for type-safe database operations. Here's the complete database schema:

### Database Tables

```sql
-- Users Table (usuarios)
CREATE TABLE "usuarios" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table (tareas)
CREATE TABLE "tareas" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" Priority NOT NULL DEFAULT 'media',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "usuarios"("id") ON DELETE CASCADE,
    "categoryId" INTEGER REFERENCES "categorias"("id") ON DELETE SET NULL
);

-- Categories Table (categorias)
CREATE TABLE "categorias" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "usuarios"("id") ON DELETE CASCADE,
    UNIQUE("userId", "name") -- Prevents duplicate category names per user
);

-- Tags Table (etiquetas)
CREATE TABLE "etiquetas" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "usuarios"("id") ON DELETE CASCADE,
    UNIQUE("userId", "name") -- Prevents duplicate tag names per user
);

-- Task-Tag Junction Table (tarea_etiquetas)
CREATE TABLE "tarea_etiquetas" (
    "taskId" INTEGER NOT NULL REFERENCES "tareas"("id") ON DELETE CASCADE,
    "tagId" INTEGER NOT NULL REFERENCES "etiquetas"("id") ON DELETE CASCADE,
    PRIMARY KEY ("taskId", "tagId")
);

-- Priority Enum
CREATE TYPE "Priority" AS ENUM ('baja', 'media', 'alta');
```

### Entity Relationships

```
User (1) -----> (N) Task
User (1) -----> (N) Category
User (1) -----> (N) Tag
Category (1) -> (N) Task [Optional]
Task (N) <----> (N) Tag [Many-to-Many via TaskTag]
```

### Key Design Decisions:

- **User Isolation**: All entities belong to a specific user (userId foreign key)
- **Unique Constraints**: Category and Tag names must be unique per user
- **Cascading Deletes**: When a user is deleted, all their data is removed
- **Soft Category Relations**: Tasks can exist without categories (SET NULL on delete)
- **Priority Enum**: Predefined priority levels in Spanish (baja, media, alta)

## 3. Complete API Endpoints Documentation

The API provides a RESTful interface with JWT authentication. All endpoints except authentication return data directly (no wrapper objects).

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint             | Description       | Authentication |
| ------ | -------------------- | ----------------- | -------------- |
| POST   | `/api/auth/register` | Register new user | None           |
| POST   | `/api/auth/login`    | User login        | None           |
| GET    | `/api/auth/profile`  | Get user profile  | JWT Required   |

**Request/Response Examples:**

```typescript
// POST /api/auth/register
Request: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}

// POST /api/auth/login
Request: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" }
}
```

### 📋 Task Management Endpoints (`/api/tasks`)

| Method | Endpoint                  | Description                       | Authentication |
| ------ | ------------------------- | --------------------------------- | -------------- |
| POST   | `/api/tasks`              | Create new task                   | JWT Required   |
| GET    | `/api/tasks`              | Get user's tasks (with filtering) | JWT Required   |
| PUT    | `/api/tasks/:id`          | Update task                       | JWT Required   |
| DELETE | `/api/tasks/:id`          | Delete task                       | JWT Required   |
| POST   | `/api/tasks/:id/complete` | Mark task as complete             | JWT Required   |

#### Task Filtering Options

The `GET /api/tasks` endpoint supports comprehensive filtering via query parameters:

**Query Parameters:**

- `completed` - Filter by completion status (`true`, `false`)
- `priority` - Filter by priority level (`baja`, `media`, `alta`)
- `categoryId` - Filter by specific category ID
- `tagIds` - Filter by tag IDs (comma-separated, e.g., `1,2,3`)
- `dueDateFrom` - Filter tasks due from this date (ISO string)
- `dueDateTo` - Filter tasks due before this date (ISO string)
- `search` - Search in task title and description (case-insensitive)

**Filtering Examples:**

```typescript
// Get completed tasks with high priority
GET /api/tasks?completed=true&priority=alta

// Get tasks in a specific category
GET /api/tasks?categoryId=1

// Get tasks with multiple tags
GET /api/tasks?tagIds=1,2,3

// Get tasks due this week
GET /api/tasks?dueDateFrom=2023-12-01T00:00:00.000Z&dueDateTo=2023-12-07T23:59:59.000Z

// Search for tasks containing "documentation"
GET /api/tasks?search=documentation

// Complex filtering: incomplete work tasks due this month
GET /api/tasks?completed=false&categoryId=1&dueDateFrom=2023-12-01T00:00:00.000Z&dueDateTo=2023-12-31T23:59:59.000Z
```

**Request/Response Examples:**

```typescript
// POST /api/tasks
Request: {
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "alta",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "categoryId": 1,
  "tagIds": [1, 2]
}
Response: {
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "completed": false,
  "priority": "alta",
  "dueDate": "2023-12-31T23:59:59.000Z",
  "userId": 1,
  "categoryId": 1,
  "tags": [
    { "id": 1, "name": "Work", "userId": 1 },
    { "id": 2, "name": "Documentation", "userId": 1 }
  ]
}

// GET /api/tasks (with filtering)
Request: GET /api/tasks?completed=false&priority=alta&categoryId=1
Response: [
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "completed": false,
    "priority": "alta",
    "dueDate": "2023-12-31T23:59:59.000Z",
    "userId": 1,
    "categoryId": 1,
    "tags": [
      { "id": 1, "name": "Work", "userId": 1 },
      { "id": 2, "name": "Documentation", "userId": 1 }
    ]
  }
]

// PUT /api/tasks/:id
Request: {
  "title": "Updated task title",
  "completed": true,
  "priority": "media"
}
Response: { /* Updated task object */ }
```

### 🏷️ Tag Management Endpoints (`/api/tags`)

| Method | Endpoint    | Description     | Authentication |
| ------ | ----------- | --------------- | -------------- |
| POST   | `/api/tags` | Create new tag  | JWT Required   |
| GET    | `/api/tags` | Get user's tags | JWT Required   |

**Request/Response Examples:**

```typescript
// POST /api/tags
Request: {
  "name": "Work"
}
Response: {
  "id": 1,
  "name": "Work",
  "userId": 1
}

// GET /api/tags
Response: [
  { "id": 1, "name": "Work", "userId": 1 },
  { "id": 2, "name": "Personal", "userId": 1 }
]
```

### 📂 Category Management Endpoints (`/api/category`)

| Method | Endpoint            | Description           | Authentication |
| ------ | ------------------- | --------------------- | -------------- |
| POST   | `/api/category`     | Create new category   | JWT Required   |
| GET    | `/api/category`     | Get user's categories | JWT Required   |
| PUT    | `/api/category/:id` | Update category       | JWT Required   |
| DELETE | `/api/category/:id` | Delete category       | JWT Required   |

**Request/Response Examples:**

```typescript
// POST /api/category
Request: {
  "name": "Work Projects"
}
Response: {
  "id": 1,
  "name": "Work Projects",
  "userId": 1
}

// PUT /api/category/:id
Request: {
  "name": "Updated Work Projects"
}
Response: {
  "id": 1,
  "name": "Updated Work Projects",
  "userId": 1
}
```

## 4. Breakdown of Layers

The `src/` directory is organized into four primary layers:

### a. `domain/` (The Core)

**Entities:**

- `User.entity.ts` - User domain model with email validation
- `Task.entity.ts` - Task with business rules (title validation, due date logic, completion status)
- `Category.entity.ts` - Category with name validation
- `Tag.entity.ts` - Tag with name validation
- `Task.types.ts` - Priority enum (baja, media, alta)

**Key Rule:** This layer has **zero dependencies** on any other layer or external framework.

### b. `application/` (The Use Cases)

**Use Cases by Domain:**

**Authentication:**

- `RegisterUserUseCase` - User registration with validation
- `LoginUseCase` - User authentication and JWT generation
- `GetUserByIdUseCase` - Retrieve user profile

**Task Management:**

- `CreateTaskUseCase` - Create new task with tag associations
- `GetTasksByUserUseCase` - Retrieve user tasks with advanced filtering (completion, priority, category, tags, due dates, search)
- `UpdateTaskUseCase` - Update task with ownership validation
- `DeleteTaskUseCase` - Delete task with ownership validation
- `CompleteTaskUseCase` - Mark task as complete

**Tag Management:**

- `CreateTagUseCase` - Create tag with uniqueness validation
- `GetTagsByUserUseCase` - Retrieve all user tags

**Category Management:**

- `CreateCategoryUseCase` - Create category with uniqueness validation
- `GetCategoriesByUserUseCase` - Retrieve all user categories
- `UpdateCategoryUseCase` - Update category with ownership validation
- `DeleteCategoryUseCase` - Delete category with ownership validation

**Ports (Interfaces):**

- `IUserRepository` - User data operations
- `ITaskRepository` - Task CRUD with relations
- `ITagRepository` - Tag CRUD operations
- `ICategoryRepository` - Category CRUD operations
- `IPasswordHasher` - Password encryption interface
- `IAuthService` - JWT token management interface

**DTOs:**

- `CreateTaskDTO`, `UpdateTaskDTO` - Task data transfer objects
- `CreateCategoryDTO`, `UpdateCategoryDTO` - Category DTOs
- `CreateTagDTO` - Tag data transfer object
- `LoginDTO`, `RegisterUserDTO` - Authentication DTOs

### c. `infrastructure/` (The Implementation Details)

**Repository Implementations:**

- `PrismaUserRepository` - User operations with Prisma
- `PrismaTaskRepository` - Task operations with tag relations
- `PrismaTagRepository` - Tag operations with user isolation
- `PrismaCategoryRepository` - Category operations with user isolation

**Services:**

- `BcryptPasswordHasher` - Password hashing with bcrypt
- `JwtAuthService` - JWT token generation and validation

**Mappers:**

- `UserMapper` - Convert between Prisma and Domain entities
- `TaskMapper` - Handle task relations (tags) conversion
- `TagMapper` - Simple tag entity conversion
- `CategoryMapper` - Simple category entity conversion

**Dependency Injection:**

- `di.ts` - Simple service container for all dependencies

### d. `api/` (The Delivery Mechanism)

**Controllers:**

- `AuthController` - Handle authentication requests
- `TaskController` - Task CRUD operations with JWT validation
- `TagController` - Tag operations with user isolation
- `CategoryController` - Category operations with user isolation

**Routes:**

- `auth.routes.ts` - Authentication endpoints
- `task.routes.ts` - Task management with Swagger docs
- `tag.routes.ts` - Tag management with Swagger docs
- `category.routes.ts` - Category management with Swagger docs

**Middlewares:**

- `auth.middleware.ts` - JWT validation and user extraction
- `error.handler.ts` - Global error handling
- `validator.middleware.ts` - Zod schema validation
- `rate-limit.middleware.ts` - API rate limiting and abuse prevention
- `request-logger.middleware.ts` - Comprehensive request/response logging

## 5. Technology Stack & Rationale

| Technology              | Purpose            | Rationale                                                                                     |
| :---------------------- | :----------------- | :-------------------------------------------------------------------------------------------- |
| **PNPM**                | Package Management | Chosen for monorepo efficiency, fast installs, and phantom dependency prevention              |
| **TypeScript**          | Language           | Provides static typing for robust, self-documenting code essential for layered architecture   |
| **Prisma**              | ORM                | Type-safe database client with declarative schema and seamless TypeScript integration         |
| **Express.js**          | Web Framework      | Minimal, unopinionated framework perfect for thin API layer without architectural constraints |
| **Zod**                 | Schema Validation  | TypeScript-first validation library for DTOs and request validation                           |
| **Bcrypt.js**           | Password Hashing   | Industry standard for secure password hashing                                                 |
| **JWT**                 | Authentication     | Stateless, widely adopted standard for API security                                           |
| **Express Rate Limit**  | Rate Limiting      | Prevents API abuse with configurable request limits per IP/user                               |
| **Swagger/OpenAPI 3.0** | API Documentation  | Interactive documentation with complete schema definitions                                    |
| **PostgreSQL**          | Database           | Robust relational database with excellent Prisma support                                      |

## 6. Security Implementation

### Authentication & Authorization

- **JWT Bearer Tokens**: Stateless authentication for API access
- **Password Hashing**: Bcrypt with salt for secure password storage
- **User Isolation**: All data operations filtered by authenticated user ID
- **Ownership Validation**: Users can only access/modify their own data

### Rate Limiting & API Protection

- **Multi-tier Rate Limiting**: Different limits for different endpoint types
- **Authentication Protection**: Strict limits on login attempts (5/15min)
- **Registration Throttling**: Limited registrations per IP (3/hour)
- **CRUD Rate Limits**: Moderate limits for task operations (200/15min)
- **User-based Limiting**: Authenticated users tracked by user ID, not IP
- **DDoS Mitigation**: Global rate limiting prevents API abuse

**Rate Limit Configuration:**

| Endpoint Type   | Window | Limit   | Applied To              |
| --------------- | ------ | ------- | ----------------------- |
| General API     | 15 min | 100 req | All endpoints           |
| Authentication  | 15 min | 5 req   | `/auth/login`           |
| Registration    | 1 hour | 3 req   | `/auth/register`        |
| CRUD Operations | 15 min | 200 req | Tasks, Tags, Categories |

### Data Protection

- **Input Validation**: Zod schemas validate all request data
- **SQL Injection Protection**: Prisma provides parameterized queries
- **Error Handling**: Sanitized error responses prevent information leakage

## 7. Development Patterns & Best Practices

### Error Handling

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}
```

### Response Format

All endpoints return data directly without wrapper objects:

```typescript
// ✅ Good - Direct data return
{ "id": 1, "name": "Task name", "completed": false }

// ❌ Avoided - Wrapped responses
{ "success": true, "data": { "id": 1, "name": "Task name" } }
```

### Use Case Pattern

```typescript
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    // Business logic here
    return await this.taskRepository.save(task);
  }
}
```

## 8. Monitoring & Observability

### Request Logging

The application implements comprehensive request logging with configurable detail levels:

**Features:**

- **🎨 Colorized Console Output**: Beautiful, readable logs with color-coded status codes
- **📊 Performance Monitoring**: Automatic detection of slow requests (>1s warning, >5s critical)
- **🔒 Security-First**: Automatic redaction of sensitive data (passwords, tokens, etc.)
- **🏷️ Request Tracking**: Unique request IDs for correlating logs across operations
- **⚙️ Configurable Detail Levels**: From minimal to detailed logging
- **🌍 Environment-Aware**: Different configurations for dev/staging/production

**Log Levels:**

| Environment | Level    | Colors | Body | Headers | User Info | Performance |
| ----------- | -------- | ------ | ---- | ------- | --------- | ----------- |
| Development | Detailed | ✅     | ✅   | ❌      | ✅        | ✅          |
| Staging     | Standard | ❌     | ❌   | ❌      | ✅        | ✅          |
| Production  | Minimal  | ❌     | ❌   | ❌      | ❌        | ✅          |
| Testing     | Disabled | -      | -    | -       | -         | -           |

**Example Log Output:**

```bash
🔄 [2025-09-21T10:30:45.123Z] [abc123def456] GET /api/tasks from 127.0.0.1
✅ [2025-09-21T10:30:45.168Z] [abc123def456] GET /api/tasks 200 45ms 1024 bytes
   User: {"id": 123, "email": "user@example.com"}
   ⚡ Performance warning: 1.5s
```

**Configuration:**

```env
# Environment Variables
NODE_ENV=development
LOGGING_ENABLED=true
LOG_LEVEL=standard
LOG_INCLUDE_BODY=false
LOG_INCLUDE_HEADERS=false
LOG_INCLUDE_USER_INFO=true
LOG_COLOR_OUTPUT=true
SLOW_REQUEST_THRESHOLD=5000
WARNING_REQUEST_THRESHOLD=1000
LOG_EXCLUDE_PATHS=/health,/metrics
```

### Rate Limiting Monitoring

Rate limiting provides built-in monitoring and protection:

**Features:**

- **Request Tracking**: Monitor rate limit violations per IP/user
- **Performance Impact**: Track which endpoints are being hit most frequently
- **Security Alerts**: Automatic logging of rate limit violations
- **Headers**: Standard rate limit headers in all responses

**Rate Limit Headers:**

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1632150000
```

**Violation Logging:**

```bash
🔥 [2025-09-21T10:30:45.123Z] RATE LIMIT EXCEEDED: 127.0.0.1 on /api/auth/login
```

## 9. Data Flow Example: Creating a New Task

1. **Request Logging:** Request is logged with unique ID, method, URL, and timestamp
2. **Rate Limiting:** Check if request exceeds rate limits (200 req/15min for CRUD operations)
3. **API Layer:** `POST /api/tasks` → `TaskController.create()`
4. **Validation:** Zod validates request body against `CreateTaskSchema`
5. **Authentication:** JWT middleware extracts user from token
6. **Application Layer:** `CreateTaskUseCase.execute()` with validated DTO
7. **Domain Layer:** Creates `Task` entity with business rules
8. **Infrastructure Layer:** `PrismaTaskRepository` saves to database
9. **Response Logging:** Log response with status code, duration, and performance metrics
10. **Response:** Returns created task data directly (no wrapper)

**Complete Request Lifecycle with Middleware:**

```
Incoming Request
    ↓
📊 Request Logger (logs incoming request with unique ID)
    ↓
🛡️ Rate Limiter (checks request limits, adds rate limit headers)
    ↓
🔐 Authentication (validates JWT token, extracts user)
    ↓
✅ Validation (Zod schema validation)
    ↓
🏗️ Controller → Use Case → Entity → Repository
    ↓
📊 Response Logger (logs response with performance metrics)
    ↓
Response Sent
```

## 9. Developer's Guide: Adding New Features

When adding a new feature, follow the dependency rule by working from the inside out:

1. **Domain:** Create/modify entities in `domain/entities/`
2. **Application:**
   - Define interfaces in `application/ports/`
   - Create DTOs in `application/dtos/`
   - Write use cases in `application/use-cases/`
3. **Infrastructure:** Implement repository interfaces in `infrastructure/database/`
4. **API:**
   - Create controller in `api/controllers/`
   - Add routes in `api/routes/`
   - Update Swagger schemas in `config/swagger.config.ts`
   - Configure rate limits in `config/rate-limit.config.ts`
   - Adjust logging settings in `config/logging.config.ts`
   - Register dependencies in `infrastructure/di.ts`

## 10. Testing & Documentation

### API Documentation

- **Swagger UI**: Available at `http://localhost:3001/api-docs`
- **Complete Schemas**: All request/response models documented
- **Interactive Testing**: Built-in API testing interface
- **Authentication**: Bearer token support in Swagger UI

### Development Server

```bash
# Start development server
pnpm run dev

# Server runs on http://localhost:3001
# API documentation: http://localhost:3001/api-docs
```

## 11. Future Considerations

### Scalability Improvements

- **Database Indexing**: Add indexes for userId foreign keys and frequently queried fields (priority, completed, dueDate)
- **Caching Layer**: Implement Redis for frequently accessed data and distributed rate limiting
- ✅ **Rate Limiting**: ~~Add request rate limiting middleware~~ (Implemented with multi-tier limits)
- **Input Sanitization**: Enhanced XSS protection
- **Request Logging Enhancement**: Implement structured JSON logging for production log aggregation

### Feature Enhancements

- ✅ **Task Filtering**: ~~Advanced filtering by priority, due date, category~~ (Implemented with comprehensive query parameters)
- **Pagination**: Implement cursor-based pagination for large task datasets
- **Task Attachments**: File upload capability for tasks
- **Team Collaboration**: Multi-user task sharing and permissions
- **Advanced Search**: Full-text search capabilities for task content
- **Bulk Operations**: Bulk update/delete operations for tasks
- **Task Analytics**: Usage statistics and productivity metrics

### Monitoring & Observability Improvements

- **Structured Logging**: JSON format logs for log aggregation tools (ELK stack, Datadog)
- **Metrics Collection**: Application performance metrics (response times, error rates, endpoint usage)
- **Health Checks**: Comprehensive health check endpoints for monitoring tools
- **Alerting**: Rate limit violation alerts and performance degradation notifications
- **Distributed Tracing**: Request tracing across microservices (when scaling to multiple services)

This architecture ensures maintainability, testability, and scalability while providing a clear separation of concerns that makes the codebase easy to understand and extend. The recent additions of advanced task filtering, comprehensive rate limiting, and request logging significantly enhance the API's functionality, security, and observability.
