
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "./secrets";
import CustomHttpError from "./error.handler";


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


export const authorizeUserRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction)=>{
    const user = req.user as {
      userID: string;
      role: string;
    };

    if(!user){
      return res.status(401).json({
        status: 'error',
        code: '401',
        message: 'Unauthorized: No user data',
      });
    }

    if(roles.includes((user).role)){
      next()
    }else{
      res.status(403).json({
        status: "error",
        code: "403",
        message: "Forbiden: User is forbidden to access this resource"
      })
  }
}
};

export const authorizeUserOrderRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction)=>{
    const user = req.user as {
      userID: string;
      role: string;
    };

    try 
    {
      if(!user)
        throw new CustomHttpError(400, 'Unauthorized: No user data');

      if(!roles.includes((user).role))
        throw new CustomHttpError(403, "Forbiden: User is forbidden to access this resource");
      
      next();
    } 
    catch (err) 
    {
      next(err); // Forward the error to the error-handling middleware
    }


    // if(!user){
    //   return res.status(401).json({
    //     status: 'error',
    //     code: '401',
    //     message: 'Unauthorized: No user data',
    //   });
    // }

    
}
};

