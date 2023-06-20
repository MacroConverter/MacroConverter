import { Router } from 'express';

import { getWebIngredientsWrapper } from '../controllers/ingredientCtrlr';

const router = Router();

router.post('/web-scraper/', getWebIngredientsWrapper);

export default router;
