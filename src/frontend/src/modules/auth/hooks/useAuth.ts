import { useContext } from "react";
import { AuthContext } from "../context/provider";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Individual hooks for specific auth state pieces (optional but convenient)
export const useAuthState = () => {
  const { state } = useAuth();
  return state;
};

export const useUser = () => {
  const { state } = useAuth();
  return state.user;
};

export const useIsAuthenticated = () => {
  const { state } = useAuth();
  return state.isAuthenticated;
};

export const useAuthLoading = () => {
  const { state } = useAuth();
  return state.isLoading;
};
