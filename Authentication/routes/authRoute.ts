import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController";
import { verifyUser } from "../middlewares/verifyUser";

export const authRouter = Router();

authRouter.post("/signup", verifyUser, createUser);
authRouter.post("/login", loginUser);
