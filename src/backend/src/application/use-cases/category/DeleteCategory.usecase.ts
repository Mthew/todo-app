import { ICategoryRepository } from "../../ports/ICategoryRepository";
import { AppError } from "../../../utils/AppError";

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(categoryId: number, userId: number): Promise<void> {
    // Check if category exists and belongs to user
    const existingCategory = await this.categoryRepository.findById(categoryId);
    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }

    if (existingCategory.userId !== userId) {
      throw new AppError("You can only delete your own categories", 403);
    }

    await this.categoryRepository.delete(categoryId);
  }
}
