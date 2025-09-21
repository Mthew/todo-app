/**
 * Example: How to add custom rate limiting to specific endpoints
 *
 * This file demonstrates various ways to implement rate limiting
 * for different scenarios in your Todo App API.
 */

import { Router } from "express";
import {
  rateLimitMiddleware,
  createCustomRateLimit,
} from "../../middlewares/rate-limit.middleware";

const exampleRouter = Router();

// Example 1: Using predefined rate limiters
// Apply strict authentication rate limiting to login
exampleRouter.post("/login", rateLimitMiddleware.auth, (req, res) => {
  res.json({ message: "Login endpoint with strict rate limiting" });
});

// Example 2: Custom rate limiting for specific operations
const bulkOperationLimit = createCustomRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // Only 2 bulk operations per 5 minutes
  message:
    "Bulk operations are limited to 2 per 5 minutes to prevent server overload.",
});

exampleRouter.post("/tasks/bulk", bulkOperationLimit, (req, res) => {
  res.json({ message: "Bulk operation with custom rate limiting" });
});

// Example 3: Multiple rate limiters (most restrictive applies)
const reportGenerationLimit = createCustomRateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // Maximum 3 reports per 30 minutes
  message: "Report generation is limited to 3 per 30 minutes.",
});

exampleRouter.get(
  "/reports/export",
  rateLimitMiddleware.general, // General API limit
  reportGenerationLimit, // Specific operation limit
  (req, res) => {
    res.json({ message: "Report export with multiple rate limits" });
  }
);

// Example 4: Rate limiting for file uploads
const fileUploadLimit = createCustomRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 file uploads per 15 minutes
  message: "File uploads are limited to 10 per 15 minutes.",
});

exampleRouter.post("/files/upload", fileUploadLimit, (req, res) => {
  res.json({ message: "File upload with rate limiting" });
});

// Example 5: Search endpoint with moderate rate limiting
const searchLimit = createCustomRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 searches per 10 minutes
  message: "Search operations are limited to 50 per 10 minutes.",
});

exampleRouter.get("/search", searchLimit, (req, res) => {
  res.json({ message: "Search with rate limiting" });
});

// Example 6: Admin endpoints with very strict limits
const adminActionLimit = createCustomRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 admin actions per hour
  message: "Admin actions are strictly limited to 5 per hour.",
});

exampleRouter.delete("/admin/users/:id", adminActionLimit, (req, res) => {
  res.json({ message: "Admin action with strict rate limiting" });
});

export { exampleRouter };

/**
 * Usage Patterns Summary:
 *
 * 1. Predefined Limiters:
 *    - rateLimitMiddleware.general (100 req/15min)
 *    - rateLimitMiddleware.auth (5 req/15min)
 *    - rateLimitMiddleware.registration (3 req/hour)
 *    - rateLimitMiddleware.crud (200 req/15min)
 *    - rateLimitMiddleware.sensitive (10 req/5min)
 *
 * 2. Custom Limiters:
 *    - Use createCustomRateLimit() for specific needs
 *    - Define window, max requests, and custom message
 *
 * 3. Multiple Limiters:
 *    - Apply multiple limiters to same endpoint
 *    - Most restrictive limit applies
 *
 * 4. Best Practices:
 *    - Apply general limits globally
 *    - Add specific limits for sensitive operations
 *    - Use meaningful error messages
 *    - Monitor and adjust based on usage
 */
