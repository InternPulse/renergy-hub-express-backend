import  { Express, Request, Response } from 'express';
import { Route } from './routes/route';
import express from 'express';
import { OrderRoute } from './routes/orderRoute';
//import { PORT } from './secrets';
import { initRoutes } from './routes/init';
import { errorHandler } from './util';
import router from './routes/orderitemsroute';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app: Express = express();
// Apply middleware
app.use(express.json());
app.use("/api/v1", router);

const PORT = process.env.PORT 
prisma.$connect();
    console.log("Connected to the database successfully!");
initRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//GLobal error Handler
app.use(errorHandler)


