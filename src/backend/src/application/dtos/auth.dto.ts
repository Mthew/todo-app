import { z } from "zod";

// Schema for user registration
export const RegisterUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the TypeScript type from the schema
export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

// Schema for user login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDTO = z.infer<typeof LoginSchema>;
