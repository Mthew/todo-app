import { IAuthService, IPasswordHasher, IUserRepository } from "../../ports";
import { User } from "../../../domain/entities";
import { LoginDTO } from "../../dtos/auth.dto";
import { AppError, HttpErrorCode } from "../../../utils/AppError";

// Define a result type for the use case
export interface LoginResult {
  user: User;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly authService: IAuthService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResult> {
    // 1. Find the user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError("Invalid credentials.", HttpErrorCode.UNAUTHORIZED);
    }

    // 2. Compare passwords
    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials.", HttpErrorCode.UNAUTHORIZED);
    }

    // 3. Generate an authentication token
    const token = this.authService.generateToken({
      id: user.id!,
      email: user.email,
    });

    // 4. Return the user and token
    return { user, token };
  }
}
