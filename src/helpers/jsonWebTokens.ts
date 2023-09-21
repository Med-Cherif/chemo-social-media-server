import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/jwtTokensSecrets";

const jsonWebTokens = {
  generateAccessToken(_id: string) {
    return jwt.sign({ _id }, ACCESS_TOKEN_SECRET);
  },
};

export default jsonWebTokens;
