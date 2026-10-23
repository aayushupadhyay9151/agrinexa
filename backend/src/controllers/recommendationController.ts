import { Request, Response } from 'express';
import { recommendationEngine } from '../services/recommendationEngine.js';

export class RecommendationController {
  async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const {
        latitude,
        longitude,
        soilType = 'Alluvial',
        soilPh = 6.8,
        irrigationAvailability = 'Canal Irrigation',
        plantingDate = new Date().toISOString().split('T')[0]
      } = req.body;

      if (latitude === undefined || longitude === undefined) {
        res.status(400).json({
          success: false,
          message: 'Valid latitude and longitude are required to evaluate regional crop compatibility.'
        });
        return;
      }

      const latNum = parseFloat(latitude);
      const lonNum = parseFloat(longitude);
      const phNum = parseFloat(soilPh) || 6.8;

      if (isNaN(latNum) || isNaN(lonNum)) {
        res.status(400).json({ success: false, message: 'Invalid coordinates provided.' });
        return;
      }

      const result = await recommendationEngine.recommendCrops(
        latNum,
        lonNum,
        soilType,
        phNum,
        irrigationAvailability,
        plantingDate
      );

      res.json({
        success: true,
        count: result.recommendations.length,
        ...result
      });
    } catch (err: any) {
      console.error('Error generating crop recommendations:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to generate crop recommendations: ' + err.message
      });
    }
  }
}

export const recommendationController = new RecommendationController();
