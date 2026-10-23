import { Router } from 'express';
import { cropController } from '../controllers/cropController.js';

const router = Router();

router.get('/', (req, res) => cropController.getAllCrops(req, res));
router.get('/:id', (req, res) => cropController.getCropById(req, res));

export default router;
