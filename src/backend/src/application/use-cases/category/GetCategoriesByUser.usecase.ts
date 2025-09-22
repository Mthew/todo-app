import { Category } from "../../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../ports/ICategoryRepository";

export class GetCategoriesByUserUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(userId: number): Promise<Category[]> {
    return await this.categoryRepository.findByUserId(userId);
  }
}
