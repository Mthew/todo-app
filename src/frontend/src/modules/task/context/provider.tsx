"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { taskServices } from "../services/service";
import { Task, TaskFormData, TaskFilterFormData } from "../types";
import { useAuth } from "../../auth";

// State interface
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentFilters?: TaskFilterFormData;
  isServerFiltered: boolean;
}

// Action types for the reducer
type TaskAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Task[]; filters?: TaskFilterFormData }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "CREATE_SUCCESS"; payload: Task }
  | { type: "UPDATE_SUCCESS"; payload: Task }
  | { type: "DELETE_SUCCESS"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

// Initial state
const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  currentFilters: undefined,
  isServerFiltered: false,
};

// Task reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
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
        tasks: action.payload,
        isLoading: false,
        error: null,
        currentFilters: action.filters,
        isServerFiltered: !!action.filters,
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
        tasks: [...state.tasks, action.payload],
        isLoading: false,
        error: null,
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        isLoading: false,
        error: null,
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
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
interface TaskContextType {
  state: TaskState;
  fetchTasks: (filters?: TaskFilterFormData) => Promise<void>;
  createTask: (data: TaskFormData) => Promise<Task>;
  updateTask: (id: number, data: TaskFormData) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  clearError: () => void;
}

// Create context
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

// Provider component
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { state: authState } = useAuth();

  // Helper function to check if filters have changed
  const filtersChanged = (
    newFilters?: TaskFilterFormData,
    currentFilters?: TaskFilterFormData
  ): boolean => {
    if (!newFilters && !currentFilters) return false;
    if (!newFilters || !currentFilters) return true;

    return JSON.stringify(newFilters) !== JSON.stringify(currentFilters);
  };

  // Fetch all tasks
  const fetchTasks = async (filters?: TaskFilterFormData): Promise<void> => {
    // Skip if filters haven't changed
    if (!filtersChanged(filters, state.currentFilters)) {
      return;
    }

    try {
      dispatch({ type: "FETCH_START" });

      const response = await taskServices.getAll(filters);
      const tasks = (response.data as any).tasks || response.data;

      dispatch({
        type: "FETCH_SUCCESS",
        payload: Array.isArray(tasks) ? tasks : [tasks],
        filters: filters,
      });
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to fetch tasks",
      });
    }
  };

  // Create task
  const createTask = async (data: TaskFormData): Promise<Task> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await taskServices.create(data);
      const task = response.data as Task;

      dispatch({ type: "CREATE_SUCCESS", payload: task });
      return task;
    } catch (error: any) {
      console.error("Failed to create task:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to create task",
      });
      throw error;
    }
  };

  // Update task
  const updateTask = async (id: number, data: TaskFormData): Promise<Task> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await taskServices.update(id, data);
      const task = response.data as Task;

      dispatch({ type: "UPDATE_SUCCESS", payload: task });
      return task;
    } catch (error: any) {
      console.error("Failed to update task:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to update task",
      });
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await taskServices.delete(id);

      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      dispatch({
        type: "FETCH_ERROR",
        payload: error?.message || "Failed to delete task",
      });
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Fetch tasks on component mount, but only when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      fetchTasks();
    }
  }, [authState.isAuthenticated, authState.token]);

  const contextValue: TaskContextType = {
    state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
