// Extend Express Request interface to include user property for authentication
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

export {};
