# Request Logging Implementation

This document explains the request logging implementation for the Todo App API.

## Overview

The request logging middleware provides comprehensive HTTP request and response logging with configurable detail levels, performance monitoring, and security-aware log sanitization.

## Features

- **🎨 Colorized Console Output**: Beautiful, readable logs with color-coded status codes and methods
- **📊 Performance Monitoring**: Automatic detection of slow requests with warnings
- **🔒 Security-First**: Automatic redaction of sensitive data (passwords, tokens, etc.)
- **🏷️ Request Tracking**: Unique request IDs for correlating logs
- **⚙️ Configurable Detail Levels**: From minimal to detailed logging
- **🌍 Environment-Aware**: Different configurations for dev/staging/production
- **🚫 Path Exclusion**: Skip logging for health checks, docs, etc.
- **👤 User Context**: Log authenticated user information

## Quick Start

The logging middleware is automatically configured and enabled in `app.ts`. No additional setup required!

```typescript
// Already configured in app.ts
import { createRequestLogger } from "./middlewares/request-logger.middleware";
import getLoggingConfig from "../config/logging.config";

const loggingConfig = getLoggingConfig();
const requestLogger = createRequestLogger(loggingConfig);
app.use(requestLogger);
```

## Log Levels

### 1. Minimal (`minimal`)

Perfect for production environments with minimal overhead.

**Logs:**

- Request method, URL, status code, duration
- Basic timestamp and IP address

**Example:**

```
✅ [2025-09-21T10:30:45.123Z] GET /api/tasks 200 45ms unknown bytes
```

### 2. Standard (`standard`)

Balanced logging for most environments.

**Logs:**

- All minimal features
- Request ID for tracking
- User information (if authenticated)
- Performance warnings
- Colorized output (in development)

**Example:**

```
🔄 [2025-09-21T10:30:45.123Z] [abc123def456] GET /api/tasks from 127.0.0.1
✅ [2025-09-21T10:30:45.168Z] [abc123def456] GET /api/tasks 200 45ms 1024 bytes
   User: {"id": 123, "email": "user@example.com"}
```

### 3. Detailed (`detailed`)

Comprehensive logging for debugging and development.

**Logs:**

- All standard features
- Request headers (sanitized)
- Request body (sanitized)
- Response body (truncated if large)
- User agent information

**Example:**

```
🔄 [2025-09-21T10:30:45.123Z] [abc123def456] POST /api/auth/login from 127.0.0.1
   Body: {"email": "user@example.com", "password": "[REDACTED]"}
   User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
✅ [2025-09-21T10:30:45.168Z] [abc123def456] POST /api/auth/login 200 45ms 256 bytes
   Response: {"token": "[REDACTED]", "user": {"id": 123, "email": "user@example.com"}}
```

## Environment Configuration

### Development

- **Level**: `detailed`
- **Colors**: Enabled
- **Body Logging**: Enabled
- **Headers**: Disabled (for security)
- **User Info**: Enabled

### Staging

- **Level**: `standard`
- **Colors**: Disabled
- **Body Logging**: Disabled
- **Headers**: Disabled
- **User Info**: Enabled

### Production

- **Level**: `minimal`
- **Colors**: Disabled
- **Body Logging**: Disabled
- **Headers**: Disabled
- **User Info**: Disabled
- **Additional Exclusions**: Health checks, root endpoint

### Testing

- **Logging**: Completely disabled

## Configuration Options

### Environment Variables

Control logging behavior with these environment variables:

```env
# Basic Configuration
NODE_ENV=development
LOGGING_ENABLED=true
LOG_LEVEL=standard

# Feature Toggles
LOG_INCLUDE_BODY=false
LOG_INCLUDE_HEADERS=false
LOG_INCLUDE_USER_INFO=true
LOG_COLOR_OUTPUT=true

# Performance Thresholds
SLOW_REQUEST_THRESHOLD=5000
WARNING_REQUEST_THRESHOLD=1000

# Path Exclusions
LOG_EXCLUDE_PATHS=/health,/metrics,/favicon.ico
```

### Programmatic Configuration

```typescript
import { createRequestLogger } from "./middlewares/request-logger.middleware";

const customLogger = createRequestLogger({
  enabled: true,
  level: "detailed",
  includeBody: true,
  includeHeaders: false,
  includeUserInfo: true,
  colorOutput: true,
  excludePaths: ["/health", "/docs"],
});

app.use(customLogger);
```

## Security Features

### Automatic Data Sanitization

Sensitive fields are automatically redacted from logs:

**Request Body Fields:**

- `password`
- `token`
- `authorization`
- `secret`
- `key`
- `apiKey`
- `accessToken`

**Headers:**

- `authorization`
- `cookie`
- `x-api-key`
- `x-auth-token`
- `x-access-token`

**Before Sanitization:**

```json
{
  "email": "user@example.com",
  "password": "secretpassword123"
}
```

**After Sanitization:**

```json
{
  "email": "user@example.com",
  "password": "[REDACTED]"
}
```

## Performance Monitoring

### Automatic Performance Warnings

The middleware automatically detects and warns about slow requests:

- **⚡ Performance Warning**: Requests taking 1-5 seconds
- **🔥 Slow Request Warning**: Requests taking over 5 seconds

**Example:**

```
🔥 [2025-09-21T10:30:45.168Z] [abc123def456] GET /api/reports/export 200 6.45s 2048 bytes
   🔥 SLOW REQUEST WARNING: 6.45s
```

### Thresholds

Customize performance thresholds:

```env
WARNING_REQUEST_THRESHOLD=1000  # 1 second
SLOW_REQUEST_THRESHOLD=5000     # 5 seconds
```

## Request Tracking

### Unique Request IDs

Every request gets a unique ID for correlation:

```
🔄 [timestamp] [abc123def456] GET /api/tasks ...
✅ [timestamp] [abc123def456] GET /api/tasks 200 ...
```

### Request ID in Headers

Request IDs can be included in response headers:

```typescript
// The request ID is available in req.requestId
app.use((req, res, next) => {
  res.setHeader("X-Request-ID", req.requestId);
  next();
});
```

## Log Icons and Colors

### Status Code Icons

- ✅ **2xx Success**: Green
- ↩️ **3xx Redirect**: Cyan
- ⚠️ **4xx Client Error**: Yellow
- 🔥 **5xx Server Error**: Red

### HTTP Method Colors

- 🟢 **GET**: Green
- 🔵 **POST**: Blue
- 🟡 **PUT**: Yellow
- 🟣 **PATCH**: Magenta
- 🔴 **DELETE**: Red

## Predefined Configurations

### Available Presets

```typescript
import { loggingPresets } from "./middlewares/request-logger.middleware";

// Use predefined configurations
app.use(loggingPresets.minimal); // Production-safe minimal logging
app.use(loggingPresets.standard); // Balanced development logging
app.use(loggingPresets.detailed); // Full debugging information
app.use(loggingPresets.production); // Production-optimized
```

## File Structure

```
src/
├── config/
│   └── logging.config.ts           # Logging configuration
├── api/
│   ├── middlewares/
│   │   └── request-logger.middleware.ts  # Main logging middleware
│   └── app.ts                      # Middleware integration
└── doc/
    └── REQUEST_LOGGING.md          # This documentation
```

## Usage Examples

### Custom Logging for Specific Routes

```typescript
import { createRequestLogger } from "../middlewares/request-logger.middleware";

// Custom logger for admin routes
const adminLogger = createRequestLogger({
  level: "detailed",
  includeBody: true,
  includeHeaders: true,
});

adminRouter.use(adminLogger);
```

### Conditional Logging

```typescript
// Only log in development
if (process.env.NODE_ENV === "development") {
  app.use(loggingPresets.detailed);
}
```

### Custom Exclusions

```typescript
const customLogger = createRequestLogger({
  excludePaths: ["/health", "/metrics", "/api-docs", "/special-endpoint"],
});
```

## Testing

### Disable Logging in Tests

```typescript
// In test environment
if (process.env.NODE_ENV === "test") {
  // Logging is automatically disabled
  // No additional configuration needed
}
```

### Manual Testing

Test different log levels:

```bash
# Test with different log levels
LOG_LEVEL=minimal npm run dev
LOG_LEVEL=standard npm run dev
LOG_LEVEL=detailed npm run dev

# Test with body logging
LOG_INCLUDE_BODY=true npm run dev

# Test without colors
LOG_COLOR_OUTPUT=false npm run dev
```

## Best Practices

### 1. Production Settings

- Use `minimal` or `standard` level
- Disable body and header logging
- Disable color output
- Exclude health check endpoints

### 2. Development Settings

- Use `detailed` level for debugging
- Enable color output
- Include user information
- Monitor performance warnings

### 3. Security

- Never log sensitive data in production
- Regularly review logged fields
- Use environment variables for configuration
- Exclude authentication endpoints from detailed logging

### 4. Performance

- Use minimal logging in high-traffic production
- Exclude static assets and health checks
- Monitor log volume and adjust accordingly

## Troubleshooting

### Common Issues

**1. Too Much Log Output**

```env
# Reduce log level
LOG_LEVEL=minimal

# Exclude more paths
LOG_EXCLUDE_PATHS=/health,/metrics,/static,/assets
```

**2. Missing User Information**

```env
# Ensure user info is enabled
LOG_INCLUDE_USER_INFO=true

# Check if authentication middleware runs before logging
```

**3. No Colors in Output**

```env
# Enable colors
LOG_COLOR_OUTPUT=true

# Note: Colors are auto-disabled in production
```

**4. Performance Issues**

```env
# Disable detailed logging
LOG_LEVEL=standard
LOG_INCLUDE_BODY=false
LOG_INCLUDE_HEADERS=false
```

### Debug Mode

Enable maximum logging for debugging:

```env
NODE_ENV=development
LOG_LEVEL=detailed
LOG_INCLUDE_BODY=true
LOG_INCLUDE_HEADERS=true
LOG_INCLUDE_USER_INFO=true
LOG_COLOR_OUTPUT=true
```

## Future Enhancements

### Planned Features

1. **File Logging**: Write logs to rotating files
2. **Structured Logging**: JSON format for log aggregation
3. **Log Aggregation**: Integration with ELK stack or similar
4. **Metrics Collection**: Request metrics and analytics
5. **Custom Formatters**: User-defined log formats
6. **Log Sampling**: Sample high-volume endpoints

### File Logging (Future)

Configuration ready for file logging:

```typescript
// In logging.config.ts
export const fileLoggingConfig = {
  enabled: process.env.FILE_LOGGING_ENABLED === "true",
  directory: process.env.LOG_DIRECTORY || "./logs",
  filename: process.env.LOG_FILENAME || "app.log",
  maxSize: process.env.LOG_MAX_SIZE || "10MB",
  maxFiles: parseInt(process.env.LOG_MAX_FILES || "5"),
  datePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",
};
```

## Integration with Monitoring

### Log Aggregation

The logging format is designed to be easily parsed by log aggregation tools:

```json
{
  "timestamp": "2025-09-21T10:30:45.123Z",
  "requestId": "abc123def456",
  "method": "GET",
  "url": "/api/tasks",
  "status": 200,
  "duration": 45,
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "userId": 123
}
```

### Metrics Integration

Request data can be used for metrics:

- Response time percentiles
- Error rate tracking
- Endpoint usage statistics
- User activity patterns

The request logging middleware provides comprehensive, secure, and performant logging for your Todo App API. It's designed to grow with your application from development through production deployment.
