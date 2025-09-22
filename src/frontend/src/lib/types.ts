export interface Category {
  id: number;
  name: string;
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

// Authentication related types
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}
