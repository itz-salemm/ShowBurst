import express from "express";
import { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// Create the express app and  import the type of app from express;
const app: Application = express();

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

app.get("/", (req, res) => {
  res.send("<h1>Welcome To JWT Authentication </h1>");
});

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
