import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/signup", createUser);
authRouter.post("/login", loginUser);
