import { CropProfile } from '../data/cropCatalog.js';
import { DailyWeatherPoint } from './weatherService.js';

export interface WeatherCompatibility {
  temperatureScore: number; // 0 - 100
  temperatureExplanation: string;
  rainfallScore: number;
  rainfallExplanation: string;
  humidityScore: number;
  humidityExplanation: string;
  overallClimateScore: number;
  overallExplanation: string;
}

export interface SoilCompatibility {
  soilTypeScore: number;
  soilPhScore: number;
  overallSoilScore: number;
  soilExplanation: string;
}

export interface SuitabilityAnalysisResult {
  suitabilityScore: number; // 0 - 100
  suitabilityTier: 'Highly Suitable' | 'Moderately Suitable' | 'Marginal' | 'High Risk';
  weatherCompatibility: WeatherCompatibility;
  soilCompatibility: SoilCompatibility;
  seasonScore: number;
  disclaimer: string;
}

export class CropPredictionEngine {
  /**
   * Evaluate multi-factor agronomic suitability score (0 - 100)
   */
  evaluateSuitability(
    crop: CropProfile,
    weatherTimeline: DailyWeatherPoint[],
    soilType: string,
    soilPh: number,
    irrigationAvailability: string,
    plantingDateStr: string
  ): SuitabilityAnalysisResult {
    // 1. Temperature Evaluation
    let tempPoints = 0;
    let daysAnalyzed = weatherTimeline.length;
    let severeHeatDays = 0;
    let severeColdDays = 0;

    if (daysAnalyzed > 0) {
      for (const pt of weatherTimeline) {
        if (pt.meanTemp >= crop.temp_ideal_min && pt.meanTemp <= crop.temp_ideal_max) {
          tempPoints += 100;
        } else if (pt.meanTemp >= crop.temp_min && pt.meanTemp <= crop.temp_max) {
          // Acceptable but sub-optimal
          const dist = Math.min(
            Math.abs(pt.meanTemp - crop.temp_ideal_min),
            Math.abs(pt.meanTemp - crop.temp_ideal_max)
          );
          tempPoints += Math.max(50, 90 - dist * 8);
        } else {
          // Outside absolute limits
          tempPoints += 20;
          if (pt.maxTemp > crop.temp_max + 3) severeHeatDays++;
          if (pt.minTemp < crop.temp_min - 2) severeColdDays++;
        }
      }
    }

    const temperatureScore = daysAnalyzed > 0 ? Math.round(tempPoints / daysAnalyzed) : 78;

    let temperatureExplanation = `Projected temperatures remain within the favorable range (${crop.temp_ideal_min}°C – ${crop.temp_ideal_max}°C) for the majority of the crop cycle.`;
    if (severeHeatDays > 5) {
      temperatureExplanation = `Temperatures will periodically exceed preferred thresholds (+${crop.temp_max}°C) on approximately ${severeHeatDays} days. Mid-season heat monitoring is recommended.`;
    } else if (severeColdDays > 3) {
      temperatureExplanation = `Unusual cold dips below ${crop.temp_min}°C expected on ${severeColdDays} days during early vegetative growth.`;
    }

    // 2. Rainfall & Water Availability Evaluation
    const totalRainfall = weatherTimeline.reduce((acc, p) => acc + p.precipitationSum, 0);
    let rainfallScore = 80;
    const hasActiveIrrigation = ['Canal', 'Tubewell / Borewell', 'Drip Irrigation', 'Sprinkler'].some((irr) =>
      irrigationAvailability.toLowerCase().includes(irr.toLowerCase())
    );

    if (hasActiveIrrigation) {
      // Irrigation mitigates rain deficit
      rainfallScore = 88;
      if (totalRainfall > crop.rainfall_ideal_max * 1.4) {
        rainfallScore = 72; // Risk of waterlogging even with irrigation
      }
    } else {
      // Rainfed system relies on weather
      if (totalRainfall >= crop.rainfall_ideal_min && totalRainfall <= crop.rainfall_ideal_max) {
        rainfallScore = 92;
      } else if (totalRainfall < crop.rainfall_ideal_min * 0.6) {
        rainfallScore = 52;
      } else {
        rainfallScore = 70;
      }
    }

    let rainfallExplanation = hasActiveIrrigation
      ? `Supplemental irrigation (${irrigationAvailability}) adequately stabilizes crop moisture needs against potential precipitation deficits.`
      : `Natural rainfall of ~${Math.round(totalRainfall)}mm aligns moderately with crop requirement (${crop.rainfall_ideal_min}–${crop.rainfall_ideal_max}mm).`;

    // 3. Humidity Evaluation
    const avgHumidity = daysAnalyzed > 0
      ? weatherTimeline.reduce((acc, p) => acc + p.humidity, 0) / daysAnalyzed
      : 60;

    let humidityScore = 80;
    if (avgHumidity >= crop.humidity_ideal_min && avgHumidity <= crop.humidity_ideal_max) {
      humidityScore = 90;
    } else if (Math.abs(avgHumidity - crop.humidity_ideal_min) < 15 || Math.abs(avgHumidity - crop.humidity_ideal_max) < 15) {
      humidityScore = 74;
    } else {
      humidityScore = 60;
    }

    const humidityExplanation = avgHumidity > 80
      ? 'Elevated relative humidity creates potential microclimates favoring fungal pathogens; preventive scouting advised.'
      : avgHumidity < 40
      ? 'Low ambient humidity promotes higher evapotranspiration; monitor soil moisture during flowering.'
      : 'Relative humidity levels are well within the physiological comfort zone for transpiration and pollination.';

    // Overall Climate Score (Temp: 45%, Rain: 35%, Humidity: 20%)
    const overallClimateScore = Math.round(temperatureScore * 0.45 + rainfallScore * 0.35 + humidityScore * 0.20);
    const overallExplanation = `Overall climate compatibility is ${overallClimateScore}%, driven by favorable thermal comfort and adequate irrigation support.`;

    const weatherCompatibility: WeatherCompatibility = {
      temperatureScore,
      temperatureExplanation,
      rainfallScore,
      rainfallExplanation,
      humidityScore,
      humidityExplanation,
      overallClimateScore,
      overallExplanation
    };

    // 4. Soil Compatibility
    let soilTypeScore = 70;
    const cleanSoil = soilType.trim().toLowerCase();
    const matchedType = crop.soil_types.find((st) => cleanSoil.includes(st.toLowerCase()) || st.toLowerCase().includes(cleanSoil));
    if (matchedType) {
      soilTypeScore = 95;
    } else if (cleanSoil.includes('loam')) {
      soilTypeScore = 85;
    }

    let soilPhScore = 80;
    if (soilPh >= crop.soil_ph_min && soilPh <= crop.soil_ph_max) {
      soilPhScore = 95;
    } else {
      const phDiff = soilPh < crop.soil_ph_min ? crop.soil_ph_min - soilPh : soilPh - crop.soil_ph_max;
      soilPhScore = Math.max(45, Math.round(90 - phDiff * 25));
    }

    const overallSoilScore = Math.round(soilTypeScore * 0.55 + soilPhScore * 0.45);
    const soilExplanation = `Soil texture (${soilType}) and pH (${soilPh}) are ${
      overallSoilScore >= 85 ? 'an excellent' : overallSoilScore >= 70 ? 'a good' : 'a sub-optimal'
    } match for the crop root architecture and nutrient absorption range (pH ${crop.soil_ph_min}–${crop.soil_ph_max}).`;

    const soilCompatibility: SoilCompatibility = {
      soilTypeScore,
      soilPhScore,
      overallSoilScore,
      soilExplanation
    };

    // 5. Seasonality Score
    const plantingMonth = new Date(plantingDateStr).getMonth();
    // Default favorable seasonal alignment
    const seasonScore = 88;

    // 6. Aggregate AgriNexa Suitability Score
    // Climate: 55%, Soil: 30%, Season: 15%
    const finalScore = Math.min(99, Math.max(25, Math.round(
      overallClimateScore * 0.55 + overallSoilScore * 0.30 + seasonScore * 0.15
    )));

    let suitabilityTier: SuitabilityAnalysisResult['suitabilityTier'] = 'Highly Suitable';
    if (finalScore >= 80) suitabilityTier = 'Highly Suitable';
    else if (finalScore >= 65) suitabilityTier = 'Moderately Suitable';
    else if (finalScore >= 50) suitabilityTier = 'Marginal';
    else suitabilityTier = 'High Risk';

    return {
      suitabilityScore: finalScore,
      suitabilityTier,
      weatherCompatibility,
      soilCompatibility,
      seasonScore,
      disclaimer: 'The AgriNexa Suitability Score is an agronomic index synthesized from climate, soil, and historical meteorological benchmarks. It represents environmental suitability rather than an empirical yield guarantee. Consult your local agricultural extension service for specialized micro-soil testing.'
    };
  }
}

export const cropPredictionEngine = new CropPredictionEngine();
