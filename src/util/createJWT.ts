import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./secrets";

export const createJWT = (payload: { userID: string; role: string }) => {
  const accessToken = jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return accessToken;
};
