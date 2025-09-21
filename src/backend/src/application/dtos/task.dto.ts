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

// Schema for task filtering and ordering
export const TaskFilterSchema = z.object({
  // Status filter (completed or not)
  completed: z.boolean().optional(),

  // Priority filter
  priority: z.enum(["baja", "media", "alta"]).optional(),

  // Category filter
  categoryId: z.number().int().optional(),

  // Due date filtering
  dueDateFrom: z.coerce.date().optional(),
  dueDateTo: z.coerce.date().optional(),

  // Text search in title and description
  search: z.string().optional(),

  // Ordering
  orderBy: z
    .enum(["title", "priority", "dueDate", "createdAt"])
    .default("createdAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),

  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type TaskFilterDTO = z.infer<typeof TaskFilterSchema>;
