import { Router } from 'express';
import { getWebIngredientsWrapper } from '../controllers/ingredientsCtrlr';

const router = Router();

router.post('/web-scraper/', getWebIngredientsWrapper);

export default router;
