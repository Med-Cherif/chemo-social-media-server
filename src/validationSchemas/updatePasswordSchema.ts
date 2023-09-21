import * as yup from "yup";

const updatePasswordSchema = yup.object({
  password: yup.string().required().min(6),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Password must match"),
});

export default updatePasswordSchema;
