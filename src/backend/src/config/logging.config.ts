/**
 * Logging configuration for the Todo App API
 *
 * This file centralizes all logging configuration options.
 * Environment variables can override these default settings.
 */

import { LoggingConfig } from "../api/middlewares/request-logger.middleware";

/**
 * Environment-based logging configuration
 */
export const getLoggingConfig = (): LoggingConfig => {
  const env = process.env.NODE_ENV || "development";

  // Base configuration
  const baseConfig: LoggingConfig = {
    enabled: process.env.LOGGING_ENABLED !== "false",
    level: (process.env.LOG_LEVEL as any) || "standard",
    includeBody: process.env.LOG_INCLUDE_BODY === "true",
    includeHeaders: process.env.LOG_INCLUDE_HEADERS === "true",
    includeUserInfo: process.env.LOG_INCLUDE_USER_INFO !== "false",
    colorOutput: process.env.LOG_COLOR_OUTPUT !== "false",
    excludePaths: [
      "/api-docs",
      "/favicon.ico",
      "/health",
      "/metrics",
      ...(process.env.LOG_EXCLUDE_PATHS?.split(",") || []),
    ],
  };

  // Environment-specific overrides
  switch (env) {
    case "production":
      return {
        ...baseConfig,
        level: "minimal",
        includeBody: false,
        includeHeaders: false,
        includeUserInfo: false,
        colorOutput: false,
        excludePaths: [
          ...baseConfig.excludePaths,
          "/", // Exclude root health check in production
        ],
      };

    case "staging":
      return {
        ...baseConfig,
        level: "standard",
        includeBody: false,
        includeHeaders: false,
        includeUserInfo: true,
        colorOutput: false,
      };

    case "test":
      return {
        ...baseConfig,
        enabled: false, // Disable logging during tests
      };

    case "development":
    default:
      return {
        ...baseConfig,
        level: "detailed",
        includeBody: true,
        includeHeaders: false, // Keep headers off by default for security
        includeUserInfo: true,
        colorOutput: true,
      };
  }
};

/**
 * Log level definitions
 */
export const logLevels = {
  minimal: {
    description: "Only basic request/response logging",
    includes: ["method", "url", "status", "duration", "ip"],
  },
  standard: {
    description: "Standard logging with user info and performance warnings",
    includes: [
      "method",
      "url",
      "status",
      "duration",
      "ip",
      "userInfo",
      "performanceWarnings",
    ],
  },
  detailed: {
    description: "Comprehensive logging including body and headers",
    includes: [
      "method",
      "url",
      "status",
      "duration",
      "ip",
      "userInfo",
      "headers",
      "body",
      "response",
    ],
  },
};

/**
 * Performance thresholds for warnings
 */
export const performanceThresholds = {
  slow: parseInt(process.env.SLOW_REQUEST_THRESHOLD || "5000"), // 5 seconds
  warning: parseInt(process.env.WARNING_REQUEST_THRESHOLD || "1000"), // 1 second
};

/**
 * Sensitive fields that should be redacted in logs
 */
export const sensitiveFields = {
  body: [
    "password",
    "token",
    "authorization",
    "secret",
    "key",
    "apiKey",
    "accessToken",
  ],
  headers: [
    "authorization",
    "cookie",
    "x-api-key",
    "x-auth-token",
    "x-access-token",
  ],
  query: ["password", "token", "secret", "key"],
};

/**
 * Request ID configuration
 */
export const requestIdConfig = {
  headerName: "x-request-id",
  length: 12,
  includeTimestamp: false,
};

/**
 * Color scheme for console output
 */
export const colorScheme = {
  timestamp: "\x1b[90m", // gray
  requestId: "\x1b[36m", // cyan
  method: {
    GET: "\x1b[32m", // green
    POST: "\x1b[34m", // blue
    PUT: "\x1b[33m", // yellow
    PATCH: "\x1b[35m", // magenta
    DELETE: "\x1b[31m", // red
    default: "\x1b[37m", // white
  },
  status: {
    success: "\x1b[32m", // green (2xx)
    redirect: "\x1b[36m", // cyan (3xx)
    clientError: "\x1b[33m", // yellow (4xx)
    serverError: "\x1b[31m", // red (5xx)
    default: "\x1b[37m", // white
  },
  performance: {
    fast: "\x1b[32m", // green
    normal: "\x1b[37m", // white
    slow: "\x1b[33m", // yellow
    critical: "\x1b[31m", // red
  },
  reset: "\x1b[0m",
};

/**
 * Log format templates
 */
export const logFormats = {
  minimal: "[{timestamp}] {method} {url} {status} {duration}",
  standard:
    "[{timestamp}] [{requestId}] {method} {url} {status} {duration} {ip}",
  detailed:
    "[{timestamp}] [{requestId}] {method} {url} {status} {duration} {ip} {userAgent}",
};

/**
 * File logging configuration (for future enhancement)
 */
export const fileLoggingConfig = {
  enabled: process.env.FILE_LOGGING_ENABLED === "true",
  directory: process.env.LOG_DIRECTORY || "./logs",
  filename: process.env.LOG_FILENAME || "app.log",
  maxSize: process.env.LOG_MAX_SIZE || "10MB",
  maxFiles: parseInt(process.env.LOG_MAX_FILES || "5"),
  datePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",
};

/**
 * Export the main configuration function
 */
export { getLoggingConfig as default };
