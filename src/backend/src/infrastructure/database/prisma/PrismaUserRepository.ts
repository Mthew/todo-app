import { IUserRepository } from "../../../application/ports/IUserRepository";
import { User } from "../../../domain/User";
import { prisma } from "./PrismaClient";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userRow = await prisma.user.findUnique({ where: { email } });
    if (!userRow) return null;
    return new User(userRow.id, userRow.email, userRow.name, userRow.password);
  }

  async save(user: User): Promise<User> {
    const savedUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.passwordHash,
      },
    });
    return new User(
      savedUser.id,
      savedUser.email,
      savedUser.name,
      savedUser.password
    );
  }
}
