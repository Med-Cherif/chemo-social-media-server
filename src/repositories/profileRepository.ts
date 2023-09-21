import ProfileModel from "../models/ProfileModel";
import { TObject } from "../types/object";

const profileRepository = {
  create(data: TObject) {
    return ProfileModel.create(data);
  },
};

export default profileRepository;
