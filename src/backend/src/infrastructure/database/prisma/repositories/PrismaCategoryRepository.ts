import { ICategoryRepository } from "../../../../application/ports/ICategoryRepository";
import { Category } from "../../../../domain/entities/Category.entity";
import { prisma } from "../PrismaClient";
import { CategoryMapper } from "../mappers/CategoryMapper";

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const savedCategory = await prisma.category.create({
      data: {
        name: category.name,
        userId: category.userId,
      },
    });
    return CategoryMapper.toDomain(savedCategory);
  }

  async findByUserIdAndName(
    userId: number,
    name: string
  ): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findByUserId(userId: number): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
    return categories.map(CategoryMapper.toDomain);
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async update(category: Category): Promise<Category> {
    const updatedCategory = await prisma.category.update({
      where: { id: category.id! },
      data: {
        name: category.name,
      },
    });
    return CategoryMapper.toDomain(updatedCategory);
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
