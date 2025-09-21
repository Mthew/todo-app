import { Tag, Task } from "../../../domain/entities";
import { ITaskRepository } from "../../ports";
import { CreateTaskDTO } from "../../dtos/task.dto";
import { BadRequestError } from "../../../utils/AppError";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    if (dto.userId == null) {
      throw new BadRequestError("User ID is required to create a task.");
    }

    const task = new Task({
      id: null,
      title: dto.title,
      description: dto.description,
      completed: false,
      priority: dto.priority,
      userId: dto.userId!,
      categoryId: dto.categoryId,
      tags: [],
      dueDate: dto.dueDate,
    });

    dto.tagIds?.forEach((id, index) => {
      task.addTag(new Tag(id, `test-${index}`, dto.userId!));
    });

    const savedTask = await this.taskRepository.save(task);

    return savedTask;
  }
}
