import { apiRequest } from './client.js';
import { CurrentWeather, DailyWeatherPoint, GeocodingResult, WeatherCondition } from '../types/index.js';
import { estimateSoilType } from '../utils/soilDetection.js';

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

// Map WMO Weather Interpretation Codes to human readable descriptions & icon keys (client-side)
export function mapWmoCodeClient(code: number): WeatherCondition {
  switch (code) {
    case 0: return { code, label: 'Clear Sky', icon: 'Sun' };
    case 1: return { code, label: 'Mainly Clear', icon: 'SunMedium' };
    case 2: return { code, label: 'Partly Cloudy', icon: 'CloudSun' };
    case 3: return { code, label: 'Overcast', icon: 'Cloud' };
    case 45: return { code, label: 'Foggy', icon: 'CloudFog' };
    case 48: return { code, label: 'Depositing Rime Fog', icon: 'CloudFog' };
    case 51: return { code, label: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 53: return { code, label: 'Moderate Drizzle', icon: 'CloudDrizzle' };
    case 55: return { code, label: 'Dense Drizzle', icon: 'CloudDrizzle' };
    case 61: return { code, label: 'Slight Rain', icon: 'CloudRain' };
    case 63: return { code, label: 'Moderate Rain', icon: 'CloudRain' };
    case 65: return { code, label: 'Heavy Rain', icon: 'CloudRain' };
    case 71: return { code, label: 'Slight Snow Fall', icon: 'Snowflake' };
    case 73: return { code, label: 'Moderate Snow Fall', icon: 'Snowflake' };
    case 75: return { code, label: 'Heavy Snow Fall', icon: 'Snowflake' };
    case 80: return { code, label: 'Slight Showers', icon: 'CloudRain' };
    case 81: return { code, label: 'Moderate Showers', icon: 'CloudRain' };
    case 82: return { code, label: 'Violent Showers', icon: 'CloudLightning' };
    case 95: return { code, label: 'Thunderstorm', icon: 'CloudLightning' };
    case 96:
    case 99: return { code, label: 'Thunderstorm with Hail', icon: 'CloudLightning' };
    default: return { code, label: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

/**
 * Direct browser-side fetch to Open-Meteo Current Weather
 * (Bypasses server IP rate limits on cloud providers like Render)
 */
async function fetchDirectOpenMeteoCurrent(lat: number, lon: number): Promise<CurrentWeather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=1&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Direct Open-Meteo fetch failed with status ${res.status}`);
  const data = await res.json();
  const cur = data.current;
  const daily = data.daily;

  return {
    temperature: Math.round((cur.temperature_2m ?? 24) * 10) / 10,
    feelsLike: Math.round((cur.apparent_temperature ?? cur.temperature_2m ?? 24) * 10) / 10,
    minTemp: Math.round((daily?.temperature_2m_min?.[0] ?? cur.temperature_2m - 4) * 10) / 10,
    maxTemp: Math.round((daily?.temperature_2m_max?.[0] ?? cur.temperature_2m + 5) * 10) / 10,
    humidity: Math.round(cur.relative_humidity_2m ?? 60),
    precipitation: cur.precipitation ?? 0,
    windSpeed: Math.round((cur.wind_speed_10m ?? 8) * 10) / 10,
    windDirection: cur.wind_direction_10m ?? 0,
    cloudCover: cur.cloud_cover ?? 20,
    uvIndex: daily?.uv_index_max?.[0] ?? 5,
    condition: mapWmoCodeClient(cur.weather_code ?? 0),
    timestamp: cur.time || new Date().toISOString()
  };
}

/**
 * Direct browser-side fetch to Open-Meteo Daily Forecast
 */
async function fetchDirectOpenMeteoForecast(lat: number, lon: number, days = 14): Promise<DailyWeatherPoint[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean,uv_index_max,wind_speed_10m_max,weather_code&forecast_days=${Math.min(days, 16)}&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Direct Open-Meteo forecast failed with status ${res.status}`);
  const data = await res.json();
  const daily = data.daily;
  if (!daily || !daily.time) return [];

  const points: DailyWeatherPoint[] = [];
  for (let i = 0; i < daily.time.length; i++) {
    points.push({
      date: daily.time[i],
      minTemp: Math.round((daily.temperature_2m_min[i] ?? 18) * 10) / 10,
      maxTemp: Math.round((daily.temperature_2m_max[i] ?? 28) * 10) / 10,
      meanTemp: Math.round((daily.temperature_2m_mean?.[i] ?? (daily.temperature_2m_min[i] + daily.temperature_2m_max[i]) / 2) * 10) / 10,
      precipitationSum: Math.round((daily.precipitation_sum[i] ?? 0) * 10) / 10,
      precipitationProbability: daily.precipitation_probability_max?.[i] ?? 15,
      humidity: Math.round(daily.relative_humidity_2m_mean?.[i] ?? 60),
      uvIndex: Math.round((daily.uv_index_max?.[i] ?? 5) * 10) / 10,
      windSpeedMax: Math.round((daily.wind_speed_10m_max?.[i] ?? 10) * 10) / 10,
      condition: mapWmoCodeClient(daily.weather_code[i] ?? 1),
      dataSource: 'Forecast'
    });
  }
  return points;
}

export const weatherApi = {
  geocode: async (query: string): Promise<{ success: boolean; results: GeocodingResult[] }> => {
    try {
      const res = await apiRequest<{ success: boolean; results: GeocodingResult[] }>(`/weather/geocode?q=${encodeURIComponent(query)}`);
      if (res && res.success) return res;
    } catch (err) {
      console.warn('Backend geocode failed, falling back to direct Open-Meteo geocode:', err);
    }
    // Direct client fallback
    try {
      const directUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
      const res = await fetch(directUrl);
      if (res.ok) {
        const data = await res.json();
        const results = (data.results || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          country: r.country || '',
          admin1: r.admin1 || '',
          admin2: r.admin2 || '',
          latitude: r.latitude,
          longitude: r.longitude,
          timezone: r.timezone
        }));
        return { success: true, results };
      }
    } catch (clientErr) {
      console.error('Direct geocode error:', clientErr);
    }
    return { success: true, results: [] };
  },

  reverseGeocode: async (lat: number, lon: number): Promise<{ success: boolean; location: DetectedLocation }> => {
    try {
      const res = await apiRequest<{ success: boolean; location: DetectedLocation }>(`/weather/reverse-geocode?lat=${lat}&lon=${lon}`);
      if (res && res.success && res.location) return res;
    } catch (err) {
      console.warn('Backend reverse-geocode failed, falling back to direct client lookup:', err);
    }
    // Direct client fallback
    try {
      const directUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(directUrl);
      if (res.ok) {
        const data = await res.json();
        const city = data.locality || data.city || '';
        const district = data.city || data.locality || '';
        const state = data.principalSubdivision || '';
        const country = data.countryName || 'India';
        const formatted = [city, state, country].filter(Boolean).join(', ');
        const soil = estimateSoilType(lat, lon, state, district, country);
        return {
          success: true,
          location: {
            name: city || district || 'Detected Farm Location',
            city: city || district,
            district: district || city,
            state,
            country,
            formatted: formatted || 'Current Location',
            latitude: lat,
            longitude: lon,
            soil
          }
        };
      }
    } catch (clientErr) {
      console.error('Direct reverse geocode error:', clientErr);
    }
    const fallbackSoil = estimateSoilType(lat, lon, '', '', 'India');
    return {
      success: true,
      location: {
        name: 'Detected Location',
        city: 'Local Area',
        district: 'Local District',
        state: '',
        country: 'India',
        formatted: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
        latitude: lat,
        longitude: lon,
        soil: fallbackSoil
      }
    };
  },

  getIpLocation: () =>
    apiRequest<{ success: boolean; location: DetectedLocation }>('/weather/ip-location'),

  getCurrent: async (lat: number, lon: number): Promise<{ success: boolean; weather: CurrentWeather }> => {
    try {
      const res = await apiRequest<{ success: boolean; weather: CurrentWeather }>(`/weather/current?lat=${lat}&lon=${lon}`);
      if (res && res.success && res.weather) return res;
    } catch (backendErr) {
      console.warn('Backend /weather/current request failed, falling back to direct client Open-Meteo fetch:', backendErr);
    }
    // Direct client fallback
    try {
      const directWeather = await fetchDirectOpenMeteoCurrent(lat, lon);
      return { success: true, weather: directWeather };
    } catch (clientErr) {
      console.error('Direct client weather fetch also failed:', clientErr);
      throw clientErr;
    }
  },

  getForecast: async (lat: number, lon: number, days = 14): Promise<{ success: boolean; count: number; forecast: DailyWeatherPoint[] }> => {
    try {
      const res = await apiRequest<{ success: boolean; count: number; forecast: DailyWeatherPoint[] }>(`/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`);
      if (res && res.success && res.forecast) return res;
    } catch (backendErr) {
      console.warn('Backend /weather/forecast request failed, falling back to direct client Open-Meteo fetch:', backendErr);
    }
    // Direct client fallback
    try {
      const directForecast = await fetchDirectOpenMeteoForecast(lat, lon, days);
      return { success: true, count: directForecast.length, forecast: directForecast };
    } catch (clientErr) {
      console.error('Direct client forecast fetch also failed:', clientErr);
      throw clientErr;
    }
  },

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
