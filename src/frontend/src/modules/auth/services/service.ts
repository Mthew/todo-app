import { httpManager } from "@/lib/httpManager";
import {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "../types";

export const authServices = {
  login: async (credentials: LoginData) => {
    return httpManager.post<LoginResponse>("/auth/login", credentials);
  },

  signup: async (data: RegisterData) => {
    return httpManager.post<RegisterResponse>("/auth/register", data);
  },

  profile: async (token: string) => {
    return httpManager.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
