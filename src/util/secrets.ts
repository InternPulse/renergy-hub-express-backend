require("dotenv").config({ path: "./.env" });

export const PORT = process.env.PORT;

export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const NODE_ENV = process.env.NODE_ENV;
