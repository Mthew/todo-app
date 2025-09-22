import { useContext } from "react";
import { TaskContext } from "../context/provider";

export const useTask = () => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }

  return context;
};

// Individual hooks for specific task state pieces (optional but convenient)
export const useTaskState = () => {
  const { state } = useTask();
  return state;
};

export const useTasks = () => {
  const { state } = useTask();
  return state.tasks;
};

export const useTaskLoading = () => {
  const { state } = useTask();
  return state.isLoading;
};

export const useTaskError = () => {
  const { state } = useTask();
  return state.error;
};
