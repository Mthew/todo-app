import { Task } from "../../../domain/entities";
import { ITaskRepository } from "../../ports";
import { TaskFilterDTO } from "../../dtos/task.dto";

export class GetTasksByUserUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    userId: number,
    filters: TaskFilterDTO
  ): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.taskRepository.findByUserIdWithFilters(
      userId,
      filters
    );

    const totalPages = Math.ceil(result.total / filters.limit);

    return {
      tasks: result.tasks,
      total: result.total,
      page: filters.page,
      limit: filters.limit,
      totalPages,
    };
  }
}
