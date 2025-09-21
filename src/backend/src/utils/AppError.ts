import { StatusCodes } from "http-status-codes";

export { StatusCodes as HttpErrorCode } from "http-status-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(errors: any, message: string = "Bad request") {
    super(message, StatusCodes.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ConflictError extends AppError {
  constructor(errors: any, message: string = "Conflict") {
    super(message, StatusCodes.CONFLICT, errors);
  }
}
