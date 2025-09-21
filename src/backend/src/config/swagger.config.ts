import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description:
        "A comprehensive Todo application API with user authentication and task management",
      contact: {
        name: "API Support",
        email: "support@todoapp.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
      {
        url: "https://api.todoapp.com/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        // Error responses
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              example: "Detailed error information",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "email",
                  },
                  message: {
                    type: "string",
                    example: "Invalid email address",
                  },
                },
              },
            },
          },
        },
        // Auth schemas
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              example: "John Doe",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "User email address",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "password123",
              description: "User password",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "User email address",
            },
            password: {
              type: "string",
              example: "password123",
              description: "User password",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Authentication successful",
            },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  description: "JWT token for authentication",
                },
                user: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
        // User schema
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
              description: "User unique identifier",
            },
            name: {
              type: "string",
              example: "John Doe",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "User email address",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00.000Z",
              description: "User creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00.000Z",
              description: "User last update timestamp",
            },
          },
        },
        // Task schemas
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              example: "Complete project documentation",
              description: "Task title",
            },
            description: {
              type: "string",
              example: "Write comprehensive documentation for the API",
              description: "Task description",
            },
            priority: {
              type: "string",
              enum: ["baja", "media", "alta"],
              default: "media",
              example: "alta",
              description: "Task priority level",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              example: "2023-12-31T23:59:59.000Z",
              description: "Task due date",
            },
            categoryId: {
              type: "integer",
              example: 1,
              description: "Category ID for the task",
            },
            tagIds: {
              type: "array",
              items: {
                type: "integer",
              },
              example: [1, 2, 3],
              description: "Array of tag IDs associated with the task",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
              description: "Task unique identifier",
            },
            title: {
              type: "string",
              example: "Complete project documentation",
              description: "Task title",
            },
            description: {
              type: "string",
              example: "Write comprehensive documentation for the API",
              description: "Task description",
            },
            priority: {
              type: "string",
              enum: ["baja", "media", "alta"],
              example: "alta",
              description: "Task priority level",
            },
            status: {
              type: "string",
              enum: ["pendiente", "en_progreso", "completada", "cancelada"],
              example: "pendiente",
              description: "Task status",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              example: "2023-12-31T23:59:59.000Z",
              description: "Task due date",
            },
            userId: {
              type: "integer",
              example: 1,
              description: "User ID who owns the task",
            },
            categoryId: {
              type: "integer",
              example: 1,
              description: "Category ID for the task",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00.000Z",
              description: "Task creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00.000Z",
              description: "Task last update timestamp",
            },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Task created successfully",
            },
            data: {
              $ref: "#/components/schemas/Task",
            },
          },
        },
        TasksResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Tasks retrieved successfully",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/api/routes/*.ts", // Path to the API routes
    "./src/api/controllers/*.ts", // Path to the controllers
  ],
};

export const specs = swaggerJsdoc(options);
