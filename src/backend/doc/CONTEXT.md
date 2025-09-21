Excellent idea. A `CONTEXT.md` file is a powerful tool for any serious project. It's the "architect's note" that explains the _why_ behind the structure, not just the _what_. It helps new developers (including your future self and the technical evaluator) understand the design philosophy and make decisions consistent with the architecture.

Here is a comprehensive `CONTEXT.md` file tailored to the backend project we've designed. You should place this file in the `backend/` directory.

---

# Project Context: Backend Architecture

This document provides a high-level overview of the backend's architectural design, principles, and key decisions. Its purpose is to onboard developers quickly and ensure the long-term maintainability and scalability of the codebase.

## 1. Core Architectural Philosophy: Clean Architecture

This project is built following the principles of **Clean Architecture** (also known as Ports and Adapters or Hexagonal Architecture). The primary goal is the **separation of concerns**, ensuring that the core business logic is independent of external frameworks, databases, and UI.

The fundamental rule governing this architecture is **The Dependency Rule**: _Source code dependencies must only point inwards._

```
+-------------------------------------------------------------------+
|  Layer 4: API & Infrastructure (Express, Prisma, Bcrypt)          |
|      +-------------------------------------------------------+    |
|      |        Layer 2: Application (Use Cases)               |    |
|      |            +-----------------------------------+       |    |
|      |            |      Layer 1: Domain (Entities)   |       |    |
|      |            +-----------------------------------+       |    |
|      +-------------------------------------------------------+    |
+-------------------------------------------------------------------+
       <---------- Dependencies Point Inwards (arrow direction) ----
```

This means:

- The **Domain** knows nothing about the other layers.
- The **Application** layer only knows about the **Domain**.
- The **Infrastructure** and **API** layers know about the Application and Domain, but the reverse is not true.

## 2. Breakdown of Layers

The `src/` directory is organized into four primary layers:

### a. `domain/` (The Core)

- **Responsibility:** Contains the enterprise-wide business logic and rules. It represents the concepts of the business, not the application.
- **Contents:**
  - **Entities:** Plain classes or interfaces (`Task`, `User`) that encapsulate core data and business rules (e.g., a Task title cannot be empty).
  - **Types:** Value objects or enums (`Priority`) that are part of the domain language.
- **Key Rule:** This layer has **zero dependencies** on any other layer or external framework. It's pure TypeScript.

### b. `application/` (The Use Cases)

- **Responsibility:** Orchestrates the flow of data to and from the domain. It contains the application-specific business rules.
- **Contents:**
  - **Use Cases:** Classes that execute a single application task (e.g., `CreateTaskUseCase`, `RegisterUserUseCase`). They contain the sequence of steps to achieve a goal.
  - **Ports (Interfaces):** Defines the contracts for outside communication (e.g., `ITaskRepository`, `IPasswordHasher`). This layer dictates what the infrastructure _must_ do, without knowing _how_ it does it.
  - **DTOs (Data Transfer Objects):** Simple data structures used to pass data into and out of the use cases.

### c. `infrastructure/` (The Implementation Details)

- **Responsibility:** Provides the concrete implementations for the ports defined in the Application layer. It's the bridge to the outside world.
- **Contents:**
  - **Adapters:** Concrete classes that implement the ports. For example, `PrismaTaskRepository` implements `ITaskRepository` using Prisma. `BcryptPasswordHasher` implements `IPasswordHasher`.
  - **Database:** All database-related code, including the Prisma client, schema definitions, and repository implementations.
  - **External Services:** Connectors to any other external service (e.g., email, payment gateways).

### d. `api/` (The Delivery Mechanism)

- **Responsibility:** The outermost layer, responsible for handling communication with the client (in this case, over HTTP).
- **Contents:**
  - **Controllers:** Parse HTTP requests, call the appropriate use case with validated data, and format the HTTP response.
  - **Routes:** Map URLs and HTTP methods to controller actions.
  - **Middlewares:** Handle concerns like authentication, logging, and error handling.
  - **Server Setup:** The main `app.ts` and `server.ts` files that bootstrap the Express application.
- **Key Rule:** This layer should be as "thin" as possible. Its job is translation, not business logic.

## 3. Technology & Rationale

| Technology     | Purpose            | Rationale                                                                                                                                             |
| :------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PNPM**       | Package Management | Chosen for its efficiency in a monorepo context, fast installation speeds, and prevention of "phantom dependencies."                                  |
| **TypeScript** | Language           | Provides static typing for robust, self-documenting, and less error-prone code, which is essential for a layered architecture.                        |
| **Prisma**     | ORM                | Offers a type-safe database client that integrates perfectly with TypeScript. Its declarative schema makes migrations straightforward.                |
| **Express.js** | Web Framework      | A minimal and unopinionated framework that serves perfectly as the thin API layer without imposing its own architectural constraints.                 |
| **Zod**        | Schema Validation  | A TypeScript-first validation library that allows us to define schemas for request bodies (DTOs) and ensure data integrity at the edge of the system. |
| **Bcrypt.js**  | Password Hashing   | The industry standard for securely hashing user passwords.                                                                                            |
| **JWT**        | Authentication     | A stateless and widely adopted standard for securing API endpoints.                                                                                   |

## 4. Data Flow Example: Creating a New Task

To understand how the layers interact, consider the flow of a `POST /api/tasks` request:

1.  **API Layer:** The `task.routes.ts` file maps the request to the `TaskController`.
2.  **API Layer:** The `TaskController` validates the request body (using Zod), creates a `CreateTaskDTO`, and calls the `CreateTaskUseCase`.
3.  **Application Layer:** The `CreateTaskUseCase` receives the DTO. It creates a new `Task` entity from the DTO data.
4.  **Application Layer:** The use case calls the `save()` method on its `ITaskRepository` port, passing the new `Task` entity.
5.  **Infrastructure Layer:** The Dependency Injection container provides the `PrismaTaskRepository` as the concrete implementation.
6.  **Infrastructure Layer:** `PrismaTaskRepository` uses its internal `PrismaClient` to execute an `INSERT` command into the `tareas` table. It maps the database result back into a `Task` entity.
7.  **Flow Reversal:** The newly created `Task` entity (now with an ID) is returned back up through the use case and the controller.
8.  **API Layer:** The `TaskController` sends a `201 Created` HTTP response with the task data to the client.

## 5. Developer's Guide: How to Add a New Feature

When adding a new feature, follow the dependency rule by working from the inside out:

1.  **Domain:** Does this feature introduce a new business concept? If so, create or modify an entity in `domain/`.
2.  **Application:**
    - Define the necessary contracts in `application/ports/` (e.g., `INewFeatureRepository`).
    - Create the DTOs for input/output in `application/dtos/`.
    - Write the `NewFeatureUseCase` in `application/use-cases/`.
3.  **Infrastructure:** Implement the port's interface from step 2 inside the `infrastructure/` layer (e.g., `PrismaNewFeatureRepository`).
4.  **API:**
    - Create a `NewFeatureController`.
    - Wire up the controller, use case, and its dependencies (ideally via a DI container).
    - Add the new route in `api/routes/`.

By following this pattern, we ensure our core logic remains pure and testable, and the system as a whole remains flexible and easy to maintain.
