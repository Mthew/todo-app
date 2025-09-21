import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error.handler";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware";
import { specs } from "../config/swagger.config";

const app = express();

// Core Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());

// Global rate limiting - applies to all routes
app.use(rateLimitMiddleware.general);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Todo App API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  })
);

// API Routes
app.use("/api", apiRouter);

// Root endpoint with API info
app.get("/", (req, res) => {
  res.json({
    message: "Todo App API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      tasks: "/api/tasks",
      tags: "/api/tags",
      category: "/api/category",
    },
  });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export { app };
