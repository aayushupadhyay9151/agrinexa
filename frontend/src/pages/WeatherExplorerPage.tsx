import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { weatherApi } from '../api/weatherApi.js';
import { CurrentWeather, DailyWeatherPoint, GeocodingResult } from '../types/index.js';
import { WeatherWidget } from '../components/dashboard/WeatherWidget.js';

interface WeatherExplorerPageProps {
  onStartAnalysisWithLocation: (loc: { lat: number; lon: number; name: string }) => void;
}

export const WeatherExplorerPage: React.FC<WeatherExplorerPageProps> = ({
  onStartAnalysisWithLocation
}) => {
  const [query, setQuery] = useState('Ludhiana');
  const [lat, setLat] = useState(30.9010);
  const [lon, setLon] = useState(75.8573);
  const [locationName, setLocationName] = useState('Ludhiana, Punjab, India');

  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyWeatherPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);

  useEffect(() => {
    fetchWeather(lat, lon, locationName);
  }, []);

  const fetchWeather = async (targetLat: number, targetLon: number, name: string) => {
    setLoading(true);
    try {
      const [curRes, foreRes] = await Promise.all([
        weatherApi.getCurrent(targetLat, targetLon),
        weatherApi.getForecast(targetLat, targetLon, 14)
      ]);
      if (curRes.weather) setCurrent(curRes.weather);
      if (foreRes.forecast) setForecast(foreRes.forecast);
      setLat(targetLat);
      setLon(targetLon);
      setLocationName(name);
    } catch (err) {
      console.error('Weather explorer fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await weatherApi.geocode(query);
      if (res.results && res.results.length > 0) {
        setSearchResults(res.results);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectSearchResult = (item: GeocodingResult) => {
    setSearchResults([]);
    const full = `${item.name}, ${item.admin1 ? item.admin1 + ', ' : ''}${item.country}`;
    setQuery(item.name);
    fetchWeather(item.latitude, item.longitude, full);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Location Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Atmospheric Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Agricultural Weather Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time meteorology and 14-day agricultural forecast for any farm location globally.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search global farm coordinates or city..."
              className="w-full pl-9 pr-20 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectSearchResult(r)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs text-slate-800 flex items-center justify-between"
                >
                  <span className="font-semibold">{r.name}, {r.admin1} {r.country}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Weather Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <WeatherWidget weather={current} locationName={locationName} loading={loading} />

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Crop Planning Action
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use these real coordinates to generate a full 7-stage cultivation plan and suitability evaluation for {locationName}.
            </p>
            <button
              onClick={() => onStartAnalysisWithLocation({ lat, lon, name: locationName })}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Crops for this Location →</span>
            </button>
          </div>
        </div>

        {/* 14-Day Agricultural Outlook List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                Daily Projections
              </span>
              <h3 className="text-base font-bold text-slate-900">14-Day Meteorological Window</h3>
            </div>
            <span className="text-xs text-slate-400">Verified Open-Meteo Feed</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {forecast.map((f, idx) => (
              <div
                key={f.date}
                className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 text-slate-400 font-mono text-[11px]">D+{idx + 1}</span>
                  <div>
                    <span className="font-bold text-slate-900">{f.date}</span>
                    <span className="block text-[10px] text-emerald-800 font-semibold">{f.condition.label}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-black text-slate-800">{f.maxTemp}° / {f.minTemp}°C</span>
                    <span className="block text-[10px] text-slate-400">Humidity: {f.humidity}%</span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="font-semibold text-blue-600">{f.precipitationSum} mm</span>
                    <span className="block text-[10px] text-indigo-500 font-medium">{f.precipitationProbability}% prob</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
