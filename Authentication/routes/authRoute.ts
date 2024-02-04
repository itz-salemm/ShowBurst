import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController";
import { verifyUser, verifyAdmin } from "../middlewares/verifyUser";

export const authRouter = Router();

authRouter.post("/signup", verifyUser, verifyAdmin, createUser);
authRouter.post("/login", loginUser);
