import { Category as PrismaCategory } from "@prisma/client";
import { Category } from "../../../../domain/entities/Category.entity";

export class CategoryMapper {
  public static toDomain(prismaCategory: PrismaCategory): Category {
    return new Category(
      prismaCategory.id,
      prismaCategory.name,
      prismaCategory.userId
    );
  }

  public static toPrisma(category: Category) {
    return {
      id: category.id ?? undefined,
      name: category.name,
      userId: category.userId,
    };
  }
}
