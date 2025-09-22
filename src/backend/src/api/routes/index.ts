/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Tasks
 *     description: Task management endpoints (requires authentication)
 *   - name: Tags
 *     description: Tag management endpoints (requires authentication)
 *   - name: Categories
 *     description: Category management endpoints (requires authentication)
 */

import { Router } from "express";
import { authRouter } from "./auth.routes";
import { taskRouter } from "./task.routes";
import { tagRouter } from "./tag.routes";
import { categoryRouter } from "./category.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/tags", tagRouter);
apiRouter.use("/category", categoryRouter);

export { apiRouter };
