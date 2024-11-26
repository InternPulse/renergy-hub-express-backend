require("dotenv").config({ path: "./.env" });

export const PORT = process.env.PORT;

export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const JWT_SECRET = `${process.env.JWT_SECRET}`;

export const PAYSTACK_SECRET = `${process.env.PAYSTACK_SECRET}`;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const NODE_ENV = process.env.NODE_ENV;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const GOOGLE_CLIENT_SECRETE = process.env.GOOGLE_CLIENT_SECRETE;

export const  COOKIE_KEY = `${process.env.COOKIE_KEY}`;

export const environment = process.env.NODE_ENV;

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;

export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;


