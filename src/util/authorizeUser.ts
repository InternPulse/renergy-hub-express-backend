
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./secrets";


export const verifyUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      sucess: false,
      error: {
        message: "Unauthorized user",
      },
    });
  }

  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired token",
      },
    });
  }
};
