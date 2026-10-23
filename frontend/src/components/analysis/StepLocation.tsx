import React, { useState } from 'react';
import { MapPin, Navigation, Search, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { weatherApi } from '../../api/weatherApi.js';
import { GeocodingResult } from '../../types/index.js';
import { estimateSoilType } from '../../utils/soilDetection.js';

interface StepLocationProps {
  data: {
    country: string;
    state: string;
    district: string;
    village: string;
    latitude: number;
    longitude: number;
    soilType?: string;
    soilPh?: number;
  };
  updateData: (fields: Partial<StepLocationProps['data']>) => void;
  onNext: () => void;
}

export const StepLocation: React.FC<StepLocationProps> = ({ data, updateData, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    setSearching(true);
    setGeoNotice(null);
    try {
      const res = await weatherApi.geocode(searchQuery.trim());
      if (res.results && res.results.length > 0) {
        setSearchResults(res.results);
      } else {
        setGeoNotice({ type: 'error', message: 'No matching agricultural locations found. Try city, state, or district.' });
        setSearchResults([]);
      }
    } catch (err: any) {
      setGeoNotice({ type: 'error', message: 'Location lookup failed. Please check network connection.' });
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (loc: GeocodingResult) => {
    const lat = Math.round(loc.latitude * 10000) / 10000;
    const lon = Math.round(loc.longitude * 10000) / 10000;
    const soil = estimateSoilType(lat, lon, loc.admin1, loc.admin2 || loc.name, loc.country);

    updateData({
      country: loc.country || 'India',
      state: loc.admin1 || '',
      district: loc.admin2 || loc.name,
      village: loc.name,
      latitude: lat,
      longitude: lon,
      soilType: soil.soilType,
      soilPh: soil.soilPh
    });
    setSearchResults([]);
    const full = `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`;
    setSearchQuery(full);
    setGeoNotice({
      type: 'success',
      message: `📍 Selected: ${full} | 🌱 Auto-detected Soil: ${soil.soilType} (pH ~${soil.soilPh})`
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
          const soil = loc.soil || estimateSoilType(loc.latitude, loc.longitude, loc.state, loc.district || loc.city, loc.country);
          updateData({
            country: loc.country || 'India',
            state: loc.state || '',
            district: loc.district || loc.city || '',
            village: loc.name || loc.city || '',
            latitude: loc.latitude,
            longitude: loc.longitude,
            soilType: soil.soilType,
            soilPh: soil.soilPh
          });
          const formatted = loc.formatted || `${loc.city}, ${loc.state}, ${loc.country}`;
          setSearchQuery(formatted);
          setGeoNotice({
            type: 'success',
            message: `📍 Approximate location detected via network: ${formatted} | 🌱 Auto-detected Soil: ${soil.soilType} (pH ~${soil.soilPh})`
          });
          return;
        }
      } catch (e) {
        console.warn('Network location detection failed:', e);
      }

      setGeoNotice({
        type: 'error',
        message: reason || 'Unable to retrieve location automatically. Please search your city or enter coordinates below.'
      });
    };

    if (!navigator.geolocation) {
      await fallbackToIp('Geolocation is not supported by your browser.');
      setGeoLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lon = Math.round(pos.coords.longitude * 10000) / 10000;
        try {
          const rev = await weatherApi.reverseGeocode(lat, lon);
          if (rev.success && rev.location) {
            const loc = rev.location;
            const soil = loc.soil || estimateSoilType(lat, lon, loc.state, loc.district || loc.city, loc.country);
            updateData({
              country: loc.country || 'India',
              state: loc.state || '',
              district: loc.district || loc.city || '',
              village: loc.name || loc.city || '',
              latitude: lat,
              longitude: lon,
              soilType: soil.soilType,
              soilPh: soil.soilPh
            });
            const formatted = loc.formatted || `${loc.city}, ${loc.state}, ${loc.country}`;
            setSearchQuery(formatted);
            setGeoNotice({
              type: 'success',
              message: `📍 Exact GPS location detected: ${formatted} | 🌱 Auto-detected Soil: ${soil.soilType} (pH ~${soil.soilPh})`
            });
            setGeoLocating(false);
            return;
          }
        } catch (revErr) {
          console.warn('Reverse geocode error:', revErr);
        }

        const soil = estimateSoilType(lat, lon, '', '', 'India');
        updateData({
          country: 'India',
          state: '',
          district: 'Current GPS Location',
          village: 'Current Farm Location',
          latitude: lat,
          longitude: lon,
          soilType: soil.soilType,
          soilPh: soil.soilPh
        });
        setSearchQuery(`${lat.toFixed(4)}°, ${lon.toFixed(4)}°`);
        setGeoNotice({
          type: 'success',
          message: `📍 Exact GPS coordinates acquired: ${lat.toFixed(4)}°, ${lon.toFixed(4)}° | 🌱 Auto-detected Soil: ${soil.soilType}`
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

  const isValid = data.latitude !== 0 && data.longitude !== 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 1 — Farm Location</h2>
        <p className="text-sm text-slate-500">
          Precise geographic coordinates allow AgriNexa to query live meteorological models and multi-year ERA5 climate normals.
        </p>
      </div>

      {/* Quick Search & GPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <form onSubmit={handleSearch} className="md:col-span-2 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, district, or region (e.g. Ludhiana, Fresno, Nashik)..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-2 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLocating}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl text-sm font-medium shadow-sm transition-all"
        >
          <Navigation className={`w-4 h-4 ${geoLocating ? 'animate-spin' : ''}`} />
          <span>{geoLocating ? 'Detecting GPS...' : 'Use My Location'}</span>
        </button>
      </div>

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

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
            Matching Geographic Coordinates
          </p>
          {searchResults.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectLocation(r)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-sm text-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>{r.name}</strong>, {r.admin1 ? r.admin1 + ', ' : ''}{r.country}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Manual / Verified Fields */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Coordinates & Administrative Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Latitude (Decimal) *
            </label>
            <input
              type="number"
              step="0.0001"
              value={data.latitude || ''}
              onChange={(e) => updateData({ latitude: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 30.9010"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Longitude (Decimal) *
            </label>
            <input
              type="number"
              step="0.0001"
              value={data.longitude || ''}
              onChange={(e) => updateData({ longitude: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 75.8573"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => updateData({ country: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">State / Province</label>
            <input
              type="text"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              placeholder="e.g. Punjab"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">District / City / Village</label>
            <input
              type="text"
              value={data.district}
              onChange={(e) => updateData({ district: e.target.value, village: e.target.value })}
              placeholder="e.g. Ludhiana"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Auto-detected Soil Summary Card */}
      {isValid && (
        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 flex items-center justify-center shrink-0 mt-0.5 text-emerald-800 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                  Regional Soil Auto-Detected:
                </span>
                <span className="text-xs font-extrabold text-emerald-900 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                  {data.soilType || 'Alluvial'}
                </span>
                <span className="text-xs text-emerald-800 font-mono font-medium">
                  (pH ~{data.soilPh || 7.0})
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Pre-selected for your farm location. You can customize the soil type and pH on the next step.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-900 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs whitespace-nowrap self-start sm:self-center">
            Customizable in Step 2 →
          </span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
            isValid
              ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/10 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next: Land Details →
        </button>
      </div>
    </div>
  );
};
