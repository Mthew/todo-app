import { Request, Response, NextFunction } from "express";
import { AppError, HttpErrorCode } from "../../utils/AppError";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(HttpErrorCode.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  // Handle Prisma errors specifically if needed, e.g., unique constraint violation
  // if (err instanceof Prisma.PrismaClientKnownRequestError) { ... }

  return res.status(HttpErrorCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "An unexpected error occurred.",
  });
};
