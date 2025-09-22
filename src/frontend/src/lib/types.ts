export interface Category {
  id: number;
  name: string;
  userId?: number; // Optional for backward compatibility
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: "baja" | "media" | "alta";
  dueDate?: string; // ISO string format
  completed: boolean;
  category: Category;
  tags?: { id: number; name: string }[];
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: "baja" | "media" | "alta";
  dueDate?: string;
  categoryId: number;
}
