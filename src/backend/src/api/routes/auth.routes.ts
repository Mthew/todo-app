import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();
const authController = new AuthController(); // We will create this controller

authRouter.post("/register", authController.register);

export { authRouter };
