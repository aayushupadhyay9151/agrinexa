export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farmArea?: number;
  areaUnit?: string;
  createdAt?: string;
}

export interface WeatherCondition {
  code: number;
  label: string;
  icon: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  uvIndex: number;
  condition: WeatherCondition;
  timestamp: string;
}

export interface DailyWeatherPoint {
  date: string;
  minTemp: number;
  maxTemp: number;
  meanTemp: number;
  precipitationSum: number;
  precipitationProbability: number;
  humidity: number;
  uvIndex: number;
  windSpeedMax: number;
  condition: WeatherCondition;
  dataSource: 'Forecast' | 'Historical/Seasonal Outlook';
}

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  admin2?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CropStageDefinition {
  name: string;
  stageOrder: number;
  durationPercent: number;
  description: string;
  idealTempMin: number;
  idealTempMax: number;
  waterSensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities: string[];
}

export interface FertilizerStagePlan {
  stage: string;
  nutrient: string;
  description: string;
  recommendedInputs: string[];
  purpose: string;
}

export interface MachineryRequirement {
  cropStage: string;
  equipment: string;
  purpose: string;
  timingWindow: string;
}

export interface CropProfile {
  id: string;
  name: string;
  scientific_name: string;
  category: string;
  duration_min: number;
  duration_max: number;
  temp_min: number;
  temp_max: number;
  temp_ideal_min: number;
  temp_ideal_max: number;
  rainfall_ideal_min: number;
  rainfall_ideal_max: number;
  humidity_ideal_min: number;
  humidity_ideal_max: number;
  soil_types: string[];
  soil_ph_min: number;
  soil_ph_max: number;
  seasons: string[];
  water_need: 'Low' | 'Medium' | 'High' | 'Very High';
  stages: CropStageDefinition[];
  fertilizerPlan: FertilizerStagePlan[];
  machinery: MachineryRequirement[];
}

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

export interface WeatherCompatibility {
  temperatureScore: number;
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
  suitabilityScore: number;
  suitabilityTier: 'Highly Suitable' | 'Moderately Suitable' | 'Marginal' | 'High Risk';
  weatherCompatibility: WeatherCompatibility;
  soilCompatibility?: SoilCompatibility;
  seasonScore?: number;
  disclaimer: string;
}

export interface AgroRisk {
  id: string;
  title: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  affectedStage: string;
  expectedPeriod: string;
  description: string;
  recommendedPrecaution: string;
}

export interface FertilizerRecommendation {
  cropStage: string;
  targetNutrients: string;
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
  timestamp?: string;
  is_read?: number;
}

export interface CropAnalysisReport {
  id: string;
  userId?: string;
  crop: CropProfile;
  location: {
    country: string;
    state: string;
    district: string;
    village: string;
    latitude: number;
    longitude: number;
  };
  land: {
    area: number;
    unit: string;
    soilType: string;
    soilPh: number;
    irrigation: string;
    previousCrop: string;
  };
  timelineDates: {
    plantingDate: string;
    harvestDate: string;
    durationDays: number;
  };
  suitability: SuitabilityAnalysisResult;
  currentWeather: CurrentWeather;
  weatherSummary: {
    avgTemp: number;
    minRecordedTemp: number;
    maxRecordedTemp: number;
    totalEstimatedRainfall: number;
    avgHumidity: number;
  };
  weatherTimeline: DailyWeatherPoint[];
  lifecycleStages: CalculatedStage[];
  risks: AgroRisk[];
  fertilizer: {
    schedule: FertilizerRecommendation[];
    disclaimer: string;
  };
  equipment: EquipmentRecommendation[];
  alerts?: SmartAlert[];
  createdAt: string;
}

export interface AnalysisSummary {
  id: string;
  crop_name: string;
  country: string;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  land_area: number;
  land_unit: string;
  soil_type: string;
  planting_date: string;
  harvest_date: string;
  crop_duration_days: number;
  suitability_score: number;
  suitability_tier: string;
  created_at: string;
}
