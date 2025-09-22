import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateTagDTO } from "../../application/dtos/tag.dto";
import {
  CreateTagUseCase,
  GetTagsByUserUseCase,
} from "../../application/use-cases/tag";
import { container } from "../../infrastructure/di";
import { UnauthorizedError } from "../../utils/AppError";

export class TagController {
  private createTagUseCase: CreateTagUseCase;
  private getTagsByUserUseCase: GetTagsByUserUseCase;

  constructor() {
    this.createTagUseCase = container.get("createTagUseCase");
    this.getTagsByUserUseCase = container.get("getTagsByUserUseCase");

    this.create = this.create.bind(this);
    this.getByUser = this.getByUser.bind(this);
  }

  public async create(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const dto: CreateTagDTO = req.body;
    const tag = await this.createTagUseCase.execute(dto, req.user.id);

    res.status(StatusCodes.CREATED).json(this.formatTagResponse(tag));
  }

  public async getByUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const tags = await this.getTagsByUserUseCase.execute(req.user.id);

    res.status(StatusCodes.OK).json(tags.map(this.formatTagResponse));
  }

  private formatTagResponse(tag: any) {
    return {
      id: tag.id,
      name: tag.name,
      userId: tag.userId,
    };
  }
}
