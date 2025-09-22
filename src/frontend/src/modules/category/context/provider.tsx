"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { categoryServices } from "../services/service";
import { Category, CategoryFormData } from "../types";
import { useAuth } from "../../auth";

// State interface
interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

// Action types for the reducer
type CategoryAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Category[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "CREATE_SUCCESS"; payload: Category }
  | { type: "UPDATE_SUCCESS"; payload: Category }
  | { type: "DELETE_SUCCESS"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

// Initial state
const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

// Category reducer
function categoryReducer(
  state: CategoryState,
  action: CategoryAction
): CategoryState {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload,
        isLoading: false,
        error: null,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "CREATE_SUCCESS":
      return {
        ...state,
        categories: [...state.categories, action.payload],
        isLoading: false,
        error: null,
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
        isLoading: false,
        error: null,
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Context interface
interface CategoryContextType {
  state: CategoryState;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<Category>;
  updateCategory: (id: number, data: CategoryFormData) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
  clearError: () => void;
}

// Create context
export const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider component
interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch all categories
  const fetchCategories = async (): Promise<void> => {
    try {
      dispatch({ type: "FETCH_START" });

      const response = await categoryServices.getAll();
      const categories = (response.data as any).categories || response.data;

      dispatch({
        type: "FETCH_SUCCESS",
        payload: Array.isArray(categories) ? categories : [categories],
      });
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to fetch categories",
      });
    }
  };

  // Create category
  const createCategory = async (data: CategoryFormData): Promise<Category> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await categoryServices.create(data);
      const category = response.data as Category;

      dispatch({ type: "CREATE_SUCCESS", payload: category });
      return category;
    } catch (error: any) {
      console.error("Failed to create category:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to create category",
      });
      throw error;
    }
  };

  // Update category
  const updateCategory = async (
    id: number,
    data: CategoryFormData
  ): Promise<Category> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await categoryServices.update(id, data);
      const category = response.data as Category;

      dispatch({ type: "UPDATE_SUCCESS", payload: category });
      return category;
    } catch (error: any) {
      console.error("Failed to update category:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to update category",
      });
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await categoryServices.delete(id);

      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to delete category",
      });
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Fetch categories on component mount, but only when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      fetchCategories();
    }
  }, [authState.isAuthenticated, authState.token]);

  const contextValue: CategoryContextType = {
    state,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};
