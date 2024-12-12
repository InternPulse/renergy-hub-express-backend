import { Express, Request, Response } from "express";

import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./util";
// import { verifyUserToken } from "./util/authorizeUser";
// import authRoutes from './routes/auth.route';
import { initOrderRoutes } from "./util/init";
import authRoutes from "./util/auth.routes";
import userRoutes from "./util/user.routes";
import productRoutes from "./product-management/productRoute";
import productInformationRoutes from "./product-management/productInformationRoute";
import { PORT } from "./util/secrets";
// import cors from "cors";

const apiVersion = "/api/v1";

const app: Express = express();
// Apply middleware
app.use(express.json());

// app.use(cors());

app.use(function (_, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://renergy-hub-frontendxyz.vercel.app, http://localhost:5173"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

app.use(cookieParser());

//auth routes
app.use("/api/v1/auth", authRoutes);

//user routes
app.use("/api/v1/users", userRoutes);

//Product routes
app.use("/api/v1/products", productRoutes);

//Product Information routes
app.use("/api/v1/products", productInformationRoutes);

initOrderRoutes(app);

//GLobal error Handler
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Test social login on the browser
app.get("/social-login", (req: Request, res: Response) => {
  res.send("<a href = '/api/v1/auth/google'>Login with google</a>");
});

//Test protected routes
// app.get("/dashboard", verifyUserToken, (req, res)=>{
//   res.send("Dashboard here");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
