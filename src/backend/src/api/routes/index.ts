/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Tasks
 *     description: Task management endpoints (requires authentication)
 */

import { Router } from "express";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);

export { apiRouter };
