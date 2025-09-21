import { Task } from "../../../domain/entities";
import { ITaskRepository } from "../../ports";

export class GetTasksByUserUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: number): Promise<Task[]> {
    // The use case is simple: just delegate the call to the repository.
    // Its value is in creating a clear, explicit API for this application action.
    const tasks = await this.taskRepository.findByUserId(userId);
    return tasks;
  }
}
