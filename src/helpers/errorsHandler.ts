import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { TObject } from "../types/object";

export type TErrorCode = keyof typeof ApolloServerErrorCode;

export interface TErrorData {
  message: string;
  code: string;
  status: number;
}

export class CustomGraphQLError extends GraphQLError {
  constructor(
    message: string,
    code?: TErrorCode,
    statusCode?: number,
    metaData: TObject = {}
  ) {
    super(message, {
      extensions: {
        code: code || ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
        http: {
          status: statusCode || 500,
        },
        ...metaData,
      },
    });
  }
}

// throw new CustomGraphQLError('', '', undefined)

// new GraphQLError('', {
//   extensions: {
//     code: '',
//     http: {
//       status: 200
//     }
//   }
// })

export const throwGraphQlError = ({ message, code, status }: TErrorData) => {
  throw new GraphQLError(message, {
    extensions: {
      code,
      http: {
        status,
      },
    },
  });
};

const errorsHandler = {
  badRequestError(message: string) {
    return throwGraphQlError({ message, code: "BAD_USER_INPUT", status: 400 });
  },
};

export default errorsHandler;
