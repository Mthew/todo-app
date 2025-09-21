import { User as PrismaUser } from "@prisma/client";
import { User } from "../../../../domain/entities";

export class UserMapper {
  // Convert from Prisma model to Domain entity
  public static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.password
    );
  }

  // Convert from Domain entity to Prisma data (for create/update)
  public static toPrisma(user: User) {
    return {
      id: user.id ?? undefined, // Use undefined so Prisma handles autoincrement
      email: user.email,
      name: user.name,
      password: user.passwordHash,
    };
  }
}
