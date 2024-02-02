import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request as ExpressRequest } from "express";

import dotenv from "dotenv";

//configure env;
dotenv.config();

interface RequestWithUserData extends ExpressRequest {
  userData?: { userId: string }; // Define your custom userData object structure here
}

export const authMiddleware = (
  req: RequestWithUserData,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authToken");
  //const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  const secret: string | undefined = process.env.SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.userData = decodedToken as { userId: string };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
