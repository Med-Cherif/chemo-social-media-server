import { Document, FilterQuery, Model } from "mongoose";
import bcrypt from "../helpers/bcrypt";
import UserModel from "../models/UserModel";
import { TObject } from "../types/object";

const userRepository = {
  async create(data: TObject) {
    const user = await UserModel.create({
      ...data,
      password: bcrypt.hash(data.password),
    });
    return user.toObject({
      transform(doc, ret, options) {
        delete ret.password;
      },
    });
  },

  updateById(id: string, data: TObject) {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).orFail();
  },

  getOne(filter: FilterQuery<TObject>) {
    return UserModel.findOne(filter);
  },
};

export default userRepository;
