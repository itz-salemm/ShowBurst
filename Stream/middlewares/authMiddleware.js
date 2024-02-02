const { Request, Response, NextFunction } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Configure environment variables
dotenv.config();

// Define custom interface for Request object
const authMiddleware = (req, res, next) => {
  const token = req.header("authToken");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  const secret = process.env.SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  try {
    const decodedToken = jwt.verify(token, secret);
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
