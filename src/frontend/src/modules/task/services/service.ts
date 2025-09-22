import { httpManager } from "@/lib/httpManager";
import {
  TaskFilterFormData,
  TaskFormData,
  TaskResponse,
  TasksResponse,
} from "../types";

export const taskServices = {
  create: async (credentials: TaskFormData) => {
    return httpManager.post<TaskResponse>("/tasks", credentials);
  },

  getAll: async (filters?: TaskFilterFormData) => {
    return httpManager.get<TasksResponse>("/tasks", { params: filters });
  },

  update: async (id: number, data: TaskFormData) => {
    return httpManager.put<TaskResponse>(`/tasks/${id}`, data);
  },

  delete: async (id: number) => {
    return httpManager.delete(`/tasks/${id}`);
  },
};
