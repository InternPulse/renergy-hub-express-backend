import jwt from 'jsonwebtoken';
import { jwtSecrete } from './secrets'

export const generateAuthJWT = (user: any)=>{
  const token = jwt.sign({ id: user.id }, jwtSecrete, { expiresIn: '1h' });
  return token;
}