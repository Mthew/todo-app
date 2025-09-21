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
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilterSchema,
} from "../../application/dtos/task.dto";
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

    // Check if any filter parameters are provided
    const hasFilters = Object.keys(req.query).length > 0;

    // Parse and validate filter parameters
    const filterData = {
      completed:
        req.query.completed === "true"
          ? true
          : req.query.completed === "false"
            ? false
            : undefined,
      priority: req.query.priority as string,
      categoryId: req.query.categoryId
        ? parseInt(req.query.categoryId as string)
        : undefined,
      dueDateFrom: req.query.dueDateFrom
        ? new Date(req.query.dueDateFrom as string)
        : undefined,
      dueDateTo: req.query.dueDateTo
        ? new Date(req.query.dueDateTo as string)
        : undefined,
      search: req.query.search as string,
      orderBy: (req.query.orderBy as string) || "createdAt",
      orderDirection: (req.query.orderDirection as string) || "desc",
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    // Validate the filter data
    const filters = TaskFilterSchema.parse(filterData);

    // Use filtered query
    const result = await this.getTasksByUserUseCase.execute(
      req.user.id,
      filters
    );

    res.status(StatusCodes.OK).json({
      tasks: result.tasks.map(this.formatTaskResponse),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
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
