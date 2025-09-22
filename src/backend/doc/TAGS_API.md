# Tags API Implementation Guide

This document explains the implementation of the POST /api/tags endpoint and related tag management functionality.

## Overview

The Tags API allows authenticated users to create and manage tags for organizing their tasks. Each tag belongs to a specific user and must have a unique name within that user's scope.

## Endpoints

### POST /api/tags

Creates a new tag for the authenticated user.

**URL**: `POST http://localhost:3001/api/tags`

**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "name": "Work"
}
```

**Success Response (201)**:

```json
{
  "success": true,
  "message": "Tag created successfully",
  "data": {
    "id": 1,
    "name": "Work",
    "userId": 1
  }
}
```

**Error Responses**:

- `400 Bad Request`: Tag name already exists for this user
- `401 Unauthorized`: Invalid or missing authentication token
- `422 Validation Error`: Invalid request data

### GET /api/tags

Retrieves all tags for the authenticated user.

**URL**: `GET http://localhost:3001/api/tags`

**Authentication**: Required (Bearer token)

**Success Response (200)**:

```json
{
  "success": true,
  "message": "Tags retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Work",
      "userId": 1
    },
    {
      "id": 2,
      "name": "Personal",
      "userId": 1
    }
  ]
}
```

## Implementation Architecture

### 1. Domain Layer

- **Tag Entity** (`src/domain/entities/Tag.entity.ts`)
  - Enforces business rules (non-empty name, valid userId)
  - Represents the core tag concept

### 2. Application Layer

- **DTOs** (`src/application/dtos/tag.dto.ts`)
  - `CreateTagDTO`: Request validation schema
  - `TagResponseDTO`: Response structure schema

- **Use Cases** (`src/application/use-cases/tag/`)
  - `CreateTagUseCase`: Handles tag creation with duplicate validation
  - `GetTagsByUserUseCase`: Retrieves user's tags

- **Repository Interface** (`src/application/ports/ITagRepository.ts`)
  - Defines contract for tag data persistence

### 3. Infrastructure Layer

- **Repository Implementation** (`src/infrastructure/database/prisma/repositories/PrismaTagRepository.ts`)
  - Implements tag CRUD operations using Prisma ORM
  - Maps between domain entities and database models

- **Database Mapper** (`src/infrastructure/database/prisma/mappers/TagMapper.ts`)
  - Converts between Prisma models and domain entities

### 4. API Layer

- **Controller** (`src/api/controllers/tag.controller.ts`)
  - Handles HTTP requests and responses
  - Orchestrates use case execution

- **Routes** (`src/api/routes/tag.routes.ts`)
  - Defines endpoints with authentication and validation middleware
  - Includes comprehensive Swagger documentation

## Database Schema

```sql
-- Prisma schema (PostgreSQL)
model Tag {
  id     Int    @id @default(autoincrement())
  name   String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId Int
  tasks  TaskTag[]

  @@unique([userId, name])  -- Prevents duplicate tag names per user
  @@map("etiquetas")
}
```

## Testing with Swagger UI

1. **Access Documentation**: http://localhost:3001/api-docs
2. **Authenticate**:
   - Login using POST /api/auth/login
   - Copy the JWT token from response
   - Click "Authorize" button in Swagger UI
   - Enter: `Bearer YOUR_JWT_TOKEN`

3. **Test Tag Creation**:
   - Use POST /api/tags
   - Enter tag name in request body
   - Execute request

4. **Test Tag Retrieval**:
   - Use GET /api/tags
   - Execute request to see all your tags

## Testing with cURL

### 1. Login and get token:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Create a tag:

```bash
curl -X POST http://localhost:3001/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Work"
  }'
```

### 3. Get all tags:

```bash
curl -X GET http://localhost:3001/api/tags \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Business Rules

1. **Authentication Required**: All tag endpoints require valid JWT authentication
2. **User Isolation**: Users can only access their own tags
3. **Unique Names**: Tag names must be unique within a user's scope
4. **Name Validation**: Tag names cannot be empty and must be ≤ 50 characters
5. **Cascade Deletion**: Tags are deleted when the user is deleted

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

**Common Errors**:

- `401 Unauthorized`: Missing or invalid JWT token
- `400 Bad Request`: Tag name already exists
- `422 Validation Error`: Invalid request data
- `500 Internal Server Error`: Server-side issues

## Future Enhancements

Potential future features for the Tags API:

1. **Tag Updates**: PUT /api/tags/:id to update tag names
2. **Tag Deletion**: DELETE /api/tags/:id to remove tags
3. **Tag Statistics**: GET /api/tags/:id/stats for usage analytics
4. **Tag Colors**: Add color field for visual organization
5. **Tag Categories**: Hierarchical tag organization
6. **Bulk Operations**: Create/update multiple tags at once

## Dependencies

This implementation depends on:

- **Prisma ORM**: Database operations
- **Zod**: Request validation
- **Express**: HTTP routing
- **JWT**: Authentication
- **Swagger**: API documentation

## Files Created/Modified

### New Files:

- `src/application/dtos/tag.dto.ts`
- `src/application/ports/ITagRepository.ts`
- `src/application/use-cases/tag/CreateTag.usecase.ts`
- `src/application/use-cases/tag/GetTagsByUser.usecase.ts`
- `src/application/use-cases/tag/index.ts`
- `src/infrastructure/database/prisma/repositories/PrismaTagRepository.ts`
- `src/infrastructure/database/prisma/mappers/TagMapper.ts`
- `src/api/controllers/tag.controller.ts`
- `src/api/routes/tag.routes.ts`

### Modified Files:

- `src/application/ports/index.ts` - Added tag repository export
- `src/infrastructure/database/prisma/repositories/index.ts` - Added tag repository export
- `src/infrastructure/database/prisma/mappers/index.ts` - Added tag mapper export
- `src/infrastructure/di.ts` - Registered tag dependencies
- `src/api/routes/index.ts` - Added tag routes and documentation
- `src/api/app.ts` - Added tags endpoint to root info
- `src/config/swagger.config.ts` - Added tag schemas

The implementation follows clean architecture principles with proper separation of concerns, comprehensive error handling, and full API documentation.
