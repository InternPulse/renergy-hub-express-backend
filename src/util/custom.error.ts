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
      Error.captureStackTrace(this, this.constructor);
    }
  }