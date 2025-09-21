import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUser.usecase";
import { LoginDTO, RegisterUserDTO } from "../../application/dtos/auth.dto";

import { container } from "../../infrastructure/di";
import {
  LoginUseCase,
  LoginResult,
} from "../../application/use-cases/auth/Login.usecase";

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUseCase: LoginUseCase;

  constructor() {
    this.registerUserUseCase = container.get("registerUserUseCase");
    this.loginUseCase = container.get("loginUseCase");

    // Bind methods to ensure 'this' context is correct
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  public async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterUserDTO = req.body;
    const user = await this.registerUserUseCase.execute(dto);

    // DTO for the response to avoid leaking sensitive data like passwordHash
    const responseDto = { id: user.id, name: user.name, email: user.email };

    res.status(StatusCodes.CREATED).json(responseDto);
  }

  public async login(req: Request, res: Response): Promise<void> {
    const dto: LoginDTO = req.body;
    const { user, token }: LoginResult = await this.loginUseCase.execute(dto);

    const userResponse = { id: user.id, name: user.name, email: user.email };

    res.status(StatusCodes.OK).json({ user: userResponse, token });
  }
}
