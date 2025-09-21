/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Tasks
 *     description: Task management endpoints (requires authentication)
 *   - name: Tags
 *     description: Tag management endpoints (requires authentication)
 */

import { Router } from "express";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";
import { tagRouter } from "./tag.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/tags", tagRouter);

export { apiRouter };
