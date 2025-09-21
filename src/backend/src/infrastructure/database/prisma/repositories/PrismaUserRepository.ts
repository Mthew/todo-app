import { IUserRepository } from "../../../../application/ports/IUserRepository";
import { User } from "../../../../domain/entities";
import { prisma } from "../PrismaClient";
import { UserMapper } from "../mappers/UserMapper";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const prismaData = UserMapper.toPrisma(user);
    const savedUser = await prisma.user.create({ data: prismaData });
    return UserMapper.toDomain(savedUser);
  }
}
