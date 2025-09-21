import { Category } from "../../domain/entities/Category.entity";

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  findByUserIdAndName(userId: number, name: string): Promise<Category | null>;
  findByUserId(userId: number): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  update(category: Category): Promise<Category>;
  delete(id: number): Promise<void>;
}
