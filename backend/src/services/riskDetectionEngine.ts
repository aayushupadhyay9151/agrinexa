import { CropProfile } from '../data/cropCatalog.js';
import { CalculatedStage } from './cropLifecycleEngine.js';
import { DailyWeatherPoint } from './weatherService.js';

export interface AgroRisk {
  id: string;
  title: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  affectedStage: string;
  expectedPeriod: string;
  description: string;
  recommendedPrecaution: string;
}

export class RiskDetectionEngine {
  /**
   * Scan timeline, stages and environmental factors for potential agricultural risks
   */
  detectRisks(
    crop: CropProfile,
    stages: CalculatedStage[],
    timeline: DailyWeatherPoint[],
    irrigationAvailability: string
  ): AgroRisk[] {
    const risks: AgroRisk[] = [];

    // 1. Heat Stress Check
    const hotDays = timeline.filter((pt) => pt.maxTemp > crop.temp_ideal_max + 3);
    if (hotDays.length > 0) {
      const peakHotDay = hotDays.reduce((max, pt) => (pt.maxTemp > max.maxTemp ? pt : max), hotDays[0]);
      // Find which stage this falls into
      const affectedStage = stages.find((s) => peakHotDay.date >= s.startDate && peakHotDay.date <= s.endDate) || stages[Math.min(3, stages.length - 1)];

      const isHigh = hotDays.length > 8 || peakHotDay.maxTemp >= crop.temp_max;
      risks.push({
        id: 'heat-stress',
        title: 'Thermal / Heat Stress',
        riskLevel: isHigh ? 'High' : 'Moderate',
        affectedStage: affectedStage.name,
        expectedPeriod: `Around ${peakHotDay.date} (${hotDays.length} elevated days projected)`,
        description: `Projected peak daytime temperatures will touch ${peakHotDay.maxTemp}°C, which exceeds the ideal physiological threshold (${crop.temp_ideal_max}°C) for ${crop.name}.`,
        recommendedPrecaution: 'Schedule light, frequent irrigations during evening hours to cool the root microclimate. Maintain mulch cover if practical to minimize soil moisture evaporation.'
      });
    }

    // 2. Low Temperature / Frost Risk
    const coldDays = timeline.filter((pt) => pt.minTemp < crop.temp_ideal_min - 4);
    if (coldDays.length > 0) {
      const lowestDay = coldDays.reduce((min, pt) => (pt.minTemp < min.minTemp ? pt : min), coldDays[0]);
      const affectedStage = stages.find((s) => lowestDay.date >= s.startDate && lowestDay.date <= s.endDate) || stages[0];

      const isHigh = lowestDay.minTemp <= crop.temp_min;
      risks.push({
        id: 'frost-cold',
        title: lowestDay.minTemp < 6 ? 'Ground Frost & Cold Wave' : 'Low Temperature Retardation',
        riskLevel: isHigh ? 'High' : 'Moderate',
        affectedStage: affectedStage.name,
        expectedPeriod: `Window around ${lowestDay.date} (min ${lowestDay.minTemp}°C)`,
        description: `Nighttime lows drop to ${lowestDay.minTemp}°C, slowing metabolic growth and enzymatic activity during ${affectedStage.name}.`,
        recommendedPrecaution: 'Apply light evening furrow irrigation to raise soil thermal mass and create damp ground smoke/smudge covers on anticipated frost nights.'
      });
    }

    // 3. Heavy Rain / Waterlogging Risk
    const heavyRainDays = timeline.filter((pt) => pt.precipitationSum >= 25);
    const rainyMaturity = stages.find((s) => s.name.toLowerCase().includes('matur') || s.name.toLowerCase().includes('harvest'));
    let maturityRainy = false;
    if (rainyMaturity) {
      maturityRainy = timeline.some(
        (pt) => pt.date >= rainyMaturity.startDate && pt.date <= rainyMaturity.endDate && pt.precipitationSum >= 15
      );
    }

    if (heavyRainDays.length > 0 || maturityRainy) {
      const maxRainDay = timeline.reduce((max, pt) => (pt.precipitationSum > max.precipitationSum ? pt : max), timeline[0]);
      const isHigh = maxRainDay.precipitationSum > 50 || maturityRainy;

      risks.push({
        id: 'heavy-rain',
        title: maturityRainy ? 'Pre-Harvest Wet Weather / Lodging' : 'Excess Rainfall & Waterlogging',
        riskLevel: isHigh ? 'High' : 'Moderate',
        affectedStage: maturityRainy ? (rainyMaturity?.name || 'Maturity') : 'Vegetative & Root Zones',
        expectedPeriod: `Peak precipitation events around ${maxRainDay.date} (~${maxRainDay.precipitationSum} mm)`,
        description: maturityRainy
          ? 'Unseasonal rainfall during the ripening window can cause plant lodging, grain discoloration, or premature germination in the ear.'
          : 'Heavy localized rainfall may lead to surface pooling and temporary root anoxia in poorly drained plots.',
        recommendedPrecaution: 'Inspect and clear perimeter drainage furrows; avoid scheduled fertilizer top-dressings immediately before heavy rainfall events.'
      });
    }

    // 4. Dry Spell / Drought Stress
    const isRainfed = irrigationAvailability.toLowerCase().includes('rainfed');
    let consecutiveDryDays = 0;
    let maxDryStretch = 0;
    for (const pt of timeline) {
      if (pt.precipitationSum < 1) {
        consecutiveDryDays++;
        if (consecutiveDryDays > maxDryStretch) maxDryStretch = consecutiveDryDays;
      } else {
        consecutiveDryDays = 0;
      }
    }

    if (maxDryStretch >= 14 && isRainfed) {
      risks.push({
        id: 'dry-spell',
        title: 'Extended Dry Spell',
        riskLevel: maxDryStretch >= 21 ? 'High' : 'Moderate',
        affectedStage: 'Mid-Season Vegetative & Flowering',
        expectedPeriod: `Up to ${maxDryStretch} consecutive days without significant rainfall`,
        description: 'Protracted absence of precipitation will induce moisture deficit in rainfed acreage during critical vegetative elongation.',
        recommendedPrecaution: 'Apply straw or crop residue mulching to suppress soil water evaporation. Prioritize supplemental life-saving irrigation if a water source is accessible.'
      });
    }

    // 5. High Humidity / Disease Favorability
    const humidHumid = timeline.filter((pt) => pt.humidity >= 80 && pt.meanTemp >= 20 && pt.meanTemp <= 30);
    if (humidHumid.length >= 5) {
      risks.push({
        id: 'disease-humidity',
        title: 'Fungal & Foliar Disease Favorability',
        riskLevel: humidHumid.length > 12 ? 'High' : 'Moderate',
        affectedStage: 'Canopy Density & Flowering',
        expectedPeriod: `${humidHumid.length} days with combined high humidity (>80%) and warm ambient temperatures`,
        description: 'Persistent leaf wetness combined with moderate-warm temperatures creates optimal microclimate conditions for fungal spore germination (e.g. rust, blight, powdery mildew).',
        recommendedPrecaution: 'Conduct weekly field scouting on leaf undersides. Ensure proper plant spacing for air circulation and consider prophylactic bio-fungicide or copper spray if lesions appear.'
      });
    }

    // Fallback baseline low risk if everything is completely ideal
    if (risks.length === 0) {
      risks.push({
        id: 'routine-monitoring',
        title: 'Favorable Agro-Climatic Window',
        riskLevel: 'Low',
        affectedStage: 'Entire Growth Cycle',
        expectedPeriod: 'Throughout cultivation',
        description: 'No severe thermal or precipitation anomalies detected against standard crop physiological parameters.',
        recommendedPrecaution: 'Adhere to standard good agricultural practices (GAP), routine weed scouting, and timely irrigation scheduling.'
      });
    }

    return risks;
  }
}

export const riskDetectionEngine = new RiskDetectionEngine();
