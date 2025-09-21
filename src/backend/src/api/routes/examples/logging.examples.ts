/**
 * Example: Different ways to use request logging middleware
 *
 * This file demonstrates various logging configurations and usage patterns
 * for the Todo App API request logging system.
 */

import { Router } from "express";
import {
  createRequestLogger,
  loggingPresets,
} from "../../middlewares/request-logger.middleware";

const exampleRouter = Router();

// Example 1: Using predefined logging presets
// ============================================

// Minimal logging for production-like environments
exampleRouter.use("/api/v1/minimal", loggingPresets.minimal);

// Standard logging for general development
exampleRouter.use("/api/v1/standard", loggingPresets.standard);

// Detailed logging for debugging
exampleRouter.use("/api/v1/detailed", loggingPresets.detailed);

// Production-safe logging
exampleRouter.use("/api/v1/production", loggingPresets.production);

// Example 2: Custom logging configurations
// =======================================

// Debug logging for admin routes
const adminLogger = createRequestLogger({
  enabled: true,
  level: "detailed",
  includeBody: true,
  includeHeaders: true,
  includeUserInfo: true,
  colorOutput: true,
  excludePaths: [], // Log everything for admin routes
});

exampleRouter.use("/admin", adminLogger);

// API-specific logging with body inclusion
const apiLogger = createRequestLogger({
  enabled: true,
  level: "standard",
  includeBody: true,
  includeHeaders: false,
  includeUserInfo: true,
  colorOutput: process.env.NODE_ENV === "development",
  excludePaths: ["/health", "/ping"],
});

exampleRouter.use("/api/v2", apiLogger);

// Minimal logging for public endpoints
const publicLogger = createRequestLogger({
  enabled: true,
  level: "minimal",
  includeBody: false,
  includeHeaders: false,
  includeUserInfo: false,
  colorOutput: false,
  excludePaths: ["/favicon.ico", "/robots.txt"],
});

exampleRouter.use("/public", publicLogger);

// Example 3: Environment-specific logging
// ======================================

const environmentLogger = (() => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return createRequestLogger({
        enabled: true,
        level: "minimal",
        includeBody: false,
        includeHeaders: false,
        includeUserInfo: false,
        colorOutput: false,
        excludePaths: ["/health", "/metrics", "/favicon.ico", "/"],
      });

    case "staging":
      return createRequestLogger({
        enabled: true,
        level: "standard",
        includeBody: false,
        includeHeaders: false,
        includeUserInfo: true,
        colorOutput: false,
        excludePaths: ["/health", "/metrics"],
      });

    case "development":
    default:
      return createRequestLogger({
        enabled: true,
        level: "detailed",
        includeBody: true,
        includeHeaders: false, // Still keep headers off for security
        includeUserInfo: true,
        colorOutput: true,
        excludePaths: ["/api-docs"],
      });
  }
})();

exampleRouter.use("/api/v3", environmentLogger);

// Example 4: Conditional logging based on user role
// =================================================

const conditionalLogger = (req: any, res: any, next: any) => {
  // Check if user is admin or has special privileges
  const isAdmin = req.user?.role === "admin";
  const isDebugMode = req.headers["x-debug-mode"] === "true";

  if (isAdmin || isDebugMode) {
    // Use detailed logging for admins or debug mode
    return loggingPresets.detailed(req, res, next);
  } else {
    // Use standard logging for regular users
    return loggingPresets.standard(req, res, next);
  }
};

exampleRouter.use("/api/v4", conditionalLogger);

// Example 5: Route-specific logging
// ================================

// Different logging for different types of operations
exampleRouter.use(
  "/api/auth",
  createRequestLogger({
    level: "standard",
    includeBody: false, // Don't log auth request bodies (passwords)
    includeUserInfo: false, // User not authenticated yet
    excludePaths: [],
  })
);

exampleRouter.use(
  "/api/tasks",
  createRequestLogger({
    level: "standard",
    includeBody: process.env.NODE_ENV === "development", // Log bodies in dev
    includeUserInfo: true,
    excludePaths: [],
  })
);

exampleRouter.use(
  "/api/reports",
  createRequestLogger({
    level: "detailed", // Reports are important operations
    includeBody: true,
    includeUserInfo: true,
    excludePaths: [],
  })
);

// Example 6: Performance monitoring focus
// ======================================

const performanceLogger = createRequestLogger({
  enabled: true,
  level: "standard",
  includeBody: false,
  includeHeaders: false,
  includeUserInfo: true,
  colorOutput: true,
  excludePaths: ["/health"],
});

// Add custom performance tracking
const performanceTracker = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    // Log slow queries to database or file
    if (duration > 2000) {
      console.log(
        `🐌 SLOW ENDPOINT: ${req.method} ${req.path} took ${duration}ms`
      );
    }
  });

  next();
};

exampleRouter.use("/api/v5", performanceLogger, performanceTracker);

// Example 7: Feature flag based logging
// ====================================

const featureFlagLogger = (req: any, res: any, next: any) => {
  // Check feature flags from environment or database
  const enableDetailedLogging = process.env.FEATURE_DETAILED_LOGGING === "true";
  const enableBodyLogging = process.env.FEATURE_BODY_LOGGING === "true";

  const logger = createRequestLogger({
    enabled: true,
    level: enableDetailedLogging ? "detailed" : "standard",
    includeBody: enableBodyLogging,
    includeHeaders: enableDetailedLogging,
    includeUserInfo: true,
    colorOutput: process.env.NODE_ENV === "development",
    excludePaths: ["/health"],
  });

  return logger(req, res, next);
};

exampleRouter.use("/api/v6", featureFlagLogger);

// Example 8: Request size based logging
// ===================================

const sizeBased = (req: any, res: any, next: any) => {
  const contentLength = parseInt(req.get("content-length") || "0");

  // Use detailed logging for large requests
  if (contentLength > 10000) {
    // 10KB
    return loggingPresets.detailed(req, res, next);
  } else {
    return loggingPresets.standard(req, res, next);
  }
};

exampleRouter.use("/api/uploads", sizeBased);

export { exampleRouter };

/**
 * Configuration Examples Summary:
 *
 * 1. Predefined Presets:
 *    - loggingPresets.minimal
 *    - loggingPresets.standard
 *    - loggingPresets.detailed
 *    - loggingPresets.production
 *
 * 2. Custom Configurations:
 *    - createRequestLogger(config)
 *    - Environment-specific settings
 *    - Role-based logging
 *    - Feature flag integration
 *
 * 3. Advanced Patterns:
 *    - Conditional logging middleware
 *    - Performance monitoring
 *    - Request size based decisions
 *    - Route-specific configurations
 *
 * 4. Best Practices:
 *    - Exclude sensitive endpoints from body logging
 *    - Use minimal logging in production
 *    - Enable detailed logging for debugging
 *    - Consider performance impact
 *    - Implement proper security measures
 */
