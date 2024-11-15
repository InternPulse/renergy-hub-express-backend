import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets.ts';
import router from './routes/orderRoutes.ts';
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('ORDER MANAGEMENT APIs');
});

//api endpoints
app.use('/api/v1/orders', router)

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
