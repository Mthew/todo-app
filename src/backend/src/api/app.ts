import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { apiRouter } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Main router
app.use("/api", apiRouter);

// Global error handler middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error Handler:", error);

  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  // Send error response
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

export { app };
