import { Router } from "express";
import { authRouter } from "./auth.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
// apiRouter.use('/tasks', taskRouter);

export { apiRouter };
