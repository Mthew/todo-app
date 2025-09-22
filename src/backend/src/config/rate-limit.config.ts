/**
 * Rate limiting configuration
 *
 * This file contains all rate limiting settings for the API.
 * These values can be adjusted based on your application's needs and traffic patterns.
 */

export interface RateLimitSettings {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Rate limiting configuration for different endpoint types
 */
export const rateLimitConfig = {
  // General API endpoints - moderate limits
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: "Too many requests from this IP, please try again in 15 minutes.",
  } as RateLimitSettings,

  // Authentication endpoints - strict limits for security
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message:
      "Too many authentication attempts from this IP, please try again in 15 minutes.",
    skipSuccessfulRequests: true, // Don't count successful logins
  } as RateLimitSettings,

  // Registration endpoint - very strict to prevent spam
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour
    message:
      "Too many registration attempts from this IP, please try again in 1 hour.",
  } as RateLimitSettings,

  // Password reset - strict to prevent abuse
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message:
      "Too many password reset attempts from this IP, please try again in 1 hour.",
  } as RateLimitSettings,

  // CRUD operations - higher limits for normal operations
  crud: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per window
    message:
      "Too many API requests from this IP, please try again in 15 minutes.",
  } as RateLimitSettings,

  // Sensitive operations - tighter control
  sensitive: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 requests per window
    message:
      "Too many requests for sensitive operations, please try again in 5 minutes.",
  } as RateLimitSettings,

  // File upload endpoints (if any) - strict due to resource usage
  upload: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    message:
      "Too many file upload requests from this IP, please try again in 15 minutes.",
  } as RateLimitSettings,

  // Search endpoints - moderate limits
  search: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50, // 50 searches per window
    message:
      "Too many search requests from this IP, please try again in 10 minutes.",
  } as RateLimitSettings,
};

/**
 * Environment-based configuration
 * Adjust rates based on deployment environment
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      // Stricter limits in production
      return {
        ...rateLimitConfig,
        general: { ...rateLimitConfig.general, max: 80 },
        crud: { ...rateLimitConfig.crud, max: 150 },
      };

    case "staging":
      // Moderate limits for staging
      return {
        ...rateLimitConfig,
        general: { ...rateLimitConfig.general, max: 120 },
        crud: { ...rateLimitConfig.crud, max: 250 },
      };

    case "development":
    default:
      // More relaxed limits for development
      return {
        ...rateLimitConfig,
        general: { ...rateLimitConfig.general, max: 200 },
        crud: { ...rateLimitConfig.crud, max: 500 },
      };
  }
};

/**
 * Custom configuration for specific endpoints
 * Use this to override default settings for specific routes
 */
export const customEndpointLimits = {
  // Example: Custom limit for a specific endpoint
  "/api/tasks/bulk-create": {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Only 5 bulk operations per 5 minutes
    message: "Too many bulk operations, please try again in 5 minutes.",
  } as RateLimitSettings,

  // Example: Custom limit for report generation
  "/api/tasks/export": {
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 3, // Only 3 exports per 30 minutes
    message: "Too many export requests, please try again in 30 minutes.",
  } as RateLimitSettings,
};

/**
 * Redis configuration for distributed rate limiting
 * (Optional - for multi-server deployments)
 */
export const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || "0"),
  keyPrefix: "rate_limit:",
};

/**
 * Rate limiting store configuration
 */
export const storeConfig = {
  // Use memory store for single server deployment
  useMemoryStore:
    process.env.USE_MEMORY_STORE === "true" ||
    process.env.NODE_ENV === "development",

  // Use Redis for distributed deployment
  useRedisStore:
    process.env.USE_REDIS_STORE === "true" &&
    process.env.NODE_ENV === "production",

  // Store configuration
  redis: redisConfig,
};
