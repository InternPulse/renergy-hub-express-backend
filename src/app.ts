import { Express, Request, Response } from "express";
import { Route } from "./routes/route";
import express from "express";
import { OrderRoute } from "./routes/orderRoute";
import { PORT } from "./secrets";
import { initRoutes } from "./routes/init";
import { errorHandler } from "./util";


const app: Express = express();
// Apply middleware
app.use(express.json());



initRoutes(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//GLobal error Handler
app.use(errorHandler);
