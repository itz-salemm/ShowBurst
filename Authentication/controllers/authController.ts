import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    // Check if the email already exists
    const isEmailAlreadyExist = await User.findOne({ email });

    if (isEmailAlreadyExist) {
      return res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send the newUser as response
    res.status(201).json({
      status: 201,
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    // Log the error for debugging
    console.error(error);

    // Send the error message to the client
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Wrong password",
      });
    }

    const secret: string | undefined = process.env.SECRET;

    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables");
    }

    const token = jwt.sign({ _id: user._id, email: user.email }, secret, {
      expiresIn: "1d",
    });

    // Save token as a cookie
    res.cookie("authToken", token, { httpOnly: true, maxAge: 86400000 }); // 1 day expiration

    res.header("authToken", token);

    // Send the response with the token
    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error: any) {
    // Send the error message to the client
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};
