import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Navigation,
  Search,
  Droplets,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Award,
  DollarSign
} from 'lucide-react';
import { weatherApi } from '../../api/weatherApi.js';
import { analysisApi, CropRecommendationItem } from '../../api/analysisApi.js';
import { GeocodingResult } from '../../types/index.js';
import { estimateSoilType } from '../../utils/soilDetection.js';

interface SmartCropRecommendationViewProps {
  onSelectCropAndGenerate: (cropName: string, duration: number, details: any) => void;
  onSwitchToManual: () => void;
}

export const SmartCropRecommendationView: React.FC<SmartCropRecommendationViewProps> = ({
  onSelectCropAndGenerate,
  onSwitchToManual
}) => {
  // Input parameters for recommendation
  const [query, setQuery] = useState('Ludhiana, Punjab');
  const [lat, setLat] = useState(30.9010);
  const [lon, setLon] = useState(75.8573);
  const [locationName, setLocationName] = useState('Ludhiana, Punjab, India');

  const [landArea, setLandArea] = useState(5);
  const [landUnit, setLandUnit] = useState('acre');
  const [soilType, setSoilType] = useState('Alluvial');
  const [soilPh, setSoilPh] = useState(6.8);
  const [irrigationAvailability, setIrrigationAvailability] = useState('Canal Irrigation');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);

  // Search & Geolocation State
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searchingLoc, setSearchingLoc] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Recommendation State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendationItem[] | null>(null);
  const [topPick, setTopPick] = useState<CropRecommendationItem | null>(null);
  const [summaryNotice, setSummaryNotice] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  // Handle Location Search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchingLoc(true);
    setGeoNotice(null);
    try {
      const res = await weatherApi.geocode(query.trim());
      if (res.results && res.results.length > 0) {
        setSearchResults(res.results);
      } else {
        setGeoNotice({ type: 'error', message: 'No matching agricultural locations found. Try city, state, or district.' });
      }
    } catch (e) {
      console.error(e);
      setGeoNotice({ type: 'error', message: 'Location lookup failed. Please check network connection.' });
    } finally {
      setSearchingLoc(false);
    }
  };

  const handleSelectLocation = (loc: GeocodingResult) => {
    const cLat = Math.round(loc.latitude * 10000) / 10000;
    const cLon = Math.round(loc.longitude * 10000) / 10000;
    setLat(cLat);
    setLon(cLon);
    const full = `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`;
    setLocationName(full);
    setQuery(full);
    setSearchResults([]);

    const soil = estimateSoilType(cLat, cLon, loc.admin1, loc.admin2 || loc.name, loc.country);
    setSoilType(soil.soilType);
    setSoilPh(soil.soilPh);
    setGeoNotice({
      type: 'success',
      message: `📍 Selected: ${full} | 🌱 Soil auto-set to ${soil.soilType} (pH ~${soil.soilPh})`
    });
  };

  const handleUseMyLocation = async () => {
    setGeoLocating(true);
    setGeoNotice(null);

    const fallbackToIp = async (reason?: string) => {
      try {
        const ipRes = await weatherApi.getIpLocation();
        if (ipRes.success && ipRes.location) {
          const loc = ipRes.location;
          setLat(loc.latitude);
          setLon(loc.longitude);
          const display = loc.formatted || `${loc.city}, ${loc.state}, ${loc.country}`;
          setLocationName(display);
          setQuery(display);

          const soil = loc.soil || estimateSoilType(loc.latitude, loc.longitude, loc.state, loc.district || loc.city, loc.country);
          setSoilType(soil.soilType);
          setSoilPh(soil.soilPh);

          setGeoNotice({
            type: 'success',
            message: `📍 Approximate location detected via network: ${display} | 🌱 Soil auto-set to ${soil.soilType} (pH ~${soil.soilPh})`
          });
          return;
        }
      } catch (ipErr) {
        console.warn('IP location fallback failed:', ipErr);
      }

      setGeoNotice({
        type: 'error',
        message: reason || 'Unable to retrieve location automatically. Please search your city above.'
      });
    };

    if (!navigator.geolocation) {
      await fallbackToIp('Geolocation is not supported by your browser.');
      setGeoLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const cLat = Math.round(pos.coords.latitude * 10000) / 10000;
        const cLon = Math.round(pos.coords.longitude * 10000) / 10000;
        setLat(cLat);
        setLon(cLon);
        try {
          const rev = await weatherApi.reverseGeocode(cLat, cLon);
          if (rev.success && rev.location) {
            const display = rev.location.formatted || `${rev.location.city}, ${rev.location.state}`;
            setLocationName(display);
            setQuery(display);

            const soil = rev.location.soil || estimateSoilType(cLat, cLon, rev.location.state, rev.location.district || rev.location.city, rev.location.country);
            setSoilType(soil.soilType);
            setSoilPh(soil.soilPh);

            setGeoNotice({
              type: 'success',
              message: `📍 Exact GPS location detected: ${display} | 🌱 Soil auto-set to ${soil.soilType} (pH ~${soil.soilPh})`
            });
            setGeoLocating(false);
            return;
          }
        } catch (revErr) {
          console.warn('Reverse geocode error:', revErr);
        }

        const soil = estimateSoilType(cLat, cLon, '', '', 'India');
        setSoilType(soil.soilType);
        setSoilPh(soil.soilPh);

        const fallbackDisplay = `GPS Location (${cLat.toFixed(4)}°, ${cLon.toFixed(4)}°)`;
        setLocationName(fallbackDisplay);
        setQuery(fallbackDisplay);
        setGeoNotice({
          type: 'success',
          message: `📍 Exact GPS coordinates acquired: ${cLat.toFixed(4)}°, ${cLon.toFixed(4)}° | 🌱 Soil auto-set to ${soil.soilType}`
        });
        setGeoLocating(false);
      },
      async (err) => {
        console.warn('Browser GPS failed, falling back to network IP location:', err.message);
        await fallbackToIp();
        setGeoLocating(false);
      },
      { timeout: 6000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  // Run Recommendation Scan
  const handleScanRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analysisApi.getRecommendations({
        latitude: lat,
        longitude: lon,
        soilType,
        soilPh,
        irrigationAvailability,
        plantingDate
      });

      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
        setTopPick(res.topPick);
        setSummaryNotice(res.summaryNotice);
      } else {
        setError('Could not evaluate crop recommendations for this region.');
      }
    } catch (err: any) {
      setError(err.message || 'Meteorological prediction service error.');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = recommendations ? recommendations.filter((r) => {
    if (filterDifficulty === 'All') return true;
    return r.difficulty === filterDifficulty;
  }) : [];

  const handleSelectCrop = (item: CropRecommendationItem) => {
    onSelectCropAndGenerate(item.crop.name, item.crop.durationDays, {
      country: 'India',
      state: '',
      district: locationName,
      village: locationName,
      latitude: lat,
      longitude: lon,
      landArea,
      landUnit,
      soilType,
      soilPh,
      irrigationAvailability,
      plantingDate
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-700/50 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Beginner & Smart Discovery Mode</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Not Sure What to Plant? We'll Recommend the Best Crop.
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Zero farming experience needed. Simply provide your farm's location and basic land information. AgriNexa will evaluate 20+ commercial crops against your local meteorological trends and rank the most suitable, resilient, and profitable options for your soil.
        </p>

        <div className="pt-2">
          <button
            onClick={onSwitchToManual}
            className="text-xs text-emerald-200 hover:text-white underline font-medium"
          >
            Already know what crop you want? Switch to Specific Crop Validation mode →
          </button>
        </div>
      </div>

      {/* Input Parameters Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
          1. Your Field & Location Baseline
        </h3>

        {/* Location & GPS Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <form onSubmit={handleLocationSearch} className="md:col-span-2 relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search farm city or region (e.g. Ludhiana, Nashik, Fresno)..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <button
              type="submit"
              disabled={searchingLoc}
              className="absolute right-2 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              {searchingLoc ? 'Searching...' : 'Search'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLocating}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-medium shadow-sm transition-all"
          >
            <Navigation className={`w-4 h-4 ${geoLocating ? 'animate-spin' : ''}`} />
            <span>{geoLocating ? 'Detecting...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-1">
            {searchResults.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectLocation(r)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs text-slate-800 flex items-center justify-between"
              >
                <span><strong>{r.name}</strong>, {r.admin1} {r.country}</span>
                <span className="text-slate-400 font-mono text-[10px]">{r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°</span>
              </button>
            ))}
          </div>
        )}

        {/* Geolocation feedback alert */}
        {geoNotice && (
          <div className={`flex items-center space-x-2 text-xs p-3 rounded-xl border ${
            geoNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {geoNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            )}
            <span>{geoNotice.message}</span>
          </div>
        )}

        {/* Selected Coordinates Badge */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 w-fit">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Active Target: <strong className="text-slate-800">{locationName}</strong></span>
          <span className="text-slate-400 font-mono text-[11px]">({lat.toFixed(4)}°, {lon.toFixed(4)}°)</span>
        </div>

        {/* Land, Soil, Irrigation simplified inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Plot Size
            </label>
            <div className="flex">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-l-xl text-sm font-semibold outline-none"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="px-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-xl text-xs font-medium"
              >
                <option value="acre">Acre</option>
                <option value="hectare">Hectare</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span>Soil Type</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                Auto-detected • Changeable
              </span>
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="Alluvial">Alluvial (River Valley / Loamy)</option>
              <option value="Loam">Standard Loam (Balanced)</option>
              <option value="Clay Loam">Clay Loam (Heavy)</option>
              <option value="Black Soil (Vertisol)">Black Soil (Cotton/Clay)</option>
              <option value="Sandy Loam">Sandy Loam (Light/Well-drained)</option>
              <option value="Red Loam">Red Soil</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span>Water Access</span>
              <span className="text-[10px] text-slate-400 lowercase">irrigation</span>
            </label>
            <select
              value={irrigationAvailability}
              onChange={(e) => setIrrigationAvailability(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
            >
              <option value="Canal Irrigation">Canal Water Available</option>
              <option value="Tubewell / Borewell">Tubewell / Groundwater</option>
              <option value="Drip Irrigation">Drip Irrigation System</option>
              <option value="Sprinkler System">Sprinkler System</option>
              <option value="Rainfed (Natural Monsoon)">Rainfed Only (No canal/well)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Planned Sowing Date
            </label>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleScanRecommendations}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{loading ? 'Evaluating 20+ Crops Against Local Weather...' : 'Scan & Recommend Best Crops for My Land'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Analyzing Environmental Compatibility...</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cross-referencing live weather forecasts, temperature ranges, and soil requirements across our complete agricultural database.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendations Results Section */}
      {recommendations && recommendations.length > 0 && !loading && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ranked Intelligence
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                Crop Suitability Rankings for {locationName}
              </h3>
              <p className="text-xs text-slate-500">{summaryNotice}</p>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 font-medium">Filter by:</span>
              {['All', 'Beginner Friendly', 'Moderate Care'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    filterDifficulty === diff
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Top Pick Feature Banner */}
          {topPick && (
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-700 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                    <Award className="w-3.5 h-3.5 fill-slate-950" />
                    <span>#1 Prime Recommendation</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {topPick.difficulty}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-white">{topPick.suitabilityScore}%</span>
                  <span className="text-xs text-slate-400 block font-semibold">Suitability</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white">
                    {topPick.crop.name}
                  </h4>
                  <p className="text-xs text-emerald-200 italic">{topPick.crop.scientific_name} • {topPick.crop.category}</p>
                  <p className="text-xs text-slate-200 leading-relaxed pt-1">
                    {topPick.beginnerRationale}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-300 pt-2 border-t border-white/10">
                    <span>Duration: <strong>{topPick.crop.durationDays} Days</strong></span>
                    <span>Water: <strong>{topPick.crop.waterNeed}</strong></span>
                    <span>Capital Need: <strong>{topPick.investmentLevel}</strong></span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    onClick={() => handleSelectCrop(topPick)}
                    className="w-full md:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    <span>Select & Generate Farm Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Full Ranked Crop Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((item) => {
              const isTop = item.rank === 1;
              const isBeginner = item.difficulty === 'Beginner Friendly';

              return (
                <div
                  key={item.crop.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isTop
                      ? 'border-emerald-600 bg-emerald-50/20'
                      : 'border-slate-200/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        #{item.rank}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBeginner ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.difficulty}
                        </span>
                        <span className="text-sm font-black text-emerald-800">
                          {item.suitabilityScore}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {item.crop.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {item.crop.category} • {item.crop.durationDays} Days
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {item.keyAdvantage}
                    </p>

                    <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
                      <p><strong className="text-slate-700">Beginner Tip:</strong> {item.managementTip}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectCrop(item)}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer mt-2"
                  >
                    <span>Select Crop & View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
