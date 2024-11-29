import { NextFunction, Request, Response } from "express";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./secrets";

import * as jwt from "jsonwebtoken";

// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
  
    if (!token) {
      return res.status(403).send("No token provided");
    }
  
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      console.log(decoded);
      next();
    });
  };