import { IPasswordHasher } from "../../ports/IPasswordHasher";
import { IUserRepository } from "../../ports/IUserRepository";
import { User } from "../../../domain/User";

// Using an interface for the DTO for better type-checking
export interface RegisterUserDTO {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = new User(null, dto.email, dto.name, passwordHash);

    return this.userRepository.save(user);
  }
}
