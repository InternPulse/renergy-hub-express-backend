import { Router, Request, Response, NextFunction } from "express";
import { fail } from "./response";
import ValidationError from "./validation.error";
import CustomHttpError from "./custom.error";
 

/**
 * Init Express error handler
 *
 * @param {Router} router
 * @returns {void}
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    // default HTTP status code and error message
    let httpStatusCode = 500;
    let message = "Error Occurred";

    console.log(err instanceof CustomHttpError);
   
    // if the error is a custom defined error
    if (err instanceof CustomHttpError) {
      console.log("Custom Error")
      message = err.message;
      httpStatusCode = err.httpStatusCode;
    } 
    else 
    {

      if (typeof err === "string") {
        message = err;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
    }
   
    let stackTrace = undefined;
   
    // return the stack trace only when
    // developing locally or in stage
    if (process.env.NODE_ENV !== "production") {
      stackTrace = err.stack;
    }
   
    // logg the error
    console.error(err);
    // other custom behaviors...
   
    // return the standard error response
    // res.status(httpStatusCode).send({
    //   error: {
    //     message: message
    //   },
    // });

    fail(res, httpStatusCode, message);
   
    // return next(err);
  };