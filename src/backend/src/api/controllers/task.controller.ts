import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { container } from "../../infrastructure/di";
import { CreateTaskUseCase } from "../../application/use-cases/task/CreateTask.usecase";
import { GetTasksByUserUseCase } from "../../application/use-cases/task/GetTasksByUser.usecase";
import { CreateTaskDTO } from "../../application/dtos/task.dto";

export class TaskController {
  private createTaskUseCase: CreateTaskUseCase;
  private getTasksByUserUseCase: GetTasksByUserUseCase;

  constructor() {
    this.createTaskUseCase = container.get("createTaskUseCase");
    this.getTasksByUserUseCase = container.get("getTasksByUserUseCase");
    this.create = this.create.bind(this);
    this.getByUser = this.getByUser.bind(this);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const dto: CreateTaskDTO = {
      ...req.body,
      userId: 1, // TODO: Get from authenticated user - hardcoded for now
    };
    const task = await this.createTaskUseCase.execute(dto);
    res.status(StatusCodes.CREATED).json(task);
  }

  public async getByUser(req: Request, res: Response): Promise<void> {
    const userId = 1; // TODO: Get from authenticated user - hardcoded for now
    const tasks = await this.getTasksByUserUseCase.execute(userId);
    res.status(StatusCodes.OK).json(tasks);
  }
}
