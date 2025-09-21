import { ICategoryRepository } from "../../ports/ICategoryRepository";
import { UpdateCategoryDTO } from "../../dtos/category.dto";
import { Category } from "../../../domain/entities/Category.entity";
import { AppError } from "../../../utils/AppError";

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(
    categoryId: number,
    userId: number,
    data: UpdateCategoryDTO
  ): Promise<Category> {
    // Check if category exists and belongs to user
    const existingCategory = await this.categoryRepository.findById(categoryId);
    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }

    if (existingCategory.userId !== userId) {
      throw new AppError("You can only update your own categories", 403);
    }

    // Check if another category with the same name already exists for this user
    const categoryWithSameName =
      await this.categoryRepository.findByUserIdAndName(userId, data.name);

    if (categoryWithSameName && categoryWithSameName.id !== categoryId) {
      throw new AppError("Category with this name already exists", 409);
    }

    // Create updated category entity
    const updatedCategory = new Category(categoryId, data.name, userId);

    return await this.categoryRepository.update(updatedCategory);
  }
}
