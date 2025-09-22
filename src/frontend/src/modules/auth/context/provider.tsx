"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import {
  AuthState,
  User,
  LoginData,
  RegisterData,
  LoginResponse,
} from "../types";
import { authServices } from "../services/service";
import { httpManager } from "@/lib/httpManager";

// Action types for the reducer
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_ERROR" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // Start with loading true for initial auth check
  isAuthenticated: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Context interface
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Token storage utilities
const TOKEN_KEY = "todo_app_token";

const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (credentials: LoginData): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await authServices.login(credentials);
      const { user, token } = response.data as LoginResponse;

      // Save token and set up HTTP manager
      saveToken(token);
      httpManager.setAuthToken(token);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
      throw error; // Re-throw so the component can handle the error
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      await authServices.signup(userData);

      await login({ email: userData.email, password: userData.password });
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
      throw error; // Re-throw so the component can handle the error
    }
  };

  // Logout function
  const logout = (): void => {
    removeToken();
    httpManager.removeAuthToken();
    dispatch({ type: "LOGOUT" });
  };

  // Check authentication status (for page refresh/initial load)
  const checkAuth = async (): Promise<void> => {
    try {
      const storedToken = getStoredToken();

      if (!storedToken) {
        dispatch({ type: "AUTH_ERROR" });
        return;
      }

      // Set token in HTTP manager
      httpManager.setAuthToken(storedToken);

      // Verify token with backend
      const response = await authServices.profile();
      const user = (response.data as any).user as User;

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token: storedToken },
      });
    } catch (error) {
      // Token is invalid or expired
      removeToken();
      httpManager.removeAuthToken();
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  // Check authentication on app initialization
  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
