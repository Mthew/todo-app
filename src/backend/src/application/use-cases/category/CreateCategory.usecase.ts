import { Category } from "../../../domain/entities/Category.entity";
import { ICategoryRepository } from "../../ports/ICategoryRepository";
import { CreateCategoryDTO } from "../../dtos/category.dto";
import { BadRequestError } from "../../../utils/AppError";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(dto: CreateCategoryDTO, userId: number): Promise<Category> {
    // Check if a category with the same name already exists for this user
    const existingCategory = await this.categoryRepository.findByUserIdAndName(
      userId,
      dto.name
    );

    if (existingCategory) {
      throw new BadRequestError(
        `Category with name "${dto.name}" already exists for this user`
      );
    }

    // Create the domain entity, enforcing business rules
    const category = new Category(null, dto.name, userId);

    // Persist through the repository port
    const savedCategory = await this.categoryRepository.create(category);

    return savedCategory;
  }
}
