import React, { useState, useEffect } from 'react';
import {
  Sprout,
  PlusCircle,
  MapPin,
  Calendar,
  Layers,
  ShieldAlert,
  CloudSun,
  TrendingUp,
  ArrowRight,
  Trash2,
  Eye,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { analysisApi } from '../api/analysisApi.js';
import { weatherApi } from '../api/weatherApi.js';
import { authApi } from '../api/authApi.js';
import { AnalysisSummary, CurrentWeather, SmartAlert } from '../types/index.js';
import { WeatherWidget } from '../components/dashboard/WeatherWidget.js';

interface DashboardPageProps {
  onStartNewAnalysis: () => void;
  onViewAnalysis: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartNewAnalysis,
  onViewAnalysis
}) => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [anlRes, altRes] = await Promise.all([
          analysisApi.getUserAnalyses(),
          authApi.getAlerts()
        ]);

        if (anlRes.analyses) {
          setAnalyses(anlRes.analyses);
          // If there is a recent analysis, load live weather for its coordinates
          if (anlRes.analyses.length > 0) {
            const first = anlRes.analyses[0];
            try {
              const wRes = await weatherApi.getCurrent(first.latitude, first.longitude);
              if (wRes.weather) setWeather(wRes.weather);
            } catch (e) {
              console.error('Failed to load station weather:', e);
            }
          }
        }

        if (altRes.alerts) {
          setAlerts(altRes.alerts);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this crop analysis report?')) return;
    try {
      await analysisApi.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete analysis');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeAnalysis = analyses[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
            Agricultural Intelligence Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name || 'Farmer'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Let's plan your next crop and monitor active environmental risk horizons.
          </p>
        </div>

        <button
          onClick={onStartNewAnalysis}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-900/10 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Crop Analysis</span>
        </button>
      </div>

      {/* Top 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Current Location */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Location</span>
          </div>
          <p className="text-sm font-bold text-slate-900 truncate">
            {activeAnalysis?.district || user?.location || 'Ludhiana, PB'}
          </p>
          <span className="text-[10px] text-slate-400 truncate block">
            {activeAnalysis?.country || 'India'}
          </span>
        </div>

        {/* Land Area */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Land Area</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {activeAnalysis?.land_area || user?.farmArea || 10} {activeAnalysis?.land_unit || 'Acres'}
          </p>
          <span className="text-[10px] text-slate-400 block">Cultivable Acreage</span>
        </div>

        {/* Active Crop */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Plan</span>
          </div>
          <p className="text-sm font-bold text-slate-900 truncate">
            {activeAnalysis?.crop_name || 'Wheat'}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            {activeAnalysis ? `${activeAnalysis.crop_duration_days} Day Cycle` : 'Ready to Plan'}
          </span>
        </div>

        {/* Expected Harvest */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Target Harvest</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {activeAnalysis?.harvest_date ? new Date(activeAnalysis.harvest_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Pending'}
          </p>
          <span className="text-[10px] text-slate-400 block">
            {activeAnalysis?.harvest_date ? `${activeAnalysis.harvest_date.slice(0, 4)} Window` : 'Select Crop'}
          </span>
        </div>

        {/* Crop Health / Risk */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Suitability Score</span>
          </div>
          <p className="text-sm font-bold text-emerald-700">
            {activeAnalysis ? `${activeAnalysis.suitability_score} / 100` : '90% Avg'}
          </p>
          <span className="text-[10px] text-slate-400 block">
            {activeAnalysis?.suitability_tier || 'Optimal Match'}
          </span>
        </div>

        {/* Weather Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <CloudSun className="w-3.5 h-3.5 text-blue-500" />
            <span>Weather Status</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {weather ? `${weather.temperature}°C` : 'Station Active'}
          </p>
          <span className="text-[10px] text-slate-400 block truncate">
            {weather?.condition.label || 'Real Telemetry'}
          </span>
        </div>
      </div>

      {/* Weather Station & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Live Weather Widget */}
        <div className="lg:col-span-5">
          <WeatherWidget
            weather={weather}
            locationName={activeAnalysis ? `${activeAnalysis.district}, ${activeAnalysis.country}` : 'Farm Weather Station'}
            loading={loading && !weather}
          />
        </div>

        {/* Right Smart Agro-Weather Alerts Banner */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Smart Agro-Weather Alerts</h3>
            </div>
            <span className="text-xs text-slate-400">Automated Environmental Scanner</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {alerts.length > 0 ? (
              alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs flex items-start space-x-3 transition-colors ${
                    alt.severity === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : alt.severity === 'danger'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                    alt.severity === 'warning' ? 'text-amber-600' : alt.severity === 'danger' ? 'text-rose-600' : 'text-emerald-700'
                  }`} />
                  <div className="flex-1">
                    <p className="font-bold">{alt.title}</p>
                    <p className="text-[11px] opacity-90 leading-relaxed mt-0.5">{alt.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-slate-50 text-slate-500 rounded-xl text-xs text-center">
                No active weather stress warnings for your registered plots. Conditions are within baseline bounds.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Crop Analyses History Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Crop Analyses & Reports</h2>
            <p className="text-xs text-slate-500">
              Evaluated cultivation plans, lifecycle milestones, and weather compatibility profiles.
            </p>
          </div>
          <button
            onClick={onStartNewAnalysis}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center space-x-1"
          >
            <span>+ Create New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((anl) => (
              <div
                key={anl.id}
                onClick={() => onViewAnalysis(anl.id)}
                className="bg-slate-50/70 hover:bg-emerald-50/40 p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {anl.crop_name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-emerald-800">
                      {anl.suitability_score}%
                    </span>
                    <button
                      onClick={(e) => handleDelete(anl.id, e)}
                      className="text-slate-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                    <span>{anl.crop_name} Plan</span>
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{anl.district || anl.village || 'Plot'}, {anl.country}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Planting:</span>
                    <span className="font-semibold">{anl.planting_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Harvest:</span>
                    <span className="font-semibold text-emerald-800">{anl.harvest_date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-emerald-800 font-semibold">
                  <span>View Full Intelligence Report</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Sprout className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No crop analyses generated yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run your first analysis to generate comprehensive weather outlooks, lifecycle growth stages, and input schedules.
            </p>
            <button
              onClick={onStartNewAnalysis}
              className="mt-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Start First Analysis →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
