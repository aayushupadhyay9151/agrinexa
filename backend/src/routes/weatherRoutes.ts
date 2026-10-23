import { Router } from 'express';
import { weatherController } from '../controllers/weatherController.js';

const router = Router();

router.get('/geocode', (req, res) => weatherController.geocode(req, res));
router.get('/reverse-geocode', (req, res) => weatherController.reverseGeocode(req, res));
router.get('/ip-location', (req, res) => weatherController.getIpLocation(req, res));
router.get('/current', (req, res) => weatherController.getCurrent(req, res));
router.get('/forecast', (req, res) => weatherController.getForecast(req, res));
router.get('/outlook', (req, res) => weatherController.getOutlook(req, res));
router.get('/crop-analysis', (req, res) => weatherController.getCropTimeline(req, res));

export default router;
