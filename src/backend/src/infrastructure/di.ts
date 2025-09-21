// --- Repositories ---
import {
  PrismaUserRepository,
  PrismaTaskRepository,
} from "./database/prisma/repositories";

// --- Services ---
import { BcryptPasswordHasher } from "./security/BcryptPasswordHasher";
import { JwtAuthService } from "./security/JwtAuthService";

// --- Use Cases ---
import { RegisterUserUseCase } from "../application/use-cases/auth/RegisterUser.usecase";
// import { LoginUseCase } from "../application/use-cases/auth/Login.usecase";
// import { CreateTaskUseCase } from "../application/use-cases/task/CreateTask.usecase";

// A simple container map
const container = new Map<string, any>();

// --- Instantiate and Register Dependencies (Singletons) ---

// Services
container.set("passwordHasher", new BcryptPasswordHasher());
container.set("authService", new JwtAuthService());

// Repositories
container.set("userRepository", new PrismaUserRepository());
container.set("taskRepository", new PrismaTaskRepository());

// Use Cases - This is where we wire everything together
container.set(
  "registerUserUseCase",
  new RegisterUserUseCase(
    container.get("userRepository"),
    container.get("passwordHasher")
  )
);
// container.set(
//   "loginUseCase",
//   new LoginUseCase(
//     container.get("userRepository"),
//     container.get("passwordHasher"),
//     container.get("authService")
//   )
// );
// container.set(
//   "createTaskUseCase",
//   new CreateTaskUseCase(container.get("taskRepository"))
// );
// ... register other use cases here as you create them

export { container };
