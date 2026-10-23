import { Router } from 'express';
import { analysisController } from '../controllers/analysisController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Allow optional auth so guest / demo users can also generate an analysis,
// but attach to user account if logged in
router.post('/', optionalAuth, (req, res) => analysisController.createAnalysis(req, res));
router.get('/', optionalAuth, (req, res) => analysisController.getUserAnalyses(req, res));
router.get('/:id', optionalAuth, (req, res) => analysisController.getAnalysisById(req, res));
router.delete('/:id', optionalAuth, (req, res) => analysisController.deleteAnalysis(req, res));

export default router;
