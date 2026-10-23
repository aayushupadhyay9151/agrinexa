# AgriNexa – Smart Crop Prediction & Farm Intelligence System

> **A modern, production-grade agricultural technology and farm intelligence SaaS platform.**
> AgriNexa combines location data, crop biological requirements, and real meteorological telemetry (live 14-day forecasts + ERA5 multi-year climate normals) to guide farmers and agricultural planners from seed planting to harvest.

---

## 🌟 Key Capabilities

### 1. Dual-Horizon Weather Intelligence (No Fake Weather)
- **Short-Term Live Forecast (Days 1–14)**: Live meteorological feeds from Open-Meteo including air temperature, apparent temperature, daily min/max, relative humidity, precipitation sum, precipitation probability, wind speed/direction, cloud cover, and UV index.
- **Extended Crop-Period Outlook (Days 15 through Harvest)**: Multi-year historical climatological averages derived from the ERA5 reanalysis archive across the exact seasonal window for your farm's geographic coordinates.
- **Clear Demarcation**: The user interface explicitly distinguishes between live forecast windows and seasonal climate baselines.

### 2. Comprehensive 20+ Crop Variety Catalog
AgriNexa ships with detailed biological models spanning all major agricultural categories:
- **Cereals & Grains**: Wheat (*Triticum aestivum*), Rice/Paddy (*Oryza sativa*), Maize/Corn (*Zea mays*), Barley (*Hordeum vulgare*), Pearl Millet/Bajra (*Pennisetum glaucum*)
- **Pulses & Legumes**: Chickpea/Gram (*Cicer arietinum*), Pigeon Pea/Tur (*Cajanus cajan*), Green Gram/Moong (*Vigna radiata*), Soybean (*Glycine max*), Groundnut/Peanut (*Arachis hypogaea*)
- **Oilseeds**: Mustard/Rapeseed (*Brassica juncea*), Sunflower (*Helianthus annuus*), Soybean, Groundnut
- **Commercial & Cash Crops**: Cotton (*Gossypium hirsutum*), Sugarcane (*Saccharum officinarum*)
- **Vegetables & Tubers**: Potato (*Solanum tuberosum*), Tomato (*Solanum lycopersicum*), Onion (*Allium cepa*)
- **Spices & Plantation**: Chili/Hot Pepper (*Capsicum annuum*), Ginger (*Zingiber officinale*), Turmeric (*Curcuma longa*)
- **Custom Crop Engine**: Full support for any unlisted or specialty regional crop (e.g., Dragon Fruit, Quinoa, Chia, Saffron) with user-defined growth duration and automated stage distribution.

### 3. AgriNexa Suitability Scoring Engine
- Multi-factor environmental compatibility index:
  $$\text{AgriNexa Score} = (55\% \times \text{Climate}) + (30\% \times \text{Soil}) + (15\% \times \text{Season})$$
- Detailed sub-scores for thermal comfort, water availability vs. irrigation infrastructure, relative humidity boundaries, soil texture affinity, and pH buffers.
- Transparently categorized: *Highly Suitable*, *Moderately Suitable*, *Marginal*, or *High Risk*.

### 4. Dynamic 7-Stage Growth Lifecycle
Calculates exact calendar windows from sowing to harvest:
1. Germination & Emergence
2. Seedling / Tillering / Crown Root Formation
3. Active Vegetative Growth & Branching
4. Inflorescence, Flowering & Anthesis
5. Grain Filling, Bulking & Fruit Development
6. Physiological Maturity & Senescence
7. Shatter-Free Harvest Window

### 5. Proactive Environmental Hazard Scanner
Early warning system detecting:
- Thermal Stress & Scorching Winds
- Ground Frost & Low-Temperature Retardation
- Excessive Rainfall & Root Zone Waterlogging
- Mid-Season Protracted Dry Spells
- High-Humidity Foliar Pathogen Favorability (Blast, Blight, Rust, Mildew)
- Each hazard comes with a severity rating, affected phenological stage, and recommended agricultural precautions.

### 6. Nutrient Roadmap & Mechanization Calendar
- **Fertilizer Schedule**: Stage-by-stage N-P-K ratios, micronutrients (Zinc, Boron, Sulphur), and recommended commercial inputs paired with agricultural extension disclaimers.
- **Machinery Timeline**: Specific equipment requirements (Tractors, Disc Harrows, Subsoilers, Precision Drills, High-Clearance Sprayers, Combine Harvesters) with approximate operational windows.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Forest and Earth agro-palettes
- **Data Visualizations**: Recharts (Composed thermal curves, precipitation bars, probability lines, reference zones)
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS transitions

### Backend
- **Runtime**: Node.js v24 + Express.js
- **Database**: Native SQLite persistence (`DatabaseSync` from `node:sqlite`), WAL mode, zero external database setup
- **Authentication**: JWT authentication with bcrypt password hashing
- **Security**: CORS-enabled, input sanitization, zero API key exposure to frontend

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend starts on **`http://localhost:5000`** with live health check at `/api/health`.

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
Frontend runs on **`http://localhost:5173`**.

---

## 🔑 Demonstration Credentials
For instant review and evaluation without signing up:
- Click **1-Click Demo** in the top navigation bar or login page.
- Or sign in manually with:
  - **Email**: `demo@agrinexa.com`
  - **Password**: `demo12345`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new agricultural user |
| `POST` | `/api/auth/login` | Authenticate user with JWT |
| `POST` | `/api/auth/demo-login` | Instant demo login |
| `GET` | `/api/auth/me` | Fetch authenticated user |
| `GET` | `/api/crops` | List full 20+ crop profiles |
| `GET` | `/api/crops/:id` | Get specific crop biological specifications |
| `GET` | `/api/weather/geocode?q=...` | Global city/district coordinates lookup |
| `GET` | `/api/weather/current?lat=...&lon=...` | Real-time weather telemetry |
| `GET` | `/api/weather/forecast?lat=...&lon=...` | 14-day daily forecast |
| `GET` | `/api/weather/outlook?lat=...&lon=...` | ERA5 historical climate baseline |
| `POST` | `/api/analysis` | Run 5-step full crop prediction & farm plan |
| `GET` | `/api/analysis` | List user's saved farm analyses |
| `GET` | `/api/analysis/:id` | Retrieve full intelligence report |
| `DELETE` | `/api/analysis/:id` | Delete farm analysis |
| `GET` | `/api/profile` | Retrieve user profile & farm units |
| `PUT` | `/api/profile` | Update user settings & preferences |
| `GET` | `/api/alerts` | Active agro-weather notifications feed |
