import userService from "../services/userService";
import { passwordSchema } from "../validators/userFieldsValidators";
import * as yup from "yup";

const registerSchema = yup.object({
  username: yup
    .string()
    .required()
    .min(3)
    .test("unique username", "Username exists", async function (value, ctx) {
      const user = await userService.getByUsername(value);
      return !user;
    }),
  name: yup.string().required().min(3),
  email: yup
    .string()
    .required()
    .email()
    .test("unique email", "Email exists", async function (value) {
      const user = await userService.getByEmail(value);
      return !user;
    }),
  // "gender": "MALE",
  ...passwordSchema(yup),
});

export default registerSchema;
