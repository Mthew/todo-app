import { IPasswordHasher, IUserRepository } from "../../ports";
import { User } from "../../../domain/entities";

import { RegisterUserDTO } from "../../dtos/auth.dto";
import { AppError, HttpErrorCode } from "../../../utils/AppError"; // We'll create AppError later

export class RegisterUserUseCase {
  // We depend on interfaces (abstractions), not concrete classes.
  // This is Dependency Inversion.
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(
        "User with this email already exists.",
        HttpErrorCode.CONFLICT
      );
    }

    // 2. Hash the password (infrastructure concern)
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // 3. Create a domain entity
    const user = new User(null, dto.email, dto.name, passwordHash);

    // 4. Persist the entity via the repository port
    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }
}
