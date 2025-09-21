import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { StatusCodes } from "http-status-codes";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      // If validation fails, send a 400 Bad Request response with error details
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };
