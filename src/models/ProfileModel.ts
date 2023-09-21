import { model, Schema } from "mongoose";
import { fileSchemaType, userSchemaType } from "../data/schemaTypes";

const ProfileSchema = new Schema({
  user: userSchemaType,
  bio: {
    type: String,
    default: "",
  },
  profilePicture: fileSchemaType,
  coverPicture: fileSchemaType,
  followers: [userSchemaType],
  followings: [userSchemaType],
  requests: [userSchemaType],
  isPrivate: {
    type: Boolean,
    default: false,
  },
});

const ProfileModel = model("Profile", ProfileSchema, "profiles");

export default ProfileModel;
