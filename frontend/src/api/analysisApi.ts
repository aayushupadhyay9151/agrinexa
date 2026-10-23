import { apiRequest } from './client.js';
import { CropAnalysisReport, AnalysisSummary } from '../types/index.js';

export interface CreateAnalysisPayload {
  cropName: string;
  country?: string;
  state?: string;
  district?: string;
  village?: string;
  latitude: number;
  longitude: number;
  landArea: number;
  landUnit: string;
  soilType: string;
  soilPh: number;
  irrigationAvailability: string;
  previousCrop?: string;
  plantingDate: string;
  customDuration?: number;
}

export interface RecommendationPayload {
  latitude: number;
  longitude: number;
  soilType?: string;
  soilPh?: number;
  irrigationAvailability?: string;
  plantingDate?: string;
}

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

export const analysisApi = {
  createAnalysis: (payload: CreateAnalysisPayload) =>
    apiRequest<{
      success: boolean;
      message: string;
      analysisId: string;
      report: CropAnalysisReport;
    }>('/analysis', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getUserAnalyses: () =>
    apiRequest<{ success: boolean; count: number; analyses: AnalysisSummary[] }>('/analysis'),

  getAnalysisById: (id: string) =>
    apiRequest<{ success: boolean; report: CropAnalysisReport }>(`/analysis/${id}`),

  deleteAnalysis: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/analysis/${id}`, { method: 'DELETE' }),

  getRecommendations: (payload: RecommendationPayload) =>
    apiRequest<{
      success: boolean;
      count: number;
      recommendations: CropRecommendationItem[];
      topPick: CropRecommendationItem;
      summaryNotice: string;
    }>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
