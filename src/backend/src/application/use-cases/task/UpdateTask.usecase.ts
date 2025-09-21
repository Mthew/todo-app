import { ITaskRepository } from "../../ports/ITaskRepository";
import { UpdateTaskDTO } from "../../dtos/task.dto";
import { Task, Tag } from "../../../domain/entities";
import {
  AppError,
  HttpErrorCode,
  NotFoundError,
} from "../../../utils/AppError";

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(
    taskId: number,
    userId: number,
    data: UpdateTaskDTO
  ): Promise<Task> {
    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new NotFoundError("Task not found");
    }

    if (existingTask.userId !== userId) {
      throw new AppError(
        "You can only update your own tasks",
        HttpErrorCode.FORBIDDEN
      );
    }

    const updatedTask = new Task({
      id: taskId,
      title: data.title ?? existingTask.title,
      description:
        data.description !== undefined
          ? data.description
          : existingTask.description,
      completed: data.completed ?? existingTask.completed,
      priority: data.priority ?? existingTask.priority,
      dueDate: data.dueDate !== undefined ? data.dueDate : existingTask.dueDate,
      userId: existingTask.userId,
      categoryId:
        data.categoryId !== undefined
          ? data.categoryId
          : existingTask.categoryId,
      tags: [],
    });

    data.tagIds?.forEach((id, index) => {
      updatedTask.addTag(new Tag(id, `test-${index}`, userId));
    });

    return await this.taskRepository.update(updatedTask);
  }
}
