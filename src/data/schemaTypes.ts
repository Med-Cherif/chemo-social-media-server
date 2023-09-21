import { Schema } from "mongoose";

export const fileSchemaType = {
  type: Schema.Types.ObjectId,
  ref: "File",
  default: null,
};

export const userSchemaType = {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
};

export const postSchemaType = {
  type: Schema.Types.ObjectId,
  ref: "Post",
  required: true,
};
