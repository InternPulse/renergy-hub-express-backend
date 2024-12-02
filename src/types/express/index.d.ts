declare namespace Express {
  export interface Request {
    user?: {
      userID: number;
      [key: string]: any;
    };
  }
} 