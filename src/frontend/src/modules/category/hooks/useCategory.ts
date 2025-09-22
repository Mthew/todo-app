import { useContext } from "react";
import { CategoryContext } from "../context/provider";

export const useCategory = () => {
  const context = useContext(CategoryContext);

  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }

  return context;
};

// Individual hooks for specific category state pieces (optional but convenient)
export const useCategoryState = () => {
  const { state } = useCategory();
  return state;
};

export const useCategories = () => {
  const { state } = useCategory();
  return state.categories;
};

export const useCategoryLoading = () => {
  const { state } = useCategory();
  return state.isLoading;
};

export const useCategoryError = () => {
  const { state } = useCategory();
  return state.error;
};
