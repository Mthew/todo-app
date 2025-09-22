import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface CategoryResponse extends Category {}

export interface CategoriesResponse {
  categories: Category[];
}
