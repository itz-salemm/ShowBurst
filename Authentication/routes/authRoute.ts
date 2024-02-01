import { Router } from "express";
import { createUser, login } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/signup", createUser);
authRouter.post("/login", login);
