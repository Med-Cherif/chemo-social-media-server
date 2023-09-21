import { Schema, model } from "mongoose";
import ENUM_GENDERS from "../data/genders";

/**
 * Update password
 * Upload Profile Picture
 * Upload Cover Picture
 * Update Email
 * Update Username
 */

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      default: "PREFER_NOT_TO_SAY",
      enum: ENUM_GENDERS,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema, "users");

export default UserModel;
