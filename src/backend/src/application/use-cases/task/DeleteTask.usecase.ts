import { ITaskRepository } from "../../ports/ITaskRepository";
import { AppError } from "../../../utils/AppError";

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: number, userId: number): Promise<void> {
    // Check if task exists and belongs to user
    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new AppError("Task not found", 404);
    }

    if (existingTask.userId !== userId) {
      throw new AppError("You can only delete your own tasks", 403);
    }

    await this.taskRepository.delete(taskId);
  }
}
