import { apiRequest } from './client.js';
import { CurrentWeather, DailyWeatherPoint, GeocodingResult } from '../types/index.js';

export interface SoilEstimate {
  soilType: 'Alluvial' | 'Loam' | 'Clay Loam' | 'Black Soil (Vertisol)' | 'Sandy Loam' | 'Red Loam';
  soilPh: number;
  description: string;
  regionalNotes: string;
  confidence: 'High' | 'Medium' | 'Estimated';
}

export interface DetectedLocation {
  name: string;
  city: string;
  district: string;
  state: string;
  country: string;
  formatted: string;
  latitude: number;
  longitude: number;
  soil?: SoilEstimate;
}

export const weatherApi = {
  geocode: (query: string) =>
    apiRequest<{ success: boolean; results: GeocodingResult[] }>(`/weather/geocode?q=${encodeURIComponent(query)}`),

  reverseGeocode: (lat: number, lon: number) =>
    apiRequest<{ success: boolean; location: DetectedLocation }>(`/weather/reverse-geocode?lat=${lat}&lon=${lon}`),

  getIpLocation: () =>
    apiRequest<{ success: boolean; location: DetectedLocation }>('/weather/ip-location'),

  getCurrent: (lat: number, lon: number) =>
    apiRequest<{ success: boolean; weather: CurrentWeather }>(`/weather/current?lat=${lat}&lon=${lon}`),

  getForecast: (lat: number, lon: number, days = 14) =>
    apiRequest<{ success: boolean; count: number; forecast: DailyWeatherPoint[] }>(`/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`),

  getOutlook: (lat: number, lon: number, startDate: string, endDate: string) =>
    apiRequest<{ success: boolean; count: number; outlook: DailyWeatherPoint[] }>(`/weather/outlook?lat=${lat}&lon=${lon}&startDate=${startDate}&endDate=${endDate}`),

  getCropTimeline: (lat: number, lon: number, plantingDate: string, harvestDate: string) =>
    apiRequest<{
      success: boolean;
      current: CurrentWeather;
      timeline: DailyWeatherPoint[];
      summary: any;
    }>(`/weather/crop-analysis?lat=${lat}&lon=${lon}&plantingDate=${plantingDate}&harvestDate=${harvestDate}`)
};
