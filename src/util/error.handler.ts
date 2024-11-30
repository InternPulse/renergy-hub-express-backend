import { Router, Request, Response, NextFunction } from "express";
import { fail } from "./response";

export default class CustomHttpError extends Error {
    httpStatusCode;
    timestamp;
   
    constructor(httpStatusCode: any, message: string) {
      if (message) {
        super(message);
      } else {
        super("A generic error occurred!");
      }
   
      // initializing the class properties
      this.httpStatusCode = httpStatusCode;
      this.timestamp = new Date().toISOString();
   
      // attaching a call stack to the current class,
      // preventing the constructor call to appear in the stack trace
      // Error.captureStackTrace(this, this.constructor);
    }
  }

/**
 * Init Express error handler
 *
 * @param {Router} router
 * @returns {void}
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) =>{
    // default HTTP status code and error message
    let httpStatusCode = 400;
    let message = "Error Occurred";
   
    // if the error is a custom defined error
    if (err instanceof CustomHttpError) {
      httpStatusCode = err.httpStatusCode;
      message = err.message;
    } else {
      // hide the detailed error message in production
      // for security reasons
      if (process.env.NODE_ENV !== "production") {
        // since in JavaScript you can also
        // directly throw strings
        if (typeof err === "string") {
          message = err;
        } else if (err instanceof Error) {
          message = err.message;
        }
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