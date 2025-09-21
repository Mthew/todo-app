import { Task } from "../../domain/entities";

export interface ITaskRepository {
  findById(id: number): Promise<Task | null>;
  findByUserId(userId: number): Promise<Task[]>;
  save(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;
}
