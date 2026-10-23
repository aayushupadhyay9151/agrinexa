import { Request, Response } from 'express';
import { db } from '../db/database.js';

export class CropController {
  /**
   * List all agronomic crops
   */
  async getAllCrops(req: Request, res: Response): Promise<void> {
    try {
      const rows = db.prepare('SELECT * FROM crops ORDER BY name ASC').all() as any[];
      const crops = rows.map((r) => ({
        id: r.id,
        name: r.name,
        scientific_name: r.scientific_name,
        category: r.category,
        duration_min: r.duration_min,
        duration_max: r.duration_max,
        temp_min: r.temp_min,
        temp_max: r.temp_max,
        temp_ideal_min: r.temp_ideal_min,
        temp_ideal_max: r.temp_ideal_max,
        rainfall_ideal_min: r.rainfall_ideal_min,
        rainfall_ideal_max: r.rainfall_ideal_max,
        humidity_ideal_min: r.humidity_ideal_min,
        humidity_ideal_max: r.humidity_ideal_max,
        soil_types: r.soil_types.split(','),
        soil_ph_min: r.soil_ph_min,
        soil_ph_max: r.soil_ph_max,
        seasons: r.seasons.split(','),
        water_need: r.water_need,
        stages: JSON.parse(r.stages_json),
        fertilizerPlan: JSON.parse(r.fertilizer_json),
        machinery: JSON.parse(r.machinery_json)
      }));

      res.json({ success: true, count: crops.length, crops });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve crops catalog', error: err.message });
    }
  }

  /**
   * Get single crop by ID
   */
  async getCropById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const r = db.prepare('SELECT * FROM crops WHERE id = ?').get(id) as any;

      if (!r) {
        res.status(404).json({ success: false, message: 'Crop not found in catalog' });
        return;
      }

      res.json({
        success: true,
        crop: {
          id: r.id,
          name: r.name,
          scientific_name: r.scientific_name,
          category: r.category,
          duration_min: r.duration_min,
          duration_max: r.duration_max,
          temp_min: r.temp_min,
          temp_max: r.temp_max,
          temp_ideal_min: r.temp_ideal_min,
          temp_ideal_max: r.temp_ideal_max,
          rainfall_ideal_min: r.rainfall_ideal_min,
          rainfall_ideal_max: r.rainfall_ideal_max,
          humidity_ideal_min: r.humidity_ideal_min,
          humidity_ideal_max: r.humidity_ideal_max,
          soil_types: r.soil_types.split(','),
          soil_ph_min: r.soil_ph_min,
          soil_ph_max: r.soil_ph_max,
          seasons: r.seasons.split(','),
          water_need: r.water_need,
          stages: JSON.parse(r.stages_json),
          fertilizerPlan: JSON.parse(r.fertilizer_json),
          machinery: JSON.parse(r.machinery_json)
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch crop details', error: err.message });
    }
  }
}

export const cropController = new CropController();
