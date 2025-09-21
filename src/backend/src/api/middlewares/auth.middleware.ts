import { Request, Response, NextFunction } from "express";
import { AppError, HttpErrorCode } from "../../utils/AppError";
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
    return next(new AppError("No token provided.", HttpErrorCode.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const authService = container.get("authService") as IAuthService;
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return next(new AppError("Invalid token.", HttpErrorCode.UNAUTHORIZED));
    }

    req.user = decoded; // Attach user payload to the request
    next();
  } catch (error) {
    return next(new AppError("Invalid token.", HttpErrorCode.UNAUTHORIZED));
  }
};
