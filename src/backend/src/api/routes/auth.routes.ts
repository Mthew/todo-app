import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validator.middleware";
import {
  RegisterUserSchema,
  LoginSchema,
} from "../../application/dtos/auth.dto";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validate(RegisterUserSchema),
  authController.register
);
authRouter.post("/login", validate(LoginSchema), authController.login);

export { authRouter };
