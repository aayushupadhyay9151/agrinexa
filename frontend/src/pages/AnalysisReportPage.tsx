import React, { useState, useEffect } from 'react';
import {
  Sprout,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  CloudSun,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { analysisApi } from '../api/analysisApi.js';
import { CropAnalysisReport } from '../types/index.js';
import { WeatherTrendChart } from '../components/charts/WeatherTrendChart.js';
import { RainfallChart } from '../components/charts/RainfallChart.js';

interface AnalysisReportPageProps {
  analysisId: string;
  onBack: () => void;
}

export const AnalysisReportPage: React.FC<AnalysisReportPageProps> = ({
  analysisId,
  onBack
}) => {
  const [report, setReport] = useState<CropAnalysisReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        const res = await analysisApi.getAnalysisById(analysisId);
        if (res.success && res.report) {
          setReport(res.report);
        } else {
          setError('Report could not be retrieved.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading analysis report.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Loading Intelligence Report...</h2>
        <p className="text-xs text-slate-500">Fetching meteorological and agronomic parameters</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Report Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'Analysis record not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  const {
    crop,
    location,
    land,
    timelineDates,
    suitability,
    currentWeather,
    weatherSummary,
    weatherTimeline,
    lifecycleStages,
    risks,
    fertilizer,
    equipment
  } = report;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-2">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors print:hidden"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                AgriNexa Verified Report
              </span>
              <span className="text-xs text-slate-400">ID: {report.id.slice(0, 12)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Crop Analysis & Cultivation Plan: <span className="text-emerald-800">{crop.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Report link copied to clipboard!');
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* Summary Banner Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/50">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Crop Identity */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
              Cultivation Baseline
            </span>
            <h2 className="text-3xl font-black text-white">{crop.name}</h2>
            <p className="text-xs text-slate-300 italic">{crop.scientific_name}</p>

            <div className="pt-2 text-xs text-slate-300 space-y-1">
              <p className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{location.village ? location.village + ', ' : ''}{location.district}, {location.state}, {location.country}</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{land.area} {land.unit} • {land.soilType} Soil (pH {land.soilPh})</span>
              </p>
            </div>
          </div>

          {/* Center Timeline Dates */}
          <div className="md:col-span-4 border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 md:px-6 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Planting Date</span>
                <span className="font-bold text-white text-sm">{timelineDates.plantingDate}</span>
              </div>
              <div>
                <span className="text-amber-400 block text-[11px]">Expected Harvest</span>
                <span className="font-bold text-amber-300 text-sm">{timelineDates.harvestDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>Total Duration: <strong>{timelineDates.durationDays} Days</strong></span>
              <span>Water: <strong>{crop.water_need}</strong></span>
            </div>
          </div>

          {/* Right Suitability Score Radial Banner */}
          <div className="md:col-span-4 flex flex-col items-center sm:items-end text-center sm:text-right space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              AgriNexa Suitability Score
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-white">{suitability.suitabilityScore}</span>
              <span className="text-slate-400 text-lg">/ 100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(suitability.suitabilityScore)}`}>
              {suitability.suitabilityTier}
            </span>
            <p className="text-[10px] text-slate-400 max-w-xs text-right mt-1 leading-snug">
              Multi-parameter environmental index (Climate 55%, Soil 30%, Season 15%).
            </p>
          </div>
        </div>
      </div>

      {/* Real Weather Station & Compatibility Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Live Station Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Current Atmosphere
              </span>
              <h3 className="text-sm font-bold text-slate-900">Live Weather Telemetry</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
              Open-Meteo
            </span>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-black text-slate-900">{currentWeather.temperature}°C</span>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-emerald-800">{currentWeather.condition.label}</p>
              <p>Feels like {currentWeather.feelsLike}°C</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Relative Humidity</span>
              <span className="font-bold text-slate-900">{currentWeather.humidity}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Wind Speed</span>
              <span className="font-bold text-slate-900">{currentWeather.windSpeed} km/h</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Precipitation</span>
              <span className="font-bold text-slate-900">{currentWeather.precipitation} mm</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">UV Index</span>
              <span className="font-bold text-slate-900">{currentWeather.uvIndex} Max</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
            <span className="font-bold block">Aggregated Crop Period Summary:</span>
            <p>Cycle Avg Temp: <strong>{weatherSummary.avgTemp}°C</strong> (Min: {weatherSummary.minRecordedTemp}°C, Max: {weatherSummary.maxRecordedTemp}°C)</p>
            <p>Projected Cumulative Rainfall: <strong>{weatherSummary.totalEstimatedRainfall} mm</strong></p>
          </div>
        </div>

        {/* Right Weather Compatibility breakdown */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Bioclimatic Fit
              </span>
              <h3 className="text-base font-bold text-slate-900">Crop-Weather Compatibility</h3>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Overall Climate: {suitability.weatherCompatibility.overallClimateScore}%
            </span>
          </div>

          <div className="space-y-4">
            {/* Temperature Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Thermal Compatibility</span>
                </span>
                <span className="font-black text-slate-900">{suitability.weatherCompatibility.temperatureScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${suitability.weatherCompatibility.temperatureScore}%` }}
                  className={`h-full rounded-full transition-all ${getProgressBarColor(suitability.weatherCompatibility.temperatureScore)}`}
                />
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                {suitability.weatherCompatibility.temperatureExplanation}
              </p>
            </div>

            {/* Rainfall Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rainfall & Moisture Availability</span>
                </span>
                <span className="font-black text-slate-900">{suitability.weatherCompatibility.rainfallScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${suitability.weatherCompatibility.rainfallScore}%` }}
                  className={`h-full rounded-full transition-all ${getProgressBarColor(suitability.weatherCompatibility.rainfallScore)}`}
                />
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                {suitability.weatherCompatibility.rainfallExplanation}
              </p>
            </div>

            {/* Humidity Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Relative Humidity Range</span>
                </span>
                <span className="font-black text-slate-900">{suitability.weatherCompatibility.humidityScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${suitability.weatherCompatibility.humidityScore}%` }}
                  className={`h-full rounded-full transition-all ${getProgressBarColor(suitability.weatherCompatibility.humidityScore)}`}
                />
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                {suitability.weatherCompatibility.humidityExplanation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Weather Outlook Interactive Charts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Crop Weather Outlook Timeline</h2>
            <p className="text-xs text-slate-500">
              Interactive meteorological trends across the entire cultivation period from sowing to harvest.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherTrendChart
            timeline={weatherTimeline}
            idealTempMin={crop.temp_ideal_min}
            idealTempMax={crop.temp_ideal_max}
          />
          <RainfallChart timeline={weatherTimeline} />
        </div>
      </div>

      {/* Potential Risks & Agronomic Vulnerability Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider block">
              Risk Horizon
            </span>
            <h2 className="text-lg font-bold text-slate-900">Detected Potential Hazards & Stress Points</h2>
          </div>
          <span className="text-xs text-slate-500">Early Warning Detection Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risks.map((risk) => {
            const isHigh = risk.riskLevel === 'High';
            const isMod = risk.riskLevel === 'Moderate';

            return (
              <div
                key={risk.id}
                className={`p-5 rounded-2xl border space-y-2.5 transition-all ${
                  isHigh
                    ? 'bg-rose-50/60 border-rose-200'
                    : isMod
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isHigh ? 'bg-rose-200 text-rose-900' : isMod ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {risk.riskLevel} Risk
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{risk.affectedStage}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {risk.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {risk.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Precautionary Action:</strong>
                  {risk.recommendedPrecaution}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic 7-Stage Crop Lifecycle Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Development Milestones
            </span>
            <h2 className="text-lg font-bold text-slate-900">Crop Growth Stages & Weather Alignment</h2>
          </div>
          <span className="text-xs text-slate-500">Calculated for {crop.name}</span>
        </div>

        <div className="space-y-4">
          {lifecycleStages.map((stage, idx) => (
            <div
              key={stage.name}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-emerald-50/30 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {stage.stageOrder}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{stage.name}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs sm:text-right shrink-0">
                  <span className="font-semibold text-slate-700">{stage.durationDays} Days</span>
                  <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-600 font-mono text-[11px]">
                    {stage.startDate} to {stage.endDate}
                  </span>
                </div>
              </div>

              {/* Stage Weather Benchmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Thermal Window</span>
                  <span className="font-bold text-slate-800">{stage.idealTempMin}°C – {stage.idealTempMax}°C</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Water Sensitivity</span>
                  <span className={`font-bold ${stage.waterSensitivity === 'Critical' ? 'text-rose-700' : 'text-blue-700'}`}>
                    {stage.waterSensitivity}
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Projected Mean Temp</span>
                  <span className="font-bold text-emerald-800">
                    {stage.expectedWeather?.avgTemp ? `${stage.expectedWeather.avgTemp}°C` : 'Historical baseline'}
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Estimated Rain</span>
                  <span className="font-bold text-slate-800">
                    {stage.expectedWeather?.totalRainfall !== undefined ? `${stage.expectedWeather.totalRainfall} mm` : '~15 mm'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fertilizer Guidance & Machinery Roadmap Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Fertilizer Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Nutrient Management
            </span>
            <h3 className="text-base font-bold text-slate-900">Recommended Fertilization Schedule</h3>
          </div>

          <div className="space-y-3">
            {fertilizer.schedule.map((f, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-900 font-bold">{f.cropStage}</strong>
                  <span className="text-[11px] text-emerald-800 font-semibold">{f.targetNutrients}</span>
                </div>
                <p className="text-slate-600">{f.purpose}</p>
                <div className="text-[11px] text-slate-500">
                  <span>Recommended: </span>
                  <span className="text-slate-800 font-medium">{f.recommendedInputs.join(', ')}</span>
                </div>
                <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                  {f.applicationGuidance}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
            <p className="leading-snug">{fertilizer.disclaimer}</p>
          </div>
        </div>

        {/* Machinery Roadmap */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
              Mechanization Calendar
            </span>
            <h3 className="text-base font-bold text-slate-900">Farm Equipment & Tools Timeline</h3>
          </div>

          <div className="space-y-3">
            {equipment.map((eq, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {eq.operation}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">{eq.timingWindow}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{eq.equipment}</h4>
                <p className="text-slate-600 leading-snug">{eq.purpose}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-xs">
            Tip: Pre-booking implement rental or custom hiring center service 2 weeks ahead ensures zero delay during critical sowing and harvesting windows.
          </div>
        </div>
      </div>
    </div>
  );
};
