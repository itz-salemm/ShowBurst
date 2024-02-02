import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController";
import { verifyUser } from "../middlewares/verifyUser";

export const authRouter = Router();

authRouter.post("/signup", createUser);
authRouter.post("/login", loginUser);
