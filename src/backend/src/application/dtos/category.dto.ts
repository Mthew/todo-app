import { z } from "zod";

// Schema for creating a category
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;

// Schema for updating a category
export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;

// Schema for category response
export const CategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CategoryResponseDTO = z.infer<typeof CategoryResponseSchema>;
