# Global Request User Property Setup Guide

This guide explains how the global `req.user` property is set up and used in your Todo App backend.

## How It Works

### 1. Type Definitions

The `req.user` property is globally typed in two places:

**In `src/types/express.d.ts`:**

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}
```

**Also declared in `src/api/middlewares/auth.middleware.ts`** for local access.

### 2. Authentication Middleware (`protect`)

The `protect` middleware is responsible for setting `req.user`:

```typescript
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const authService = container.get("authService") as IAuthService;
    const decoded = authService.verifyToken(token); // Returns { id, email }

    if (!decoded) {
      return next(new UnauthorizedError("Invalid token."));
    }

    req.user = decoded; // 🎯 This is where req.user gets set!
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token."));
  }
};
```

### 3. How to Use in Routes

#### Protected Routes (require authentication)

```typescript
// In routes file
authRouter.get("/profile", protect, authController.getProfile);
taskRouter.use(protect); // All task routes are protected
```

#### In Controllers

```typescript
public async getProfile(req: Request, res: Response): Promise<void> {
  // req.user is automatically available and typed!
  if (!req.user) {
    throw new UnauthorizedError("User not authenticated.");
  }

  const userId = req.user.id; // TypeScript knows this is a number
  const userEmail = req.user.email; // TypeScript knows this is a string

  // Use the user data...
}
```

## Authentication Flow

### 1. User Registration/Login

```
POST /api/auth/register or /api/auth/login
↓
Returns JWT token in response
```

### 2. Accessing Protected Routes

```
Client includes: Authorization: Bearer <jwt-token>
↓
protect middleware extracts token
↓
Verifies token with authService.verifyToken()
↓
Sets req.user = { id: userId, email: userEmail }
↓
Controller can access req.user
```

## API Endpoints

### Public Endpoints (no authentication required)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (require JWT token)

- `GET /api/auth/profile` - Get user profile
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get user tasks

## Testing Authentication

### 1. Register or Login

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Use Token for Protected Routes

```bash
GET http://localhost:3001/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

## Using Swagger UI

1. **Open Swagger UI**: http://localhost:3001/api-docs
2. **Login**: Use POST /api/auth/login endpoint
3. **Copy Token**: From the login response
4. **Authorize**: Click "Authorize" button in Swagger UI
5. **Enter Token**: `Bearer YOUR_JWT_TOKEN`
6. **Test Protected Endpoints**: Now you can test protected routes

## Important Notes

### ✅ DO's

- Always use the `protect` middleware for routes that need authentication
- Check `if (!req.user)` in controllers when needed
- Set `req.user` only in the `protect` middleware, not in controllers
- Use consistent response formats with `success`, `message`, and `data` properties

### ❌ DON'Ts

- **Don't set `req.user` in controllers** - This should only be done by middleware
- **Don't forget the `protect` middleware** on protected routes
- **Don't assume `req.user` exists** - Always check in controllers
- **Don't include sensitive data** in `req.user` (like passwords)

## JWT Token Content

The JWT token contains:

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "iat": 1640995200,
  "exp": 1640998800
}
```

When decoded by `authService.verifyToken()`, it returns `{ id, email }` which gets assigned to `req.user`.

## Error Handling

If authentication fails:

```json
{
  "success": false,
  "message": "No token provided" // or "Invalid token"
}
```

This setup ensures that:

- ✅ `req.user` is properly typed everywhere
- ✅ Authentication is centralized in the middleware
- ✅ Controllers can safely access user information
- ✅ The system is secure and consistent
