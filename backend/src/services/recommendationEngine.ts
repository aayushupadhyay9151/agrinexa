import { CROP_CATALOG, CropProfile } from '../data/cropCatalog.js';
import { cropPredictionEngine } from './cropPredictionEngine.js';
import { weatherService, DailyWeatherPoint } from './weatherService.js';

export interface CropRecommendationItem {
  crop: {
    id: string;
    name: string;
    scientific_name: string;
    category: string;
    durationDays: number;
    waterNeed: string;
    seasons: string[];
  };
  rank: number;
  suitabilityScore: number;
  suitabilityTier: string;
  difficulty: 'Beginner Friendly' | 'Moderate Care' | 'Advanced Management';
  investmentLevel: 'Low' | 'Medium' | 'High';
  keyAdvantage: string;
  beginnerRationale: string;
  managementTip: string;
  weatherSummary: {
    temperatureMatch: number;
    rainfallMatch: number;
    humidityMatch: number;
  };
}

export class RecommendationEngine {
  /**
   * Determine beginner-friendliness difficulty
   */
  private getDifficulty(cropId: string): 'Beginner Friendly' | 'Moderate Care' | 'Advanced Management' {
    switch (cropId) {
      case 'wheat':
      case 'barley':
      case 'pearl-millet':
      case 'green-gram':
      case 'mustard':
        return 'Beginner Friendly';
      case 'maize':
      case 'soybean':
      case 'chickpea':
      case 'groundnut':
      case 'sunflower':
      case 'potato':
      case 'onion':
        return 'Moderate Care';
      case 'cotton':
      case 'rice':
      case 'sugarcane':
      case 'tomato':
      case 'chili':
      case 'ginger':
      case 'turmeric':
      default:
        return 'Advanced Management';
    }
  }

  /**
   * Determine estimated capital investment level
   */
  private getInvestmentLevel(cropId: string): 'Low' | 'Medium' | 'High' {
    switch (cropId) {
      case 'pearl-millet':
      case 'barley':
      case 'green-gram':
      case 'mustard':
      case 'chickpea':
        return 'Low';
      case 'wheat':
      case 'maize':
      case 'soybean':
      case 'groundnut':
      case 'sunflower':
      case 'onion':
        return 'Medium';
      case 'potato':
      case 'tomato':
      case 'cotton':
      case 'rice':
      case 'sugarcane':
      case 'chili':
      case 'ginger':
      case 'turmeric':
      default:
        return 'High';
    }
  }

  /**
   * Human-readable rationale for beginners
   */
  private generateRationale(crop: CropProfile, score: number, isIrrigated: boolean): { keyAdvantage: string; beginnerRationale: string; tip: string } {
    if (score >= 80) {
      return {
        keyAdvantage: `Thrives in your local temperature range (${crop.temp_ideal_min}°C–${crop.temp_ideal_max}°C) with strong soil compatibility.`,
        beginnerRationale: `Ideal match for your land and season. High tolerance to environmental variations, forgiving for growers with minimal farming experience.`,
        tip: `Follow the basal fertilizer recommendations at sowing time and ensure moisture during the initial 3 weeks.`
      };
    } else if (score >= 65) {
      return {
        keyAdvantage: `Good physiological compatibility; water requirements align moderately with your setup.`,
        beginnerRationale: `Viable choice with standard yields if weed management and timely watering are maintained.`,
        tip: isIrrigated ? `Maintain supplemental watering during flowering.` : `Check weekly rainfall forecasts before critical vegetative stages.`
      };
    } else {
      return {
        keyAdvantage: `Marginal climate or soil fit; requires specialized microclimate controls.`,
        beginnerRationale: `May face heat, cold, or moisture stress under current weather trends without high experience.`,
        tip: `Recommend choosing a higher-ranked alternative for your first cultivation cycle.`
      };
    }
  }

  /**
   * Rank all crops for an unknown farmer based on location, soil, and season
   */
  async recommendCrops(
    lat: number,
    lon: number,
    soilType = 'Alluvial',
    soilPh = 6.8,
    irrigationAvailability = 'Canal Irrigation',
    plantingDateStr = new Date().toISOString().split('T')[0]
  ): Promise<{
    recommendations: CropRecommendationItem[];
    topPick: CropRecommendationItem;
    summaryNotice: string;
  }> {
    // 1. Fetch current weather and 14-day forecast for the location
    const forecast = await weatherService.getDailyForecast(lat, lon, 14);

    // 2. Fetch baseline climate outlook for 90 days
    const outlookEndDate = new Date(plantingDateStr);
    outlookEndDate.setDate(outlookEndDate.getDate() + 90);
    const climateOutlook = await weatherService.getHistoricalSeasonalOutlook(
      lat,
      lon,
      plantingDateStr,
      outlookEndDate.toISOString().split('T')[0]
    );

    const mergedTimeline: DailyWeatherPoint[] = [...forecast, ...climateOutlook];
    const isIrrigated = !irrigationAvailability.toLowerCase().includes('rainfed');

    // 3. Score every crop in the catalog
    const scoredList: CropRecommendationItem[] = CROP_CATALOG.map((crop) => {
      const durationDays = Math.round((crop.duration_min + crop.duration_max) / 2);
      const suitability = cropPredictionEngine.evaluateSuitability(
        crop,
        mergedTimeline,
        soilType,
        soilPh,
        irrigationAvailability,
        plantingDateStr
      );

      const difficulty = this.getDifficulty(crop.id);
      const investmentLevel = this.getInvestmentLevel(crop.id);
      const rationale = this.generateRationale(crop, suitability.suitabilityScore, isIrrigated);

      return {
        crop: {
          id: crop.id,
          name: crop.name,
          scientific_name: crop.scientific_name,
          category: crop.category,
          durationDays,
          waterNeed: crop.water_need,
          seasons: crop.seasons
        },
        rank: 0,
        suitabilityScore: suitability.suitabilityScore,
        suitabilityTier: suitability.suitabilityTier,
        difficulty,
        investmentLevel,
        keyAdvantage: rationale.keyAdvantage,
        beginnerRationale: rationale.beginnerRationale,
        managementTip: rationale.tip,
        weatherSummary: {
          temperatureMatch: suitability.weatherCompatibility.temperatureScore,
          rainfallMatch: suitability.weatherCompatibility.rainfallScore,
          humidityMatch: suitability.weatherCompatibility.humidityScore
        }
      };
    });

    // 4. Sort descending by suitability score (and prioritize beginner friendly for equal scores)
    scoredList.sort((a, b) => {
      if (b.suitabilityScore !== a.suitabilityScore) {
        return b.suitabilityScore - a.suitabilityScore;
      }
      const diffWeight = { 'Beginner Friendly': 3, 'Moderate Care': 2, 'Advanced Management': 1 };
      return diffWeight[b.difficulty] - diffWeight[a.difficulty];
    });

    // Assign 1-indexed ranks
    scoredList.forEach((item, index) => {
      item.rank = index + 1;
    });

    return {
      recommendations: scoredList,
      topPick: scoredList[0],
      summaryNotice: `AgriNexa evaluated 20+ commercial crops against your local meteorological forecasts, soil chemistry (pH ${soilPh}), and seasonal temperature curves. Ranks highlight the highest likelihood of successful cultivation.`
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
