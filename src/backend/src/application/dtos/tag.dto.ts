import { z } from "zod";

// Schema for creating a tag
export const CreateTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be less than 50 characters"),
});

export type CreateTagDTO = z.infer<typeof CreateTagSchema>;

// Schema for tag response
export const TagResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TagResponseDTO = z.infer<typeof TagResponseSchema>;
