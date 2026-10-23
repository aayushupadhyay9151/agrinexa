import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, (req, res) => profileController.getProfile(req, res));
router.put('/', requireAuth, (req, res) => profileController.updateProfile(req, res));
router.put('/password', requireAuth, (req, res) => profileController.changePassword(req, res));
router.delete('/', requireAuth, (req, res) => profileController.deleteAccount(req, res));

export default router;
