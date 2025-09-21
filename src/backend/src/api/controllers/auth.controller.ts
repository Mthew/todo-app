import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import {
  RegisterUserDTO,
  RegisterUserUseCase,
} from "../../application/use-cases/auth/RegisterUser.usecase";
import { PrismaUserRepository } from "../../infrastructure/database/prisma/repositories/PrismaUserRepository";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";

export class AuthController {
  // --- Manual Dependency Injection ---
  private registerUserUseCase: RegisterUserUseCase;

  constructor() {
    const userRepository = new PrismaUserRepository();
    const passwordHasher = new BcryptPasswordHasher();
    this.registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      passwordHasher
    );
    // Bind 'this' to ensure it's correct when Express calls the method
    this.register = this.register.bind(this);
  }
  // -----------------------------------

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: RegisterUserDTO = req.body;
      const user = await this.registerUserUseCase.execute(dto);

      // Avoid sending password hash to client
      const userResponse = { id: user.id, email: user.email, name: user.name };

      res.status(StatusCodes.CREATED).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
}
