import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { container } from "../../infrastructure/di";
import {
  CreateTaskUseCase,
  GetTasksByUserUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CompleteTaskUseCase,
} from "../../application/use-cases/task";
import { CreateTaskDTO, UpdateTaskDTO } from "../../application/dtos/task.dto";
import { UnauthorizedError } from "../../utils/AppError";
import { Tag } from "domain/entities";

export class TaskController {
  private createTaskUseCase: CreateTaskUseCase;
  private getTasksByUserUseCase: GetTasksByUserUseCase;
  private updateTaskUseCase: UpdateTaskUseCase;
  private deleteTaskUseCase: DeleteTaskUseCase;
  private completeTaskUseCase: CompleteTaskUseCase;

  constructor() {
    this.createTaskUseCase = container.get("createTaskUseCase");
    this.getTasksByUserUseCase = container.get("getTasksByUserUseCase");
    this.updateTaskUseCase = container.get("updateTaskUseCase");
    this.deleteTaskUseCase = container.get("deleteTaskUseCase");
    this.completeTaskUseCase = container.get("completeTaskUseCase");

    this.create = this.create.bind(this);
    this.getByUser = this.getByUser.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.complete = this.complete.bind(this);
  }

  public async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const dto: CreateTaskDTO = {
      ...req.body,
      userId: req.user.id,
    };
    const task = await this.createTaskUseCase.execute(dto);

    res.status(StatusCodes.CREATED).json(this.formatTaskResponse(task));
  }

  public async getByUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const tasks = await this.getTasksByUserUseCase.execute(req.user.id);

    res.status(StatusCodes.OK).json(tasks.map(this.formatTaskResponse));
  }

  public async update(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const taskId = parseInt(req.params.id);
    const dto: UpdateTaskDTO = req.body;

    const task = await this.updateTaskUseCase.execute(taskId, req.user.id, dto);

    res.status(StatusCodes.OK).json(this.formatTaskResponse(task));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const taskId = parseInt(req.params.id);
    await this.deleteTaskUseCase.execute(taskId, req.user.id);

    res.status(StatusCodes.NO_CONTENT).send();
  }

  public async complete(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const taskId = parseInt(req.params.id);
    const task = await this.completeTaskUseCase.execute(taskId, req.user.id);

    res.status(StatusCodes.OK).json(this.formatTaskResponse(task));
  }

  private formatTaskResponse(task: any) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate,
      userId: task.userId,
      categoryId: task.categoryId,
      tags: task.tags.map((tag: Tag) => ({
        id: tag.id,
        name: tag.name,
        userId: tag.userId,
      })),
    };
  }
}
