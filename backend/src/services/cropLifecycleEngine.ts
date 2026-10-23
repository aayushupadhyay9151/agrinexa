import { CropProfile, CropStageDefinition } from '../data/cropCatalog.js';
import { DailyWeatherPoint } from './weatherService.js';

export interface CalculatedStage {
  name: string;
  stageOrder: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  description: string;
  idealTempMin: number;
  idealTempMax: number;
  waterSensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities: string[];
  expectedWeather?: {
    avgTemp: number;
    totalRainfall: number;
    avgHumidity: number;
    tempStatus: 'Optimal' | 'Warm' | 'Cool' | 'Extreme';
  };
}

export class CropLifecycleEngine {
  /**
   * Calculate harvest date based on planting date and crop duration
   */
  calculateHarvestDate(plantingDateStr: string, durationDays: number): string {
    const plantingDate = new Date(plantingDateStr);
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + durationDays);
    return harvestDate.toISOString().split('T')[0];
  }

  /**
   * Generate stages with exact calendar date windows and integrate weather timeline
   */
  generateLifecycleStages(
    crop: CropProfile,
    plantingDateStr: string,
    durationDays: number,
    weatherTimeline?: DailyWeatherPoint[]
  ): CalculatedStage[] {
    const plantingDate = new Date(plantingDateStr);
    let cumulativeDays = 0;

    const stages: CalculatedStage[] = crop.stages.map((stageDef, index) => {
      // Scale stage duration percentage to total duration
      let stageDays = Math.round((stageDef.durationPercent / 100) * durationDays);
      if (stageDays < 1) stageDays = 1;

      // Adjust last stage to match total duration exactly
      if (index === crop.stages.length - 1) {
        stageDays = Math.max(1, durationDays - cumulativeDays);
      }

      const stageStart = new Date(plantingDate);
      stageStart.setDate(stageStart.getDate() + cumulativeDays);

      const stageEnd = new Date(stageStart);
      stageEnd.setDate(stageEnd.getDate() + stageDays - 1);

      cumulativeDays += stageDays;

      const startDateStr = stageStart.toISOString().split('T')[0];
      const endDateStr = stageEnd.toISOString().split('T')[0];

      // Extract weather points that fall inside this stage window
      let expectedWeather: CalculatedStage['expectedWeather'] | undefined = undefined;

      if (weatherTimeline && weatherTimeline.length > 0) {
        const stageWeather = weatherTimeline.filter((pt) => {
          return pt.date >= startDateStr && pt.date <= endDateStr;
        });

        if (stageWeather.length > 0) {
          const avgTemp = Math.round((stageWeather.reduce((s, p) => s + p.meanTemp, 0) / stageWeather.length) * 10) / 10;
          const totalRainfall = Math.round(stageWeather.reduce((s, p) => s + p.precipitationSum, 0) * 10) / 10;
          const avgHumidity = Math.round(stageWeather.reduce((s, p) => s + p.humidity, 0) / stageWeather.length);

          let tempStatus: 'Optimal' | 'Warm' | 'Cool' | 'Extreme' = 'Optimal';
          if (avgTemp > stageDef.idealTempMax + 4 || avgTemp < stageDef.idealTempMin - 4) {
            tempStatus = 'Extreme';
          } else if (avgTemp > stageDef.idealTempMax) {
            tempStatus = 'Warm';
          } else if (avgTemp < stageDef.idealTempMin) {
            tempStatus = 'Cool';
          }

          expectedWeather = {
            avgTemp,
            totalRainfall,
            avgHumidity,
            tempStatus
          };
        }
      }

      return {
        name: stageDef.name,
        stageOrder: stageDef.stageOrder,
        durationDays: stageDays,
        startDate: startDateStr,
        endDate: endDateStr,
        description: stageDef.description,
        idealTempMin: stageDef.idealTempMin,
        idealTempMax: stageDef.idealTempMax,
        waterSensitivity: stageDef.waterSensitivity,
        vulnerabilities: stageDef.vulnerabilities,
        expectedWeather
      };
    });

    return stages;
  }
}

export const cropLifecycleEngine = new CropLifecycleEngine();
