import { Request, Response, NextFunction } from "express";

/**
 * Request logging configuration
 */
interface LoggingConfig {
  enabled: boolean;
  level: "minimal" | "standard" | "detailed";
  includeBody: boolean;
  includeHeaders: boolean;
  includeUserInfo: boolean;
  colorOutput: boolean;
  excludePaths: string[];
}

/**
 * Console colors for better log readability
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

/**
 * Get status code color based on HTTP status
 */
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  if (statusCode >= 200) return colors.green;
  return colors.white;
};

/**
 * Get HTTP method color
 */
const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case "GET":
      return colors.green;
    case "POST":
      return colors.blue;
    case "PUT":
      return colors.yellow;
    case "PATCH":
      return colors.magenta;
    case "DELETE":
      return colors.red;
    default:
      return colors.white;
  }
};

/**
 * Format duration with appropriate unit
 */
const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

/**
 * Sanitize sensitive data from request body
 */
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== "object") return body;

  const sensitiveFields = [
    "password",
    "token",
    "authorization",
    "secret",
    "key",
  ];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
};

/**
 * Sanitize sensitive headers
 */
const sanitizeHeaders = (headers: any): any => {
  const sensitiveHeaders = [
    "authorization",
    "cookie",
    "x-api-key",
    "x-auth-token",
  ];
  const sanitized = { ...headers };

  for (const header of sensitiveHeaders) {
    if (sanitized[header]) {
      sanitized[header] = "[REDACTED]";
    }
  }

  return sanitized;
};

/**
 * Generate request ID
 */
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Default logging configuration
 */
const defaultConfig: LoggingConfig = {
  enabled: true,
  level: "standard",
  includeBody: false,
  includeHeaders: false,
  includeUserInfo: true,
  colorOutput: true,
  excludePaths: ["/api-docs", "/favicon.ico", "/health", "/metrics"],
};

/**
 * Create request logging middleware
 */
export const createRequestLogger = (
  config: Partial<LoggingConfig> = {}
): ((req: Request, res: Response, next: NextFunction) => void) => {
  const finalConfig = { ...defaultConfig, ...config };

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip logging if disabled or path is excluded
    if (!finalConfig.enabled || finalConfig.excludePaths.includes(req.path)) {
      return next();
    }

    // Generate unique request ID
    const requestId = generateRequestId();

    // Add request ID to request object for tracking
    (req as any).requestId = requestId;

    // Record start time
    const startTime = Date.now();

    // Log incoming request
    logIncomingRequest(req, requestId, finalConfig);

    // Override res.end to capture response
    const originalEnd = res.end.bind(res);
    let responseBody = "";

    // Capture response data if needed
    if (finalConfig.level === "detailed") {
      const originalSend = res.send.bind(res);
      res.send = function (body) {
        responseBody = body;
        return originalSend(body);
      };
    }

    res.end = function (...args: any[]) {
      // Calculate request duration
      const duration = Date.now() - startTime;

      // Log response
      logResponse(req, res, duration, requestId, responseBody, finalConfig);

      // Call original end method
      return originalEnd(...args);
    };

    next();
  };
};

/**
 * Log incoming request
 */
const logIncomingRequest = (
  req: Request,
  requestId: string,
  config: LoggingConfig
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = req.get("User-Agent") || "unknown";

  let logMessage = "";

  if (config.colorOutput) {
    logMessage =
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${colors.cyan}[${requestId}]${colors.reset} ` +
      `${getMethodColor(method)}${method}${colors.reset} ` +
      `${colors.bright}${url}${colors.reset} ` +
      `${colors.gray}from ${ip}${colors.reset}`;
  } else {
    logMessage = `[${timestamp}] [${requestId}] ${method} ${url} from ${ip}`;
  }

  console.log(`🔄 ${logMessage}`);

  // Log additional details based on level
  if (config.level === "detailed") {
    if (config.includeHeaders) {
      console.log(
        `   ${colors.gray}Headers:${colors.reset}`,
        JSON.stringify(sanitizeHeaders(req.headers), null, 2)
      );
    }

    if (config.includeBody && req.body && Object.keys(req.body).length > 0) {
      console.log(
        `   ${colors.gray}Body:${colors.reset}`,
        JSON.stringify(sanitizeBody(req.body), null, 2)
      );
    }

    if (config.includeUserInfo && (req as any).user) {
      console.log(
        `   ${colors.gray}User:${colors.reset}`,
        JSON.stringify((req as any).user, null, 2)
      );
    }

    console.log(`   ${colors.gray}User-Agent:${colors.reset} ${userAgent}`);
  }
};

/**
 * Log response
 */
const logResponse = (
  req: Request,
  res: Response,
  duration: number,
  requestId: string,
  responseBody: string,
  config: LoggingConfig
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const statusCode = res.statusCode;
  const contentLength = res.get("Content-Length") || "unknown";

  let logMessage = "";

  if (config.colorOutput) {
    const statusColor = getStatusColor(statusCode);
    const methodColor = getMethodColor(method);

    logMessage =
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${colors.cyan}[${requestId}]${colors.reset} ` +
      `${methodColor}${method}${colors.reset} ` +
      `${colors.bright}${url}${colors.reset} ` +
      `${statusColor}${statusCode}${colors.reset} ` +
      `${colors.gray}${formatDuration(duration)}${colors.reset} ` +
      `${colors.gray}${contentLength} bytes${colors.reset}`;
  } else {
    logMessage = `[${timestamp}] [${requestId}] ${method} ${url} ${statusCode} ${formatDuration(duration)} ${contentLength} bytes`;
  }

  // Use different icons based on status
  let icon = "✅";
  if (statusCode >= 500) icon = "🔥";
  else if (statusCode >= 400) icon = "⚠️";
  else if (statusCode >= 300) icon = "↩️";

  console.log(`${icon} ${logMessage}`);

  // Log response body for detailed level
  if (config.level === "detailed" && responseBody) {
    try {
      const parsedBody = JSON.parse(responseBody);
      console.log(
        `   ${colors.gray}Response:${colors.reset}`,
        JSON.stringify(parsedBody, null, 2)
      );
    } catch {
      // Response body is not JSON
      console.log(
        `   ${colors.gray}Response:${colors.reset} ${responseBody.substring(0, 200)}${responseBody.length > 200 ? "..." : ""}`
      );
    }
  }

  // Log performance warnings
  if (duration > 5000) {
    console.log(
      `   ${colors.red}⚡ SLOW REQUEST WARNING: ${formatDuration(duration)}${colors.reset}`
    );
  } else if (duration > 1000) {
    console.log(
      `   ${colors.yellow}⚡ Performance warning: ${formatDuration(duration)}${colors.reset}`
    );
  }
};

/**
 * Predefined logging configurations
 */
export const loggingPresets = {
  // Minimal logging for production
  minimal: createRequestLogger({
    level: "minimal",
    includeBody: false,
    includeHeaders: false,
    includeUserInfo: false,
    colorOutput: false,
  }),

  // Standard logging for development
  standard: createRequestLogger({
    level: "standard",
    includeBody: false,
    includeHeaders: false,
    includeUserInfo: true,
    colorOutput: true,
  }),

  // Detailed logging for debugging
  detailed: createRequestLogger({
    level: "detailed",
    includeBody: true,
    includeHeaders: true,
    includeUserInfo: true,
    colorOutput: true,
  }),

  // Production-safe logging
  production: createRequestLogger({
    level: "standard",
    includeBody: false,
    includeHeaders: false,
    includeUserInfo: false,
    colorOutput: false,
    excludePaths: ["/api-docs", "/favicon.ico", "/health", "/metrics", "/"],
  }),
};

/**
 * Default request logger for general use
 */
export const requestLogger = loggingPresets.standard;

/**
 * Export the logging configuration type for external use
 */
export type { LoggingConfig };
