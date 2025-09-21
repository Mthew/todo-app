import { Tag, Task } from "../../../domain/entities";
import { ITaskRepository } from "../../ports";
import { CreateTaskDTO } from "../../dtos/task.dto";
// In a real app, you might also inject ITagRepository to fetch Tag entities
// For simplicity, we assume tagIds are valid for now.

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    // In a more complex scenario, you would fetch Tag and Category entities
    // from their respective repositories here to ensure they exist.
    const tags = dto.tagIds?.map((id) => new Tag(id, "", dto.userId)) ?? [];

    // Create the domain entity, enforcing business rules
    const task = new Task({
      id: null,
      title: dto.title,
      description: dto.description,
      completed: false, // Default value
      priority: dto.priority,
      userId: dto.userId,
      categoryId: dto.categoryId,
      tags: tags,
      dueDate: dto.dueDate,
    });

    // Persist through the repository port
    const savedTask = await this.taskRepository.save(task);

    return savedTask;
  }
}
