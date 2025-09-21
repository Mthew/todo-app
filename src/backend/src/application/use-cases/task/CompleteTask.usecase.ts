import { ITaskRepository } from "../../ports/ITaskRepository";
import { Task } from "../../../domain/entities";
import {
  AppError,
  HttpErrorCode,
  NotFoundError,
} from "../../../utils/AppError";

export class CompleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: number, userId: number): Promise<Task> {
    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }

    if (existingTask.userId !== userId) {
      throw new AppError(
        "You can only complete your own tasks",
        HttpErrorCode.FORBIDDEN
      );
    }

    const updatedTask = new Task({
      ...existingTask,
    });

    updatedTask.markAsComplete();

    return await this.taskRepository.update(updatedTask);
  }
}
