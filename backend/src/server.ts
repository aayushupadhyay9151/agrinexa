import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initDatabase, db } from './db/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

const app = express();

// Initialize Database & seed initial catalog
initDatabase();

// Seed default demo user if not present
try {
  const demoEmail = 'demo@agrinexa.com';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);
  if (!existing) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('demo12345', salt);
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, location, farm_area, area_unit, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('demo-user-agrinexa', 'Dr. Arvind Sharma (AgriTech Pioneer)', demoEmail, hash, '+91 98765 43210', 'Ludhiana, Punjab', 15.0, 'acre', new Date().toISOString());
    console.log('Created default demonstration account: demo@agrinexa.com / demo12345');
  }
} catch (e) {
  console.error('Error seeding demo user:', e);
}

// Middleware
app.use(cors({
  origin: true, // Dynamically allow calling origin (supports Vercel frontend, preview domains & local)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'AgriNexa Farm Intelligence Backend',
    version: '1.0.0',
    weatherProvider: config.weatherApiProvider,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🌾 AgriNexa Farm Intelligence API running on port ${PORT}`);
  console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  🌤  Live Weather: Open-Meteo & ERA5 Climate Engine active`);
  console.log(`======================================================\n`);
});
