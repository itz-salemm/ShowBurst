import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router();

authRouter.post("/signup", authMiddleware, createUser);
authRouter.post("/login", loginUser);
