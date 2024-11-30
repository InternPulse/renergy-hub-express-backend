import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./secrets";

export const verifyUserToken = async (req: Request, res: Response, next: NextFunction)=>{
  const token = req.cookies.accessToken;
  if(!token){
    return res.status(401).json({
      status: "error",
      message: "token not found",
      description: "user not authorized to access this route",
    });
  }
  try{
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    if(!verifiedToken){
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
        description: "The stored token is invalid or has expired"
      });
    }
    next();
  }
  catch(err) {
    console.log(err);
  }
}