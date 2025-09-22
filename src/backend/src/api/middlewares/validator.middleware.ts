import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType, z } from "zod";
import { StatusCodes } from "http-status-codes";
import { AppError, BadRequestError, HttpErrorCode } from "../../utils/AppError";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const detailedErrors = z.treeifyError(error);
        return next(new BadRequestError(detailedErrors));
      }

      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };
