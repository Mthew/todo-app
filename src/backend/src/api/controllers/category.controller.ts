import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "../../application/dtos/category.dto";
import {
  CreateCategoryUseCase,
  GetCategoriesByUserUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases/category";
import { container } from "../../infrastructure/di";
import { UnauthorizedError } from "../../utils/AppError";

export class CategoryController {
  private createCategoryUseCase: CreateCategoryUseCase;
  private getCategoriesByUserUseCase: GetCategoriesByUserUseCase;
  private updateCategoryUseCase: UpdateCategoryUseCase;
  private deleteCategoryUseCase: DeleteCategoryUseCase;

  constructor() {
    this.createCategoryUseCase = container.get("createCategoryUseCase");
    this.getCategoriesByUserUseCase = container.get(
      "getCategoriesByUserUseCase"
    );
    this.updateCategoryUseCase = container.get("updateCategoryUseCase");
    this.deleteCategoryUseCase = container.get("deleteCategoryUseCase");

    this.create = this.create.bind(this);
    this.getByUser = this.getByUser.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const dto: CreateCategoryDTO = req.body;
    const category = await this.createCategoryUseCase.execute(dto, req.user.id);

    res.status(StatusCodes.CREATED).json(this.formatCategoryResponse(category));
  }

  public async getByUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const categories = await this.getCategoriesByUserUseCase.execute(
      req.user.id
    );

    res
      .status(StatusCodes.OK)
      .json(categories.map(this.formatCategoryResponse));
  }

  public async update(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const categoryId = parseInt(req.params.id);
    const dto: UpdateCategoryDTO = req.body;

    const category = await this.updateCategoryUseCase.execute(
      categoryId,
      req.user.id,
      dto
    );

    res.status(StatusCodes.OK).json(this.formatCategoryResponse(category));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const categoryId = parseInt(req.params.id);

    await this.deleteCategoryUseCase.execute(categoryId, req.user.id);

    res.status(StatusCodes.NO_CONTENT).send();
  }

  private formatCategoryResponse(category: any) {
    return {
      id: category.id,
      name: category.name,
      userId: category.userId,
    };
  }
}
