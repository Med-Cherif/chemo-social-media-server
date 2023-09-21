import { ACCESS_TOKEN_SECRET } from "../config/jwtTokensSecrets";
import {
  CustomGraphQLError,
  throwGraphQlError,
} from "../helpers/errorsHandler";
import jwt from "jsonwebtoken";

export default function authResolver(
  resolver: (parent: any, args: any, context: any, info: any) => any
) {
  return (parent: any, args: any, context: any, info: any) => {
    let token = context.req.headers.authorization;

    if (!token) {
      throw new CustomGraphQLError("Unauthorized", undefined, 401);
    }

    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      /*
       * !! TO DO
       * Check token and user existing in Redis and DB
       */

      return resolver(
        parent,
        {
          ...args,
          userID: (decoded as jwt.JwtPayload)._id,
        },
        context,
        info
      );
    } catch (error) {
      throw new CustomGraphQLError("Unauthorized", undefined, 401);
    }
  };
}
