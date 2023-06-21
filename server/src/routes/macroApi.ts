import { Router } from 'express';
// import { getMacroFor, getAccessToken } from '../controllers/macroApiController';

const router = Router();

// router.post('/login/', getAccessToken);
// router.post('/web-scraper/', getMacroFor);
router.get('/test/', (req, res) => {
  res.send('test');
});

export default router;
