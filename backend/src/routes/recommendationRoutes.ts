import { Router } from 'express';
import { recommendationController } from '../controllers/recommendationController.js';

const router = Router();

router.post('/', (req, res) => recommendationController.getRecommendations(req, res));

export default router;
