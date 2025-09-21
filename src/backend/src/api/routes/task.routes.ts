import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { CreateTaskSchema } from "../../application/dtos/task.dto";

const taskRouter = Router();
const taskController = new TaskController();

// All task routes are protected
taskRouter.use(protect);

taskRouter
  .route("/")
  .post(validate(CreateTaskSchema), taskController.create)
  .get(taskController.getByUser);

export { taskRouter };
