import e, { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { PrismaClient } from "@prisma/client/extension";
import { AppError, BadRequestError, HttpErrorCode } from "../../utils/AppError";

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
      errors: err.errors,
    });
  }

  if (err instanceof ZodError) {
    const detailedErrors = z.treeifyError(err);
    return next(new BadRequestError(detailedErrors));
  }

  if (err instanceof PrismaClient.PrismaClientKnownRequestError) {
    return next(new BadRequestError("Database error"));
  }

  return res.status(HttpErrorCode.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "An unexpected error occurred.",
  });
};
