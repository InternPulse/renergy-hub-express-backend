import  { Express, Request, Response } from 'express';
import { Route } from './routes/route';
import express from 'express';
import { OrderRoute } from './routes/order.route';
import { PORT } from './secrets';
import { errorHandler } from './util';
import { AuthRoute } from './routes/auth.route';
import { initRoutes } from './routes/init';

const apiVersion = '/api/v1';

const app: Express = express();
// Apply middleware
app.use(express.json());

// const routes: Record<string, Route> = {
//     orders: new OrderRoute(),
//     auth: new AuthRoute()
// };

// const initRoutes = () => {
//     Object.entries(routes).forEach(([url, route]) => {
//       app.use(`${apiVersion}/${url}`, route.initRoutes());
//     });

// }

initRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//GLobal error Handler
app.use(errorHandler);

