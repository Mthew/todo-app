import { httpManager } from "@/lib/httpManager";
import {
  CategoriesResponse,
  CategoryFormData,
  CategoryResponse,
} from "../types";

export const categoryServices = {
  create: async (credentials: CategoryFormData) => {
    return httpManager.post<CategoryResponse>("/category", credentials);
  },

  getAll: async () => {
    return httpManager.get<CategoriesResponse>("/category");
  },

  update: async (id: number, data: CategoryFormData) => {
    return httpManager.put<CategoryResponse>(`/category/${id}`, data);
  },

  delete: async (id: number) => {
    return httpManager.delete(`/category/${id}`);
  },
};
