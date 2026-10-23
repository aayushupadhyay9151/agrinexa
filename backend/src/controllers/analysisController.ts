import { Response } from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { CROP_CATALOG, CropProfile } from '../data/cropCatalog.js';
import { weatherService } from '../services/weatherService.js';
import { cropLifecycleEngine } from '../services/cropLifecycleEngine.js';
import { cropPredictionEngine } from '../services/cropPredictionEngine.js';
import { riskDetectionEngine } from '../services/riskDetectionEngine.js';
import { agronomyEngine } from '../services/agronomyEngine.js';

export class AnalysisController {
  /**
   * Execute new full crop prediction & farm intelligence analysis
   */
  async createAnalysis(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-user-agrinexa';
      const {
        cropName,
        country = 'India',
        state = '',
        district = '',
        village = '',
        latitude,
        longitude,
        landArea,
        landUnit = 'acre',
        soilType = 'Alluvial',
        soilPh = 6.8,
        irrigationAvailability = 'Canal',
        previousCrop = '',
        plantingDate,
        customDuration
      } = req.body;

      if (!cropName || latitude === undefined || longitude === undefined || !plantingDate) {
        res.status(400).json({
          success: false,
          message: 'Crop name, valid coordinates (latitude/longitude), and planting date are required.'
        });
        return;
      }

      const latNum = parseFloat(latitude);
      const lonNum = parseFloat(longitude);
      const areaNum = parseFloat(landArea) || 5;
      const phNum = parseFloat(soilPh) || 6.8;

      if (isNaN(latNum) || isNaN(lonNum)) {
        res.status(400).json({ success: false, message: 'Invalid coordinates provided.' });
        return;
      }

      // Find crop in catalog or construct custom crop
      const matchedProfile = CROP_CATALOG.find(
        (c) => c.name.toLowerCase() === cropName.toLowerCase() || c.id === cropName.toLowerCase()
      );

      const durationDays = customDuration
        ? parseInt(customDuration, 10)
        : matchedProfile
        ? Math.round((matchedProfile.duration_min + matchedProfile.duration_max) / 2)
        : 120;

      const cropProfile: CropProfile = matchedProfile || {
        id: 'custom-' + cropName.toLowerCase().replace(/\s+/g, '-'),
        name: cropName,
        scientific_name: `${cropName} spp.`,
        category: 'Custom Crop',
        duration_min: Math.max(60, durationDays - 15),
        duration_max: durationDays + 15,
        temp_min: 12,
        temp_max: 35,
        temp_ideal_min: 18,
        temp_ideal_max: 28,
        rainfall_ideal_min: 400,
        rainfall_ideal_max: 800,
        humidity_ideal_min: 50,
        humidity_ideal_max: 75,
        soil_types: [soilType, 'Loam', 'Alluvial'],
        soil_ph_min: 6.0,
        soil_ph_max: 7.5,
        seasons: ['All Season'],
        water_need: 'Medium',
        stages: [
          { name: 'Germination & Emergence', stageOrder: 1, durationPercent: 10, description: 'Seed sprout and initial leafing', idealTempMin: 18, idealTempMax: 26, waterSensitivity: 'Medium', vulnerabilities: ['Damping off'] },
          { name: 'Vegetative Growth', stageOrder: 2, durationPercent: 30, description: 'Foliage and canopy development', idealTempMin: 18, idealTempMax: 28, waterSensitivity: 'High', vulnerabilities: ['Nutrient deficiency'] },
          { name: 'Flowering / Reproductive', stageOrder: 3, durationPercent: 25, description: 'Bloom and pollination', idealTempMin: 20, idealTempMax: 26, waterSensitivity: 'Critical', vulnerabilities: ['Thermal stress'] },
          { name: 'Grain / Fruit Filling', stageOrder: 4, durationPercent: 20, description: 'Biomass and yield accumulation', idealTempMin: 18, idealTempMax: 26, waterSensitivity: 'Critical', vulnerabilities: ['Moisture deficit'] },
          { name: 'Maturity & Ripening', stageOrder: 5, durationPercent: 15, description: 'Drying and harvest maturity', idealTempMin: 18, idealTempMax: 28, waterSensitivity: 'Low', vulnerabilities: ['Wet weather lodging'] }
        ],
        fertilizerPlan: [
          { stage: 'Basal / Sowing', nutrient: 'N: 30%, P: 100%, K: 100%', purpose: 'Root establishment', recommendedInputs: ['Balanced NPK + Compost'], description: 'Apply in furrow at planting.' },
          { stage: 'Vegetative Stage', nutrient: 'N: 40%', purpose: 'Foliar growth', recommendedInputs: ['Nitrogen top-dressing'], description: 'Apply with soil moisture.' },
          { stage: 'Reproductive Stage', nutrient: 'N: 30%, Micronutrients', purpose: 'Yield quality', recommendedInputs: ['Foliar micronutrient spray'], description: 'Apply early morning.' }
        ],
        machinery: [
          { cropStage: 'Land Preparation', equipment: 'Tractor Cultivator / Harrow', purpose: 'Prepare loose tilth seedbed', timingWindow: '7 days before sowing' },
          { cropStage: 'Sowing', equipment: 'Seed Drill / Manual Sowing', purpose: 'Even spacing and depth placement', timingWindow: 'Day 0' },
          { cropStage: 'Maintenance', equipment: 'Sprayer / Weeder', purpose: 'Weed and pest management', timingWindow: 'Days 20–45' },
          { cropStage: 'Harvesting', equipment: 'Combine Harvester / Reaper', purpose: 'Timely crop cutting', timingWindow: `Days ${durationDays - 10}–${durationDays}` }
        ]
      };

      // Calculate estimated harvest date
      const harvestDate = cropLifecycleEngine.calculateHarvestDate(plantingDate, durationDays);

      // Build real weather timeline (forecast + climate outlook)
      const weatherData = await weatherService.buildCropWeatherTimeline(
        latNum,
        lonNum,
        plantingDate,
        harvestDate
      );

      // Calculate growth stages
      const lifecycleStages = cropLifecycleEngine.generateLifecycleStages(
        cropProfile,
        plantingDate,
        durationDays,
        weatherData.timeline
      );

      // Evaluate suitability
      const suitability = cropPredictionEngine.evaluateSuitability(
        cropProfile,
        weatherData.timeline,
        soilType,
        phNum,
        irrigationAvailability,
        plantingDate
      );

      // Detect environmental & weather risks
      const risks = riskDetectionEngine.detectRisks(
        cropProfile,
        lifecycleStages,
        weatherData.timeline,
        irrigationAvailability
      );

      // Generate fertilizer guidance
      const fertilizerInfo = agronomyEngine.generateFertilizerGuide(cropProfile, lifecycleStages);

      // Generate equipment recommendations
      const equipmentInfo = agronomyEngine.generateEquipmentPlan(cropProfile, lifecycleStages);

      // Generate smart alerts
      const smartAlerts = agronomyEngine.generateSmartAlerts(cropProfile, lifecycleStages, weatherData.timeline);

      const analysisId = 'anl-' + crypto.randomUUID();
      const createdAt = new Date().toISOString();

      // Persist to database
      db.prepare(`
        INSERT INTO crop_analyses (
          id, user_id, crop_name, country, state, district, village,
          latitude, longitude, land_area, land_unit, soil_type, soil_ph,
          irrigation_availability, previous_crop, planting_date, harvest_date,
          crop_duration_days, suitability_score, suitability_tier,
          weather_compatibility_json, risks_json, lifecycle_stages_json,
          fertilizer_recommendations_json, equipment_recommendations_json,
          weather_timeline_json, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?,
          ?, ?
        )
      `).run(
        analysisId,
        userId,
        cropProfile.name,
        country,
        state,
        district,
        village,
        latNum,
        lonNum,
        areaNum,
        landUnit,
        soilType,
        phNum,
        irrigationAvailability,
        previousCrop,
        plantingDate,
        harvestDate,
        durationDays,
        suitability.suitabilityScore,
        suitability.suitabilityTier,
        JSON.stringify(suitability.weatherCompatibility),
        JSON.stringify(risks),
        JSON.stringify(lifecycleStages),
        JSON.stringify(fertilizerInfo),
        JSON.stringify(equipmentInfo),
        JSON.stringify({
          current: weatherData.current,
          summary: weatherData.summary,
          // Limit timeline array in DB to avoid huge rows while keeping essential daily trend points
          timeline: weatherData.timeline.slice(0, 90)
        }),
        createdAt
      );

      // Store alerts for user
      const insertAlert = db.prepare(`
        INSERT INTO user_alerts (id, user_id, analysis_id, type, title, message, severity, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const al of smartAlerts) {
        insertAlert.run(
          'alt-' + crypto.randomUUID(),
          userId,
          analysisId,
          al.type,
          al.title,
          al.message,
          al.severity,
          createdAt
        );
      }

      res.status(201).json({
        success: true,
        message: 'Crop analysis generated successfully.',
        analysisId,
        report: {
          id: analysisId,
          crop: cropProfile,
          location: {
            country,
            state,
            district,
            village,
            latitude: latNum,
            longitude: lonNum
          },
          land: {
            area: areaNum,
            unit: landUnit,
            soilType,
            soilPh: phNum,
            irrigation: irrigationAvailability,
            previousCrop
          },
          timelineDates: {
            plantingDate,
            harvestDate,
            durationDays
          },
          suitability,
          currentWeather: weatherData.current,
          weatherSummary: weatherData.summary,
          weatherTimeline: weatherData.timeline,
          lifecycleStages,
          risks,
          fertilizer: fertilizerInfo,
          equipment: equipmentInfo,
          alerts: smartAlerts,
          createdAt
        }
      });
    } catch (err: any) {
      console.error('Create analysis error:', err);
      res.status(500).json({ success: false, message: 'Failed to process crop analysis: ' + err.message });
    }
  }

  /**
   * Get all analyses created by user
   */
  async getUserAnalyses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-user-agrinexa';
      const rows = db.prepare(`
        SELECT id, crop_name, country, state, district, village, latitude, longitude,
               land_area, land_unit, soil_type, planting_date, harvest_date,
               crop_duration_days, suitability_score, suitability_tier, created_at
        FROM crop_analyses
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(userId) as any[];

      res.json({ success: true, count: rows.length, analyses: rows });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to fetch user analyses', error: err.message });
    }
  }

  /**
   * Get single analysis report by ID
   */
  async getAnalysisById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const row = db.prepare('SELECT * FROM crop_analyses WHERE id = ?').get(id) as any;

      if (!row) {
        res.status(404).json({ success: false, message: 'Crop analysis report not found' });
        return;
      }

      const weatherObj = JSON.parse(row.weather_timeline_json);
      const crop = CROP_CATALOG.find((c) => c.name.toLowerCase() === row.crop_name.toLowerCase()) || {
        id: row.crop_name.toLowerCase(),
        name: row.crop_name,
        scientific_name: `${row.crop_name} spp.`,
        category: 'Agricultural Crop',
        duration_min: row.crop_duration_days,
        duration_max: row.crop_duration_days,
        temp_min: 10,
        temp_max: 35,
        temp_ideal_min: 18,
        temp_ideal_max: 28,
        rainfall_ideal_min: 400,
        rainfall_ideal_max: 800,
        humidity_ideal_min: 50,
        humidity_ideal_max: 75,
        soil_types: [row.soil_type],
        soil_ph_min: 6.0,
        soil_ph_max: 7.5,
        seasons: ['Season'],
        water_need: 'Medium',
        stages: [],
        fertilizerPlan: [],
        machinery: []
      };

      res.json({
        success: true,
        report: {
          id: row.id,
          userId: row.user_id,
          crop,
          location: {
            country: row.country,
            state: row.state,
            district: row.district,
            village: row.village,
            latitude: row.latitude,
            longitude: row.longitude
          },
          land: {
            area: row.land_area,
            unit: row.land_unit,
            soilType: row.soil_type,
            soilPh: row.soil_ph,
            irrigation: row.irrigation_availability,
            previousCrop: row.previous_crop
          },
          timelineDates: {
            plantingDate: row.planting_date,
            harvestDate: row.harvest_date,
            durationDays: row.crop_duration_days
          },
          suitability: {
            suitabilityScore: row.suitability_score,
            suitabilityTier: row.suitability_tier,
            weatherCompatibility: JSON.parse(row.weather_compatibility_json),
            disclaimer: 'The AgriNexa Suitability Score is an agronomic index based on environmental and weather conditions. Consult agricultural extensions for verified local recommendations.'
          },
          currentWeather: weatherObj.current,
          weatherSummary: weatherObj.summary,
          weatherTimeline: weatherObj.timeline,
          lifecycleStages: JSON.parse(row.lifecycle_stages_json),
          risks: JSON.parse(row.risks_json),
          fertilizer: JSON.parse(row.fertilizer_recommendations_json),
          equipment: JSON.parse(row.equipment_recommendations_json),
          createdAt: row.created_at
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to retrieve analysis report', error: err.message });
    }
  }

  /**
   * Delete an analysis
   */
  async deleteAnalysis(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      let result;
      if (userId) {
        result = db.prepare('DELETE FROM crop_analyses WHERE id = ? AND user_id = ?').run(id, userId);
      } else {
        result = db.prepare('DELETE FROM crop_analyses WHERE id = ?').run(id);
      }

      if (result.changes === 0) {
        res.status(404).json({ success: false, message: 'Analysis not found or permission denied' });
        return;
      }

      res.json({ success: true, message: 'Analysis deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to delete analysis', error: err.message });
    }
  }
}

export const analysisController = new AnalysisController();
