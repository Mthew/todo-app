import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["baja", "media", "alta"]).default("media"),
  dueDate: z.coerce.date().optional(), // coerce will try to convert string to Date
  categoryId: z.number().int().optional(),
  tagIds: z.array(z.number().int()).optional(),
  userId: z.number().int().optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;

// Schema for updating a task
export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["baja", "media", "alta"]).optional(),
  dueDate: z.coerce.date().optional(),
  categoryId: z.number().int().optional(),
  tagIds: z.array(z.number().int()).optional(),
});

export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
