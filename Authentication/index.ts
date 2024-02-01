import express from "express";
import { Application } from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import { authRouter } from "./routes/authRoute";
import { authMiddleware } from "./middlewares/authMiddleware";
import cors from "cors";
import dotenv from "dotenv";

// Create the express app and  import the type of app from express;
const app: Application = express();

app.use(json());

// Cors
app.use(cors());
//configure env;
dotenv.config();
// Parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// Declare The PORT Like This
const PORT: number = 4000;
app.use("/api/auth", authRouter);

// Listen the server
app.listen(PORT, async () => {
  console.log(`🗄️  Server Fire on http:localhost//${PORT}`);

  // Connect To The Database
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("🛢️  Connected To Database");
  } catch (error) {
    console.log("⚠️ Error to connect Database");
  }
});
