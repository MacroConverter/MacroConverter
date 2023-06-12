import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';

// Route imports
import ingredientsRoute from './routes/ingredients';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? '8000';

// Middleware to parse the request body
// (Express can only use postman x-www-form-urlencoded OR raw.
//    form-data is not possible without multer library)
app.use(express.urlencoded({ extended: true })); // For x-www-form-urlencoded
app.use(express.json()); // For raw

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server new value');
});

// Route init for ingredients
app.use('/ingredients', ingredientsRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
