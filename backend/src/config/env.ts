import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'agrinexa_fallback_jwt_secret_key_2026',
  databasePath: process.env.DATABASE_PATH || path.resolve(process.cwd(), 'data', 'agrinexa.db'),
  weatherApiProvider: process.env.WEATHER_API_PROVIDER || 'open-meteo',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
