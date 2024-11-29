import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from "./secrets";

export const generateAuthJWT = (user: any)=>{
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}