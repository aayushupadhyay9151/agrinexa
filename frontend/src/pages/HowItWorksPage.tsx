import React from 'react';
import {
  Compass,
  Layers,
  Sprout,
  CloudSun,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onStartAnalysis: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onStartAnalysis }) => {
  const steps = [
    {
      num: '01',
      title: 'Geographic Location Discovery',
      subtitle: 'Coordinates & Agro-Ecological Region',
      desc: 'Users specify their field location using browser GPS or search autocomplete. The system extracts exact latitude and longitude to query atmospheric elevation and local climatic bands.',
      icon: Compass,
      tags: ['Geocoding API', 'GPS Latitude/Longitude', 'Microclimate Boundary']
    },
    {
      num: '02',
      title: 'Land & Edaphic Profiling',
      subtitle: 'Soil Texture, pH & Moisture Sourcing',
      desc: 'Farmers enter plot acreage, soil category (Alluvial, Black, Loam, Sandy Loam), measured soil pH level, and irrigation availability (Canal, Tubewell, Drip, Rainfed) to benchmark root penetration and cation exchange capacity.',
      icon: Layers,
      tags: ['Soil pH Range (4.5–9.0)', 'Water Source Mitigation', 'Crop Rotation History']
    },
    {
      num: '03',
      title: 'Crop Biological Modeling',
      subtitle: 'Phenology & Physiological Limits',
      desc: 'Choose from 20+ validated crops across Cereals, Pulses, Oilseeds, Cash crops, Vegetables, and Spices, or enter a custom specialty crop. Each crop carries specific cardinal temperature boundaries, moisture coefficients, and stage splits.',
      icon: Sprout,
      tags: ['Thermal Cardinal Points', 'Critical Sensitivity Stages', '20+ Validated Species']
    },
    {
      num: '04',
      title: 'Dual-Horizon Weather Synthesis',
      subtitle: '14-Day Live Forecast + ERA5 Climatology',
      desc: 'Instead of fabricating long-range daily weather predictions months into the future, AgriNexa merges live 14-day forecasts with multi-decadal historical climate averages (ERA5 reanalysis) to generate a realistic timeline.',
      icon: CloudSun,
      tags: ['Open-Meteo API', 'ERA5 Climatology', 'No Fake Weather Data']
    },
    {
      num: '05',
      title: 'Comprehensive Actionable Intelligence',
      subtitle: 'Suitability Score, Timeline & Inputs',
      desc: 'The platform generates an AgriNexa Suitability Score (0-100), phenological growth stage dates, potential environmental hazards with actionable precautions, stage-by-stage N-P-K nutrient guidance, and machinery schedules.',
      icon: Sparkles,
      tags: ['AgriNexa Suitability Index', 'Risk Mitigation Scanner', 'Mechanization Calendar']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Methodology & Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How AgriNexa Generates Farm Intelligence
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          A transparent look into our 5-step agricultural decision-support engine.
        </p>
      </div>

      {/* Step Flow */}
      <div className="space-y-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20 font-black text-2xl">
                {s.num}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {s.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suitability Formula Transparency Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-emerald-400">
          Transparent Scoring Model
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The AgriNexa Suitability Score is formulated as an agro-climatic compatibility index:
        </p>
        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 font-mono text-xs text-emerald-300 space-y-1">
          <p>Score = (Climate Compatibility × 55%) + (Soil Compatibility × 30%) + (Season Alignment × 15%)</p>
          <p className="text-slate-400 text-[11px]">Where Climate = (Temp × 45%) + (Moisture × 35%) + (Humidity × 20%)</p>
        </div>
        <p className="text-xs text-slate-400">
          This system is modularly architected so that calibrated machine-learning models (e.g. Random Forest or LightGBM yield regressors) can be integrated in future phases.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onStartAnalysis}
          className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/20 inline-flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>Run Crop Analysis Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
