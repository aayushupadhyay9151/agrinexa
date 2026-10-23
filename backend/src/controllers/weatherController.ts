import { Request, Response } from 'express';
import { weatherService } from '../services/weatherService.js';

export class WeatherController {
  /**
   * Geocode location search
   */
  async geocode(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q as string;
      if (!q || q.trim().length < 2) {
        res.json({ success: true, results: [] });
        return;
      }
      const results = await weatherService.searchLocation(q);
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Geocoding failed', error: err.message });
    }
  }

  /**
   * Current weather for coordinates
   */
  async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({ success: false, message: 'Valid latitude and longitude are required.' });
        return;
      }

      const weather = await weatherService.getCurrentWeather(lat, lon);
      res.json({ success: true, weather });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Unable to fetch current weather', error: err.message });
    }
  }

  /**
   * 14-day daily forecast
   */
  async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const days = parseInt((req.query.days as string) || '14', 10);

      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({ success: false, message: 'Valid latitude and longitude are required.' });
        return;
      }

      const forecast = await weatherService.getDailyForecast(lat, lon, days);
      res.json({ success: true, count: forecast.length, forecast });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Unable to fetch weather forecast', error: err.message });
    }
  }

  /**
   * Extended historical / seasonal climate outlook
   */
  async getOutlook(req: Request, res: Response): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      if (isNaN(lat) || isNaN(lon) || !startDate || !endDate) {
        res.status(400).json({ success: false, message: 'Latitude, longitude, startDate, and endDate are required.' });
        return;
      }

      const outlook = await weatherService.getHistoricalSeasonalOutlook(lat, lon, startDate, endDate);
      res.json({ success: true, count: outlook.length, outlook });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Unable to fetch climate outlook', error: err.message });
    }
  }

  /**
   * Crop period weather timeline & analysis
   */
  async getCropTimeline(req: Request, res: Response): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);
      const plantingDate = req.query.plantingDate as string;
      const harvestDate = req.query.harvestDate as string;

      if (isNaN(lat) || isNaN(lon) || !plantingDate || !harvestDate) {
        res.status(400).json({ success: false, message: 'Valid lat, lon, plantingDate, and harvestDate are required.' });
        return;
      }

      const data = await weatherService.buildCropWeatherTimeline(lat, lon, plantingDate, harvestDate);
      res.json({ success: true, ...data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Failed to generate crop weather timeline', error: err.message });
    }
  }

  /**
   * Reverse geocode coordinates to location names
   */
  async reverseGeocode(req: Request, res: Response): Promise<void> {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        res.status(400).json({ success: false, message: 'Valid latitude and longitude are required.' });
        return;
      }

      const location = await weatherService.reverseGeocode(lat, lon);
      res.json({ success: true, location });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'Reverse geocoding failed', error: err.message });
    }
  }

  /**
   * Detect location from client IP address
   */
  async getIpLocation(req: Request, res: Response): Promise<void> {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const rawIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
      const clientIp = rawIp && rawIp !== '::1' && rawIp !== '127.0.0.1' ? rawIp : undefined;

      const location = await weatherService.getIpLocation(clientIp);
      res.json({ success: true, location });
    } catch (err: any) {
      res.status(500).json({ success: false, message: 'IP location detection failed', error: err.message });
    }
  }
}

export const weatherController = new WeatherController();
