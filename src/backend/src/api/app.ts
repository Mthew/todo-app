import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error.handler";

const app = express();

// Core Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// API Routes
app.use("/api", apiRouter);

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export { app };
