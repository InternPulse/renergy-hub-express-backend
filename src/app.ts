import { Express, Request, Response } from "express";
import express from "express";
import { errorHandler } from "./util";
// import authRoutes from './routes/auth.route';
import { initOrderRoutes } from "./util/init";
import authRoutes from "./util/auth.routes";
import { PORT } from "./util/secrets";

const apiVersion = "/api/v1";

const app: Express = express();
// Apply middleware
app.use(express.json());

//auth routes
app.use("/api/v1/auth", authRoutes);

initOrderRoutes(app);

//GLobal error Handler
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
