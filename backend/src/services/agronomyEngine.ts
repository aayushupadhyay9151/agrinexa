import { CropProfile } from '../data/cropCatalog.js';
import { CalculatedStage } from './cropLifecycleEngine.js';
import { DailyWeatherPoint } from './weatherService.js';

export interface FertilizerRecommendation {
  cropStage: string;
  targetNutrients: string; // e.g. "N: 30%, P: 100%, K: 100%"
  purpose: string;
  recommendedInputs: string[];
  applicationGuidance: string;
  timingWindow: string;
}

export interface EquipmentRecommendation {
  operation: string;
  cropStage: string;
  equipment: string;
  purpose: string;
  timingWindow: string;
}

export interface SmartAlert {
  id: string;
  type: 'rain' | 'temperature' | 'irrigation' | 'harvest' | 'general';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
}

export class AgronomyEngine {
  /**
   * Synthesize stage-specific fertilizer schedule
   */
  generateFertilizerGuide(
    crop: CropProfile,
    stages: CalculatedStage[]
  ): {
    schedule: FertilizerRecommendation[];
    disclaimer: string;
  } {
    const schedule: FertilizerRecommendation[] = crop.fertilizerPlan.map((plan, idx) => {
      // Find matching stage date
      const matchedStage = stages.find((s) => s.name.toLowerCase().includes(plan.stage.toLowerCase().split(' ')[0])) || stages[Math.min(idx, stages.length - 1)];

      return {
        cropStage: plan.stage,
        targetNutrients: plan.nutrient,
        purpose: plan.purpose,
        recommendedInputs: plan.recommendedInputs,
        applicationGuidance: plan.description,
        timingWindow: matchedStage ? `${matchedStage.startDate} to ${matchedStage.endDate}` : 'As scheduled'
      };
    });

    return {
      schedule,
      disclaimer: 'Agronomic fertilizer recommendations provide general nutrient management principles. Actual dosage rates must be customized based on a physical soil health laboratory test card and local agro-climatic extension guidelines.'
    };
  }

  /**
   * Generate farm equipment & machinery requirements
   */
  generateEquipmentPlan(
    crop: CropProfile,
    stages: CalculatedStage[]
  ): EquipmentRecommendation[] {
    return crop.machinery.map((mach, idx) => {
      const matchedStage = stages.find((s) => s.name.toLowerCase().includes(mach.cropStage.toLowerCase().split(' ')[0])) || stages[Math.min(idx, stages.length - 1)];

      return {
        operation: mach.cropStage,
        cropStage: matchedStage?.name || mach.cropStage,
        equipment: mach.equipment,
        purpose: mach.purpose,
        timingWindow: mach.timingWindow
      };
    });
  }

  /**
   * Generate smart alerts based on weather forecasts and stage progress
   */
  generateSmartAlerts(
    crop: CropProfile,
    stages: CalculatedStage[],
    timeline: DailyWeatherPoint[]
  ): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    const now = new Date().toISOString();

    // 1. Rain Alert in the coming 7 days
    const upcomingRain = timeline.slice(0, 7).filter((pt) => pt.precipitationSum >= 5);
    if (upcomingRain.length > 0) {
      const topRain = upcomingRain.reduce((max, pt) => (pt.precipitationSum > max.precipitationSum ? pt : max), upcomingRain[0]);
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        type: 'rain',
        title: 'Rainfall Expected in Upcoming Window',
        message: `Rainfall of approximately ${topRain.precipitationSum} mm forecasted on ${topRain.date}. Defer scheduled foliar chemical sprays and check field drainage.`,
        severity: topRain.precipitationSum > 20 ? 'warning' : 'info',
        timestamp: now
      });
    }

    // 2. High Temperature / Dry alert
    const hotNextDays = timeline.slice(0, 7).filter((pt) => pt.maxTemp > crop.temp_ideal_max + 2);
    if (hotNextDays.length > 0) {
      alerts.push({
        id: `alert-temp-${Date.now()}`,
        type: 'temperature',
        title: 'Elevated Temperature Advisory',
        message: `Temperatures approaching ${hotNextDays[0].maxTemp}°C over the next few days. Ensure soil root zone does not undergo moisture stress.`,
        severity: 'warning',
        timestamp: now
      });
    }

    // 3. Irrigation Reminder
    const dryNextDays = timeline.slice(0, 7).every((pt) => pt.precipitationSum < 1);
    if (dryNextDays && crop.water_need !== 'Low') {
      alerts.push({
        id: `alert-irrigation-${Date.now()}`,
        type: 'irrigation',
        title: 'Irrigation Scheduling Window',
        message: 'No precipitation forecasted for the next 7 days. Monitor field soil moisture and plan next irrigation cycle accordingly.',
        severity: 'info',
        timestamp: now
      });
    }

    // 4. Harvest Reminder
    const harvestStage = stages[stages.length - 1];
    if (harvestStage) {
      alerts.push({
        id: `alert-harvest-${Date.now()}`,
        type: 'harvest',
        title: 'Harvest Window Target',
        message: `Projected harvest period begins on ${harvestStage.startDate}. Line up harvesting equipment and storage capacity in advance.`,
        severity: 'success',
        timestamp: now
      });
    }

    return alerts;
  }
}

export const agronomyEngine = new AgronomyEngine();
