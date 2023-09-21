import bcrypt from "../helpers/bcrypt";
import profileRepository from "../repositories/profileRepository";
import userRepository from "../repositories/userRepository";
import { TObject } from "../types/object";

const userService = {
  async create(data: TObject) {
    const user = await userRepository.create(data);
    const profile = await profileRepository.create({ user: user._id });

    return {
      user,
      profile,
    };
  },

  getByUsername(username: string) {
    return userRepository.getOne({ username });
  },

  getByEmail(email: string) {
    return userRepository.getOne({ email });
  },

  // getByPhoneNumber(phone: string) {
  //   return userRepository.getOne({  })
  // },

  updateUserPassword(id: string, password: string) {
    return userRepository.updateById(id, { password: bcrypt.hash(password) });
  },

  getByField(field: string) {
    return userRepository.getOne({
      $or: [{ email: field }, { username: field }],
    });
  },
};

export default userService;
