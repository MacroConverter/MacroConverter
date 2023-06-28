import { Router, type RequestHandler } from 'express';
// import { getMacroFor, getAccessToken } from '../controllers/macroApiController';
import { searchFood, searchFoods } from '../controllers/macroApiController';

const router = Router();

router.get('/test/', (req, res) => {
  res.send('test');
});

router.post('/search/:foodName', searchFood as RequestHandler);

router.post('/search/', searchFoods as RequestHandler);

export default router;
