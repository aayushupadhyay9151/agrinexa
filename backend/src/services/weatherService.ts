import { config } from '../config/env.js';
import { soilService, SoilEstimate } from './soilService.js';

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
  admin1?: string; // state
  admin2?: string; // district
  latitude: number;
  longitude: number;
  timezone?: string;
}

// Map WMO Weather Interpretation Codes to human readable descriptions & icon keys
export function mapWmoCode(code: number): WeatherCondition {
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

export class WeatherService {
  /**
   * Search for locations / cities using Open-Meteo Geocoding
   */
  async searchLocation(query: string): Promise<GeocodingResult[]> {
    if (!query || query.trim().length < 2) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': 'AgriNexa/1.0' } });
      if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
      const data = (await res.json()) as { results?: any[] };
      if (!data.results) return [];

      return data.results.map((r: any) => ({
        id: r.id,
        name: r.name,
        country: r.country || '',
        admin1: r.admin1 || '',
        admin2: r.admin2 || '',
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone
      }));
    } catch (err) {
      console.error('Geocoding search error:', err);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to district, state, country, village
   */
  async reverseGeocode(lat: number, lon: number): Promise<{
    name: string;
    city: string;
    district: string;
    state: string;
    country: string;
    formatted: string;
    latitude: number;
    longitude: number;
    soil: SoilEstimate;
  }> {
    try {
      // 1. Try BigDataCloud free client reverse geocoding
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as any;
        const city = data.locality || data.city || '';
        const district = data.city || data.locality || '';
        const state = data.principalSubdivision || '';
        const country = data.countryName || 'India';
        const formatted = [city, state, country].filter(Boolean).join(', ');
        const soil = soilService.estimateSoil(lat, lon, state, district, country);

        return {
          name: city || district || 'Detected Farm Location',
          city: city || district,
          district: district || city,
          state,
          country,
          formatted: formatted || 'Current Location',
          latitude: lat,
          longitude: lon,
          soil
        };
      }
    } catch (err) {
      console.warn('BigDataCloud reverse geocode error, trying fallback:', err);
    }

    try {
      // 2. Fallback to OpenStreetMap Nominatim
      const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
      const nomRes = await fetch(nomUrl, {
        headers: { 'User-Agent': 'AgriNexa/1.0 (contact@agrinexa.com)' }
      });
      if (nomRes.ok) {
        const nomData = (await nomRes.json()) as any;
        const addr = nomData.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || '';
        const district = addr.state_district || addr.county || city;
        const state = addr.state || '';
        const country = addr.country || 'India';
        const formatted = [city, district, state, country].filter(Boolean).slice(0, 3).join(', ');
        const soil = soilService.estimateSoil(lat, lon, state, district, country);

        return {
          name: city || district || 'Detected Farm Location',
          city,
          district,
          state,
          country,
          formatted: formatted || nomData.display_name || 'Current Location',
          latitude: lat,
          longitude: lon,
          soil
        };
      }
    } catch (nomErr) {
      console.warn('Nominatim fallback failed:', nomErr);
    }

    const fallbackSoil = soilService.estimateSoil(lat, lon, '', '', 'India');
    return {
      name: 'Detected Coordinates',
      city: 'Local Region',
      district: 'Local District',
      state: '',
      country: 'India',
      formatted: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
      latitude: lat,
      longitude: lon,
      soil: fallbackSoil
    };
  }

  /**
   * Get location from client IP address as immediate fallback
   */
  async getIpLocation(clientIp?: string): Promise<{
    name: string;
    city: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    formatted: string;
    soil: SoilEstimate;
  }> {
    try {
      const url = clientIp && clientIp !== '127.0.0.1' && clientIp !== '::1'
        ? `http://ip-api.com/json/${clientIp}`
        : 'http://ip-api.com/json/';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.status === 'success') {
          const city = data.city || '';
          const state = data.regionName || '';
          const country = data.country || 'India';
          const lat = Math.round(data.lat * 10000) / 10000;
          const lon = Math.round(data.lon * 10000) / 10000;
          const formatted = `${city}, ${state}, ${country}`;
          const soil = soilService.estimateSoil(lat, lon, state, city, country);

          return {
            name: city || 'Detected Network Location',
            city,
            district: city,
            state,
            country,
            latitude: lat,
            longitude: lon,
            formatted,
            soil
          };
        }
      }
    } catch (err) {
      console.warn('IP location fetch failed:', err);
    }

    // Default fallback
    const defaultSoil = soilService.estimateSoil(28.6139, 77.2090, 'Delhi', 'New Delhi', 'India');
    return {
      name: 'New Delhi',
      city: 'New Delhi',
      district: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      latitude: 28.6139,
      longitude: 77.2090,
      formatted: 'New Delhi, Delhi, India',
      soil: defaultSoil
    };
  }

  /**
   * Fetch current weather from Open-Meteo
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=1&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API failed with status ${res.status}`);
    }
    const data = (await res.json()) as any;
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
      condition: mapWmoCode(cur.weather_code ?? 0),
      timestamp: cur.time || new Date().toISOString()
    };
  }

  /**
   * Fetch 14-day daily live forecast from Open-Meteo
   */
  async getDailyForecast(lat: number, lon: number, days = 14): Promise<DailyWeatherPoint[]> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean,uv_index_max,wind_speed_10m_max,weather_code&forecast_days=${Math.min(days, 16)}&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Forecast API failed with status ${res.status}`);
    }
    const data = (await res.json()) as any;
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
        condition: mapWmoCode(daily.weather_code[i] ?? 1),
        dataSource: 'Forecast'
      });
    }
    return points;
  }

  /**
   * Fetch historical climate normals from Open-Meteo ERA5 archive
   * for the extended seasonal outlook
   */
  async getHistoricalSeasonalOutlook(
    lat: number,
    lon: number,
    startDateStr: string,
    endDateStr: string
  ): Promise<DailyWeatherPoint[]> {
    try {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);

      // Query past year corresponding calendar window for historical climate baseline
      const lastYearStart = new Date(start);
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
      const lastYearEnd = new Date(end);
      lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);

      const sStr = lastYearStart.toISOString().split('T')[0];
      const eStr = lastYearEnd.toISOString().split('T')[0];

      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${sStr}&end_date=${eStr}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,weather_code&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Historical archive API returned ${res.status}, falling back to climate approximation`);
        return this.synthesizeClimateNormals(start, end);
      }

      const data = (await res.json()) as any;
      const daily = data.daily;
      if (!daily || !daily.time || daily.time.length === 0) {
        return this.synthesizeClimateNormals(start, end);
      }

      const points: DailyWeatherPoint[] = [];
      for (let i = 0; i < daily.time.length; i++) {
        // Project onto future calendar date
        const futureDate = new Date(start);
        futureDate.setDate(futureDate.getDate() + i);
        if (futureDate > end) break;

        points.push({
          date: futureDate.toISOString().split('T')[0],
          minTemp: Math.round((daily.temperature_2m_min[i] ?? 16) * 10) / 10,
          maxTemp: Math.round((daily.temperature_2m_max[i] ?? 26) * 10) / 10,
          meanTemp: Math.round((daily.temperature_2m_mean?.[i] ?? (daily.temperature_2m_min[i] + daily.temperature_2m_max[i]) / 2) * 10) / 10,
          precipitationSum: Math.round((daily.precipitation_sum[i] ?? 0.5) * 10) / 10,
          precipitationProbability: daily.precipitation_sum[i] > 1 ? 45 : 15,
          humidity: Math.round(daily.relative_humidity_2m_mean?.[i] ?? 55),
          uvIndex: 6,
          windSpeedMax: 10,
          condition: mapWmoCode(daily.weather_code?.[i] ?? 2),
          dataSource: 'Historical/Seasonal Outlook'
        });
      }
      return points;
    } catch (err) {
      console.warn('Historical climate retrieval error, generating seasonal baseline:', err);
      return this.synthesizeClimateNormals(new Date(startDateStr), new Date(endDateStr));
    }
  }

  /**
   * Safe fallback for long-range seasonal climate normals
   */
  private synthesizeClimateNormals(start: Date, end: Date): DailyWeatherPoint[] {
    const points: DailyWeatherPoint[] = [];
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const month = d.getMonth(); // 0-11

      // Seasonal temperature curve
      const isNorthernWinter = month >= 11 || month <= 1;
      const isSummer = month >= 4 && month <= 7;
      const baseMean = isNorthernWinter ? 17 : isSummer ? 32 : 24;
      const tempVariation = Math.sin((i / 30) * Math.PI) * 2;

      points.push({
        date: d.toISOString().split('T')[0],
        minTemp: Math.round((baseMean - 5 + tempVariation) * 10) / 10,
        maxTemp: Math.round((baseMean + 6 + tempVariation) * 10) / 10,
        meanTemp: Math.round((baseMean + tempVariation) * 10) / 10,
        precipitationSum: Math.round((Math.sin(i / 10) > 0.5 ? 2.5 : 0.2) * 10) / 10,
        precipitationProbability: 20,
        humidity: 60,
        uvIndex: 5.5,
        windSpeedMax: 9,
        condition: mapWmoCode(1),
        dataSource: 'Historical/Seasonal Outlook'
      });
    }
    return points;
  }

  /**
   * Build complete crop timeline combining short-term real forecast (Days 1-14)
   * and historical seasonal outlook (Day 15 through harvest)
   */
  async buildCropWeatherTimeline(
    lat: number,
    lon: number,
    plantingDateStr: string,
    harvestDateStr: string
  ): Promise<{
    current: CurrentWeather;
    timeline: DailyWeatherPoint[];
    summary: {
      avgTemp: number;
      minRecordedTemp: number;
      maxRecordedTemp: number;
      totalEstimatedRainfall: number;
      avgHumidity: number;
    };
  }> {
    const current = await this.getCurrentWeather(lat, lon);
    const forecast = await this.getDailyForecast(lat, lon, 14);

    const plantingDate = new Date(plantingDateStr);
    const harvestDate = new Date(harvestDateStr);
    const today = new Date();

    // Determine outlook start: either after the 14 forecast days or from planting
    const lastForecastDate = forecast.length > 0 ? new Date(forecast[forecast.length - 1].date) : today;
    const outlookStartDate = new Date(lastForecastDate);
    outlookStartDate.setDate(outlookStartDate.getDate() + 1);

    let extendedOutlook: DailyWeatherPoint[] = [];
    if (harvestDate > outlookStartDate) {
      extendedOutlook = await this.getHistoricalSeasonalOutlook(
        lat,
        lon,
        outlookStartDate.toISOString().split('T')[0],
        harvestDate.toISOString().split('T')[0]
      );
    }

    // Merge forecast and extended outlook
    // Filter forecast to points within plantingDate and harvestDate
    const validForecast = forecast.filter((p) => {
      const ptDate = new Date(p.date);
      return ptDate >= plantingDate && ptDate <= harvestDate;
    });

    const fullTimeline = [...validForecast, ...extendedOutlook];

    // Compute aggregate summary metrics
    const avgTemp = fullTimeline.length > 0
      ? Math.round((fullTimeline.reduce((acc, p) => acc + p.meanTemp, 0) / fullTimeline.length) * 10) / 10
      : current.temperature;

    const minRecordedTemp = fullTimeline.length > 0
      ? Math.min(...fullTimeline.map((p) => p.minTemp))
      : current.minTemp;

    const maxRecordedTemp = fullTimeline.length > 0
      ? Math.max(...fullTimeline.map((p) => p.maxTemp))
      : current.maxTemp;

    const totalEstimatedRainfall = fullTimeline.length > 0
      ? Math.round(fullTimeline.reduce((acc, p) => acc + p.precipitationSum, 0) * 10) / 10
      : 0;

    const avgHumidity = fullTimeline.length > 0
      ? Math.round(fullTimeline.reduce((acc, p) => acc + p.humidity, 0) / fullTimeline.length)
      : current.humidity;

    return {
      current,
      timeline: fullTimeline,
      summary: {
        avgTemp,
        minRecordedTemp,
        maxRecordedTemp,
        totalEstimatedRainfall,
        avgHumidity
      }
    };
  }
}

export const weatherService = new WeatherService();
