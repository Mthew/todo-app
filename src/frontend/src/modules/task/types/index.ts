import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["baja", "media", "alta"]).default("media"),
  dueDate: z.coerce.date().optional(), // coerce will try to convert string to Date
  categoryId: z.number().int().optional(),
  tagIds: z.array(z.number().int()).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export type Priority = "baja" | "media" | "alta";

export interface Tag {
  id: number;
  name: string;
  userId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  userId: number;
  categoryId?: number;
  tags?: Tag[];
}

export interface TaskResponse extends Task {}

export interface TasksResponse {
  tasks: Task[];
}

// Schema for task filtering and ordering
export const taskFilterSchema = z.object({
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
});

export type TaskFilterFormData = z.infer<typeof taskFilterSchema>;
