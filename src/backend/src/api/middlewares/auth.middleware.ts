import { Request, Response, NextFunction } from "express";
import {
  AppError,
  HttpErrorCode,
  UnauthorizedError,
} from "../../utils/AppError";
import { IAuthService } from "../../application/ports/IAuthService";
import { container } from "../../infrastructure/di";

// Extend Express Request interface for this file
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const authService = container.get("authService") as IAuthService;
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return next(new UnauthorizedError("Invalid token."));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token."));
  }
};
