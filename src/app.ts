import  { Express, Request, Response } from 'express';
import { Route } from './routes/route';
import express from 'express';
import { OrderRoute } from './routes/orderRoute';
import { PORT } from './secrets';
import { initRoutes } from './routes/init';
// import { initRoutes } from './routes/init.ts';

const app: Express = express();

const apiVersion = '/api/v1';

initRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



