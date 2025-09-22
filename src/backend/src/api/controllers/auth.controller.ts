import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUser.usecase";
import { LoginDTO, RegisterUserDTO } from "../../application/dtos/auth.dto";

import { container } from "../../infrastructure/di";
import {
  LoginUseCase,
  LoginResult,
  GetUserByIdUseCase,
} from "../../application/use-cases/auth";
import { UnauthorizedError } from "../../utils/AppError";

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUseCase: LoginUseCase;
  private getUserByIdUseCase: GetUserByIdUseCase;

  constructor() {
    this.registerUserUseCase = container.get("registerUserUseCase");
    this.loginUseCase = container.get("loginUseCase");
    this.getUserByIdUseCase = container.get("getUserByIdUseCase");

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterUserDTO = req.body;
    const user = await this.registerUserUseCase.execute(dto);

    res.status(StatusCodes.CREATED).json(this.formatUserResponse(user));
  }

  public async login(req: Request, res: Response): Promise<void> {
    const dto: LoginDTO = req.body;
    const { user, token }: LoginResult = await this.loginUseCase.execute(dto);

    res
      .status(StatusCodes.OK)
      .json({ user: this.formatUserResponse(user), token });
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const user = await this.getUserByIdUseCase.execute(req.user.id);
    res.status(StatusCodes.OK).json({ user });
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
