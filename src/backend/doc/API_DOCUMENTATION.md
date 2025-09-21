# API Documentation with Swagger

This project now includes comprehensive API documentation using Swagger/OpenAPI 3.0.

## Accessing the Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3001/api-docs
```

## Features

### 🔍 Interactive Documentation

- **Live API Testing**: Test all endpoints directly from the browser
- **Request/Response Examples**: See real examples for all endpoints
- **Schema Validation**: View detailed request and response schemas
- **Authentication Testing**: Test protected endpoints with JWT tokens

### 📋 Available Endpoints

#### Authentication Endpoints (`/api/auth`)

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login and get JWT token

#### Task Endpoints (`/api/tasks`)

- **POST /api/tasks** - Create a new task (protected)
- **GET /api/tasks** - Get user's tasks with filtering options (protected)

### 🔐 Authentication

Protected endpoints require a JWT token. To test protected endpoints:

1. **Register or Login** using the auth endpoints
2. **Copy the JWT token** from the response
3. **Click "Authorize"** button in Swagger UI
4. **Enter**: `Bearer YOUR_JWT_TOKEN`
5. **Test protected endpoints** - they will now include the authorization header

### 📖 API Features

#### Task Filtering

The GET /api/tasks endpoint supports various query parameters:

- `status`: Filter by task status (pendiente, en_progreso, completada, cancelada)
- `priority`: Filter by priority (baja, media, alta)
- `categoryId`: Filter by category ID
- `page`: Page number for pagination
- `limit`: Number of tasks per page (1-100)

#### Request Validation

All endpoints include comprehensive request validation:

- **Required fields**: Clearly marked in the documentation
- **Data types**: Proper typing for all fields
- **Validation rules**: Min/max lengths, email formats, etc.

### 🛠 Development

#### Adding New Endpoints

When adding new endpoints to the API:

1. **Add JSDoc comments** with `@swagger` annotations to your route files
2. **Define schemas** in `src/config/swagger.config.ts` for request/response models
3. **Update tags** if creating new endpoint categories
4. **Test documentation** by visiting `/api-docs`

#### Schema Structure

All schemas are defined in the Swagger configuration file:

- **Request schemas**: For validating incoming data
- **Response schemas**: For documenting API responses
- **Error schemas**: For consistent error handling
- **Security schemes**: For authentication methods

### 📁 File Structure

```
src/
├── config/
│   └── swagger.config.ts     # Swagger/OpenAPI configuration
├── api/
│   ├── app.ts               # Swagger UI integration
│   └── routes/
│       ├── index.ts         # Route tags definition
│       ├── auth.routes.ts   # Auth endpoint documentation
│       └── task.routes.ts   # Task endpoint documentation
```

### 🚀 Quick Start

1. **Start the server**:

   ```bash
   pnpm --filter backend run dev
   ```

2. **Open documentation**:

   ```
   http://localhost:3001/api-docs
   ```

3. **Test authentication**:
   - Use POST /api/auth/register to create an account
   - Use POST /api/auth/login to get a JWT token
   - Click "Authorize" and enter: `Bearer YOUR_JWT_TOKEN`

4. **Test task management**:
   - Create tasks with POST /api/tasks
   - Retrieve tasks with GET /api/tasks
   - Use query parameters to filter results

### 📝 Notes

- The documentation is automatically generated from JSDoc comments
- All schemas include examples and descriptions
- The UI includes request/response validation
- Authentication state persists during your session
- The documentation supports both development and production environments
