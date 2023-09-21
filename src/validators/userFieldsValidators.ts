import { TYup } from "../types/yup";

export function passwordSchema(yup: TYup) {
  return {
    password: yup.string().required().min(6),
    passwordConfirmation: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Password must match"),
  };
}
