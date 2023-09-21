import bcrypt from "../helpers/bcrypt";
import errorsHandler, { CustomGraphQLError } from "../helpers/errorsHandler";
import jsonWebTokens from "../helpers/jsonWebTokens";
import inputValidationResolver from "../resolversMiddlewares/inputValidationResolver";
import userService from "../services/userService";
import { GraphQLError } from "graphql";
import * as yup from "yup";
import registerSchema from "../validationSchemas/registerSchema";
import { TObject } from "../types/object";
import { passwordSchema } from "../validators/userFieldsValidators";
import authResolver from "../resolversMiddlewares/authResolver";
import updatePasswordSchema from "../validationSchemas/updatePasswordSchema";

const schema = yup.object().shape({
  email: yup.string().required().email(),
});

export default {
  Mutation: {
    register: inputValidationResolver(async (_: any, args: any) => {
      const { user } = await userService.create(args.data);
      const accessToken = jsonWebTokens.generateAccessToken(
        user._id.toString()
      );
      return {
        accessToken,
        user,
      };
    }, registerSchema),

    async login(_: any, args: any) {
      const { field, password } = args.data;
      const user = await userService.getByField(field).select("+password");

      if (!user) {
        throw new CustomGraphQLError("Invalid credentials", undefined, 400);
      }

      const doesMatch = bcrypt.compare(password, user.password);

      if (!doesMatch) {
        throw new CustomGraphQLError("Invalid credentials", undefined, 400);
      }

      const u = { ...user.toObject() } as TObject;

      delete u.password;

      return {
        user: u,
        accessToken: jsonWebTokens.generateAccessToken(user._id.toString()),
      };
    },

    updatePassword: authResolver(
      inputValidationResolver(
        async (_, args) => {
          const { userID, password } = args;
          throw new CustomGraphQLError(
            "Document not FOUND",
            "BAD_REQUEST",
            404
          );
          // const user = await userService.updateUserPassword(userID, password);
          // return user;
        },
        updatePasswordSchema,
        null
      )
    ),
  },
};
