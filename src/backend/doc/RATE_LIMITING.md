# Rate Limiting Implementation

This document explains the rate limiting implementation for the Todo App API.

## Overview

Rate limiting has been implemented to protect the API from abuse, ensure fair usage, and maintain server performance. The implementation uses the `express-rate-limit` middleware with custom configurations for different types of endpoints.

## Features

- **Multi-tier Rate Limiting**: Different limits for different endpoint types
- **User-based Limiting**: Authenticated users are limited per user ID, not IP
- **IP-based Limiting**: Unauthenticated requests are limited per IP address
- **Environment-specific Configuration**: Different limits for development, staging, and production
- **Custom Error Handling**: Consistent error responses with retry information
- **Configurable Settings**: Easy to adjust limits without code changes

## Rate Limit Tiers

### 1. General API Endpoints

- **Window**: 15 minutes
- **Limit**: 100 requests (development: 200, production: 80)
- **Applied to**: All API endpoints as a base limit

### 2. Authentication Endpoints

- **Window**: 15 minutes
- **Limit**: 5 attempts
- **Applied to**: `/api/auth/login`
- **Special**: Successful logins don't count against the limit

### 3. Registration Endpoints

- **Window**: 1 hour
- **Limit**: 3 registrations
- **Applied to**: `/api/auth/register`

### 4. CRUD Operations

- **Window**: 15 minutes
- **Limit**: 200 requests (development: 500, production: 150)
- **Applied to**: `/api/tasks`, `/api/tags`, `/api/category`

### 5. Sensitive Operations

- **Window**: 5 minutes
- **Limit**: 10 requests
- **Applied to**: Future sensitive endpoints (bulk operations, exports, etc.)

## Implementation Details

### File Structure

```
src/
├── config/
│   └── rate-limit.config.ts         # Configuration settings
├── api/
│   ├── middlewares/
│   │   └── rate-limit.middleware.ts  # Rate limiting middleware
│   ├── routes/
│   │   ├── auth.routes.ts           # Auth routes with rate limiting
│   │   ├── task.routes.ts           # Task routes with rate limiting
│   │   ├── tag.routes.ts            # Tag routes with rate limiting
│   │   └── category.routes.ts       # Category routes with rate limiting
│   └── app.ts                       # Global rate limiting setup
└── utils/
    └── AppError.ts                  # Custom error classes
```

### Middleware Usage

#### Global Rate Limiting

All API endpoints have a base rate limit applied in `app.ts`:

```typescript
app.use(rateLimitMiddleware.general);
```

#### Route-specific Rate Limiting

Individual routes have specific limits:

```typescript
// Authentication routes
authRouter.post(
  "/login",
  rateLimitMiddleware.auth,
  validate(LoginSchema),
  authController.login
);
authRouter.post(
  "/register",
  rateLimitMiddleware.registration,
  validate(RegisterUserSchema),
  authController.register
);

// CRUD routes
taskRouter.use(rateLimitMiddleware.crud);
tagRouter.use(rateLimitMiddleware.crud);
categoryRouter.use(rateLimitMiddleware.crud);
```

## Configuration

### Environment-based Configuration

The rate limiting configuration automatically adjusts based on the `NODE_ENV`:

- **Development**: More relaxed limits for testing
- **Staging**: Moderate limits for testing
- **Production**: Stricter limits for security

### Custom Configuration

You can create custom rate limits for specific endpoints:

```typescript
import { createCustomRateLimit } from "../middlewares/rate-limit.middleware";

const customLimit = createCustomRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50,
  message: "Custom rate limit exceeded",
});

router.get("/special-endpoint", customLimit, controller.method);
```

## Error Responses

When rate limit is exceeded, the API returns:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again in 15 minutes.",
  "retryAfter": 900
}
```

**HTTP Status Code**: 429 (Too Many Requests)

## Headers

The middleware adds standard rate limit headers to responses:

- `RateLimit-Limit`: The rate limit ceiling for that given endpoint
- `RateLimit-Remaining`: The number of requests left for the time window
- `RateLimit-Reset`: The time when the rate limit resets (as a Unix timestamp)

## Key Generation Strategy

Rate limits are applied based on:

1. **Authenticated Users**: User ID (`user_123`)
2. **Unauthenticated Users**: IP address

This ensures that authenticated users have individual limits and can't be affected by other users from the same IP (e.g., office networks).

## Best Practices

### 1. Monitoring

- Monitor rate limit violations in logs
- Track which endpoints are being hit most frequently
- Adjust limits based on actual usage patterns

### 2. User Communication

- Provide clear error messages
- Include retry information in responses
- Consider implementing exponential backoff on the client side

### 3. Exemptions

- Consider exempting certain IPs (e.g., monitoring services)
- Implement different limits for premium users if applicable

### 4. Scaling Considerations

- For multi-server deployments, consider using Redis as a shared store
- Current implementation uses in-memory store (suitable for single server)

## Future Enhancements

### 1. Redis Integration

For distributed deployments, implement Redis-based rate limiting:

```typescript
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL);

const store = new RedisStore({
  sendCommand: (...args: string[]) => redisClient.call(...args),
});
```

### 2. Dynamic Rate Limiting

Implement dynamic rate limiting based on:

- User subscription tier
- Server load
- Time of day

### 3. Rate Limit Analytics

Add analytics to track:

- Rate limit violations
- Endpoint usage patterns
- User behavior patterns

## Environment Variables

Configure rate limiting behavior with environment variables:

```env
NODE_ENV=production
USE_MEMORY_STORE=true
USE_REDIS_STORE=false
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Testing Rate Limits

To test rate limiting in development:

1. Set lower limits in configuration
2. Use tools like `curl` or Postman to send rapid requests
3. Verify error responses and headers
4. Test with both authenticated and unauthenticated requests

Example test script:

```bash
# Test authentication rate limit
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "%{http_code}\n"
done
```

## Troubleshooting

### Common Issues

1. **Rate limits too strict**: Adjust limits in `rate-limit.config.ts`
2. **Shared IP issues**: Ensure authenticated users use user-based keys
3. **Memory usage**: Consider Redis for high-traffic applications
4. **False positives**: Review key generation logic and exemption rules

### Debugging

Enable detailed logging to debug rate limiting issues:

```typescript
// Add to rate limit handler
console.log(
  `Rate limit hit for key: ${keyGenerator(req)}, endpoint: ${req.path}`
);
```

## Security Considerations

1. **DDoS Protection**: Rate limiting provides basic DDoS protection
2. **Brute Force Prevention**: Authentication rate limits prevent brute force attacks
3. **Resource Protection**: Prevents resource exhaustion from excessive requests
4. **Fair Usage**: Ensures API availability for all users

Rate limiting is a crucial security and performance feature that should be monitored and adjusted based on your application's specific needs and usage patterns.
