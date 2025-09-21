import { Task } from "../../domain/entities";
import { TaskFilterDTO } from "../dtos/task.dto";

export interface ITaskRepository {
  findById(id: number): Promise<Task | null>;
  findByUserId(userId: number): Promise<Task[]>;
  findByUserIdWithFilters(
    userId: number,
    filters: TaskFilterDTO
  ): Promise<{ tasks: Task[]; total: number }>;
  save(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;
}
