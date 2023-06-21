import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

// Route imports
import apiRoutes from './routes/macroApi';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? '8000';

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server new value');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
