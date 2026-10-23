import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env.js';
import { CROP_CATALOG } from '../data/cropCatalog.js';

// Ensure data folder exists
const dbDir = path.dirname(config.databasePath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(config.databasePath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT DEFAULT '',
      location TEXT DEFAULT '',
      farm_area REAL DEFAULT 0,
      area_unit TEXT DEFAULT 'acre',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      scientific_name TEXT NOT NULL,
      category TEXT NOT NULL,
      duration_min INTEGER NOT NULL,
      duration_max INTEGER NOT NULL,
      temp_min REAL NOT NULL,
      temp_max REAL NOT NULL,
      temp_ideal_min REAL NOT NULL,
      temp_ideal_max REAL NOT NULL,
      rainfall_ideal_min REAL NOT NULL,
      rainfall_ideal_max REAL NOT NULL,
      humidity_ideal_min REAL NOT NULL,
      humidity_ideal_max REAL NOT NULL,
      soil_types TEXT NOT NULL,
      soil_ph_min REAL NOT NULL,
      soil_ph_max REAL NOT NULL,
      seasons TEXT NOT NULL,
      water_need TEXT NOT NULL,
      stages_json TEXT NOT NULL,
      fertilizer_json TEXT NOT NULL,
      machinery_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crop_analyses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      country TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      village TEXT DEFAULT '',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      land_area REAL NOT NULL,
      land_unit TEXT NOT NULL,
      soil_type TEXT NOT NULL,
      soil_ph REAL NOT NULL,
      irrigation_availability TEXT NOT NULL,
      previous_crop TEXT DEFAULT '',
      planting_date TEXT NOT NULL,
      harvest_date TEXT NOT NULL,
      crop_duration_days INTEGER NOT NULL,
      suitability_score INTEGER NOT NULL,
      suitability_tier TEXT NOT NULL,
      weather_compatibility_json TEXT NOT NULL,
      risks_json TEXT NOT NULL,
      lifecycle_stages_json TEXT NOT NULL,
      fertilizer_recommendations_json TEXT NOT NULL,
      equipment_recommendations_json TEXT NOT NULL,
      weather_timeline_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      analysis_id TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_analyses_user ON crop_analyses(user_id);
    CREATE INDEX IF NOT EXISTS idx_alerts_user ON user_alerts(user_id);
  `);

  // Synchronize full agronomic crop catalog
  const insertCrop = db.prepare(`
    INSERT OR REPLACE INTO crops (
      id, name, scientific_name, category, duration_min, duration_max,
      temp_min, temp_max, temp_ideal_min, temp_ideal_max,
      rainfall_ideal_min, rainfall_ideal_max, humidity_ideal_min, humidity_ideal_max,
      soil_types, soil_ph_min, soil_ph_max, seasons, water_need,
      stages_json, fertilizer_json, machinery_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const crop of CROP_CATALOG) {
    insertCrop.run(
      crop.id,
      crop.name,
      crop.scientific_name,
      crop.category,
      crop.duration_min,
      crop.duration_max,
      crop.temp_min,
      crop.temp_max,
      crop.temp_ideal_min,
      crop.temp_ideal_max,
      crop.rainfall_ideal_min,
      crop.rainfall_ideal_max,
      crop.humidity_ideal_min,
      crop.humidity_ideal_max,
      crop.soil_types.join(','),
      crop.soil_ph_min,
      crop.soil_ph_max,
      crop.seasons.join(','),
      crop.water_need,
      JSON.stringify(crop.stages),
      JSON.stringify(crop.fertilizerPlan),
      JSON.stringify(crop.machinery)
    );
  }
  console.log(`Synchronized all ${CROP_CATALOG.length} agricultural crop varieties across Cereals, Pulses, Cash, Oilseeds, Vegetables & Spices.`);

  console.log('Database initialized successfully with node:sqlite.');
}
