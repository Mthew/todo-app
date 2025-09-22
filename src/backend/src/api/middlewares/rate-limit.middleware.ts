import rateLimit, {
  RateLimitRequestHandler,
  rateLimit as rateLimitNamed,
} from "express-rate-limit";
import { Request, Response } from "express";
import { TooManyRequestsError } from "../../utils/AppError";
import {
  getEnvironmentConfig,
  RateLimitSettings,
} from "../../config/rate-limit.config";

/**
 * Rate limiting configuration options
 */
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Custom error message
  standardHeaders?: boolean; // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders?: boolean; // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests?: boolean; // Don't count successful requests (responses with HTTP status < 400)
  skipFailedRequests?: boolean; // Don't count failed requests (responses with HTTP status >= 400)
}

// Get environment-specific configuration
const config = getEnvironmentConfig();

/**
 * Create a rate limit handler from settings
 */
const createRateLimitFromSettings = (
  settings: RateLimitSettings
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: settings.windowMs,
    max: settings.max,
    message: settings.message,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: settings.skipSuccessfulRequests ?? false,
    skipFailedRequests: settings.skipFailedRequests ?? false,

    // Custom handler for rate limit exceeded
    handler: (req: Request, res: Response) => {
      const error = new TooManyRequestsError(settings.message);

      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
        retryAfter: Math.round(settings.windowMs / 1000), // seconds
      });
    },

    // Generate unique key for each user/IP
    keyGenerator: (req: Request) => {
      // If user is authenticated, use user ID, otherwise use IP
      if (req.user?.id) {
        return `user_${req.user.id}`;
      }
      // Use req.ip which handles IPv6 properly
      return req.ip || "unknown";
    },
  });
};

/**
 * Predefined rate limiters for different types of endpoints
 */

// General API rate limiter
export const generalRateLimit = createRateLimitFromSettings(config.general);

// Authentication rate limiter
export const authRateLimit = createRateLimitFromSettings(config.auth);

// Registration rate limiter
export const registrationRateLimit = createRateLimitFromSettings(
  config.registration
);

// Password reset rate limiter
export const passwordResetRateLimit = createRateLimitFromSettings(
  config.passwordReset
);

// CRUD operations rate limiter
export const crudRateLimit = createRateLimitFromSettings(config.crud);

// Sensitive operations rate limiter
export const sensitiveRateLimit = createRateLimitFromSettings(config.sensitive);

/**
 * Create custom rate limiter with specific configuration
 */
export const createCustomRateLimit = (
  settings: RateLimitSettings
): RateLimitRequestHandler => {
  return createRateLimitFromSettings(settings);
};

/**
 * Rate limiting middleware factory for different scenarios
 */
export const rateLimitMiddleware = {
  general: generalRateLimit,
  auth: authRateLimit,
  registration: registrationRateLimit,
  passwordReset: passwordResetRateLimit,
  crud: crudRateLimit,
  sensitive: sensitiveRateLimit,
  custom: createCustomRateLimit,
};
