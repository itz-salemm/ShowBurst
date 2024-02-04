import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user", // Set default value to "user"
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("Users", UserSchema);
