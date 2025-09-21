// --- Repositories ---
import {
  PrismaUserRepository,
  PrismaTaskRepository,
  PrismaTagRepository,
  PrismaCategoryRepository,
} from "./database/prisma/repositories";

// --- Services ---
import { BcryptPasswordHasher } from "./security/BcryptPasswordHasher";
import { JwtAuthService } from "./security/JwtAuthService";

// --- Use Cases ---
import {
  LoginUseCase,
  RegisterUserUseCase,
  GetUserByIdUseCase,
} from "../application/use-cases/auth";
import { CreateTaskUseCase } from "../application/use-cases/task";
import { GetTasksByUserUseCase } from "../application/use-cases/task/GetTasksByUser.usecase";
import {
  CreateTagUseCase,
  GetTagsByUserUseCase,
} from "../application/use-cases/tag";
import {
  CreateCategoryUseCase,
  GetCategoriesByUserUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "../application/use-cases/category";

// A simple container map
const container = new Map<string, any>();

// --- Instantiate and Register Dependencies (Singletons) ---

// Services
container.set("passwordHasher", new BcryptPasswordHasher());
container.set("authService", new JwtAuthService());

// Repositories
container.set("userRepository", new PrismaUserRepository());
container.set("taskRepository", new PrismaTaskRepository());
container.set("tagRepository", new PrismaTagRepository());
container.set("categoryRepository", new PrismaCategoryRepository());

//#region Auth & User Use Cases
container.set(
  "registerUserUseCase",
  new RegisterUserUseCase(
    container.get("userRepository"),
    container.get("passwordHasher")
  )
);
container.set(
  "loginUseCase",
  new LoginUseCase(
    container.get("userRepository"),
    container.get("passwordHasher"),
    container.get("authService")
  )
);
container.set(
  "getUserByIdUseCase",
  new GetUserByIdUseCase(container.get("userRepository"))
);
//#endregion

//#region Task Use Cases
container.set(
  "createTaskUseCase",
  new CreateTaskUseCase(container.get("taskRepository"))
);
container.set(
  "getTasksByUserUseCase",
  new GetTasksByUserUseCase(container.get("taskRepository"))
);
//#endregion

//#region Tag Use Cases
container.set(
  "createTagUseCase",
  new CreateTagUseCase(container.get("tagRepository"))
);
container.set(
  "getTagsByUserUseCase",
  new GetTagsByUserUseCase(container.get("tagRepository"))
);
//#endregion

//#region Category Use Cases
container.set(
  "createCategoryUseCase",
  new CreateCategoryUseCase(container.get("categoryRepository"))
);
container.set(
  "getCategoriesByUserUseCase",
  new GetCategoriesByUserUseCase(container.get("categoryRepository"))
);
container.set(
  "updateCategoryUseCase",
  new UpdateCategoryUseCase(container.get("categoryRepository"))
);
container.set(
  "deleteCategoryUseCase",
  new DeleteCategoryUseCase(container.get("categoryRepository"))
);
//#endregion

export { container };
