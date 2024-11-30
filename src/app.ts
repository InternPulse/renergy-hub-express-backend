import { Express, Request, Response } from "express";

import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./util";
import { verifyUserToken } from "./util/authorizeUser";
// import authRoutes from './routes/auth.route';
import { initOrderRoutes } from "./util/init";
import authRoutes from "./util/auth.routes";
import userRoutes from "./util/user.routes";
import { PORT } from "./util/secrets";

const apiVersion = "/api/v1";

const app: Express = express();
// Apply middleware
app.use(express.json());
app.use(cookieParser());

//auth routes
app.use("/api/v1/auth", authRoutes);

//user routes
app.use("/api/v1/users", userRoutes);

initOrderRoutes(app);

//GLobal error Handler
app.use(errorHandler);

app.get("/", verifyUserToken, (req: Request, res: Response) => {
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
