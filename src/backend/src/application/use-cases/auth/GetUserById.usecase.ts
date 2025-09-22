import { IPasswordHasher, IUserRepository } from "../../ports";
import { User } from "../../../domain/entities";

import { NotFoundError } from "../../../utils/AppError"; // We'll create AppError later

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError("User not found.");
    }

    const { passwordHash, ...userWithoutPassword } = existingUser;

    return userWithoutPassword as User;
  }
}
