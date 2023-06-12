import { Router } from 'express';
import { getWebIngredients } from '../controllers/ingredientsCtrlr';

const router = Router();

router.post('/web-scraper/', getWebIngredients);

export default router;
