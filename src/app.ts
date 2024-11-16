import  { Express, Request, Response } from 'express';
import express from 'express';
import { PORT } from './util/secrets';
import { errorHandler } from './util';
import { initOrderRoutes } from './util/init';

const apiVersion = '/api/v1';

const app: Express = express();
// Apply middleware
app.use(express.json());


initOrderRoutes(app);

//GLobal error Handler
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



