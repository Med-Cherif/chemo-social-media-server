import * as yup from "yup";
import { TObject } from "../types/object";
import { CustomGraphQLError } from "../helpers/errorsHandler";

export default function inputValidationResolver(
  resolver: (parent: any, args: any, context: any, info: any) => any,
  schema?: yup.ObjectSchema<TObject>,
  key: string | null = "data"
) {
  return async function (parent: any, args: any, context: any, info: any) {
    try {
      if (schema) {
        const data = key ? args[key] : args;
        await schema.validate(data, { abortEarly: false });
      }
      return resolver(parent, args, context, info);
    } catch (error: any) {
      let errors: { [prop: string]: string[] } = {};
      error.inner.forEach((err: any) => {
        const { path, message } = err;
        // console.log({ err });
        if (!errors[path]) {
          errors[path] = [message];
        } else {
          errors[path] = [...errors[path], message];
        }
      });
      throw new CustomGraphQLError("Bad Request", "BAD_USER_INPUT", 400, {
        errors,
      });
    }
  };
}
