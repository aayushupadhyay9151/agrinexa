import React from 'react';
import { Layers, Droplet, Sprout, Info } from 'lucide-react';

interface StepLandProps {
  data: {
    landArea: number;
    landUnit: string;
    soilType: string;
    soilPh: number;
    irrigationAvailability: string;
    previousCrop: string;
  };
  updateData: (fields: Partial<StepLandProps['data']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepLand: React.FC<StepLandProps> = ({ data, updateData, onNext, onBack }) => {
  const soilTypes = [
    { name: 'Alluvial', desc: 'Fertile river silt & loam, excellent moisture retention' },
    { name: 'Loam', desc: 'Balanced sand, silt, and clay; ideal for most crops' },
    { name: 'Clay Loam', desc: 'High nutrient holding capacity, moderate drainage' },
    { name: 'Black Soil (Vertisol)', desc: 'Rich in iron/lime, swells when wet, ideal for cotton/oilseeds' },
    { name: 'Sandy Loam', desc: 'Well-draining, warms fast in spring, great for tubers' },
    { name: 'Red Loam', desc: 'Porous, rich in iron, responsive to irrigation' }
  ];

  const irrigationSources = [
    'Canal Irrigation',
    'Tubewell / Borewell',
    'Drip Irrigation',
    'Sprinkler System',
    'Rainfed (Natural Monsoon)'
  ];

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return { label: 'Strongly Acidic', color: 'text-red-600 bg-red-50 border-red-200' };
    if (ph < 6.0) return { label: 'Moderately Acidic', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (ph <= 7.5) return { label: 'Optimal / Neutral (6.0 - 7.5)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (ph <= 8.5) return { label: 'Moderately Alkaline', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Strongly Alkaline', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const phStatus = getPhStatus(data.soilPh);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 2 — Land & Soil Profile</h2>
        <p className="text-sm text-slate-500">
          Soil texture, acidity/alkalinity, and moisture access determine root penetration and nutrient bioavailability.
        </p>
      </div>

      {/* Land Area and Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Total Farm / Plot Area *
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={data.landArea || ''}
              onChange={(e) => updateData({ landArea: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 10"
              className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
            <span className="absolute right-4 top-2.5 text-xs text-slate-400 uppercase font-medium">
              {data.landUnit}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Measurement Unit
          </label>
          <select
            value={data.landUnit}
            onChange={(e) => updateData({ landUnit: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="acre">Acres</option>
            <option value="hectare">Hectares</option>
            <option value="bigha">Bighas</option>
          </select>
        </div>
      </div>

      {/* Soil Type Selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Dominant Soil Type *
          </label>
          <span className="text-[11px] text-emerald-800 bg-emerald-50/90 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
            🌱 Auto-detected from your location • Click any card to customize
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {soilTypes.map((st) => {
            const isSelected = data.soilType.toLowerCase() === st.name.toLowerCase() || data.soilType.includes(st.name);
            return (
              <div
                key={st.name}
                onClick={() => updateData({ soilType: st.name })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Layers className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className={`text-sm font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                      {st.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-300 shadow-2xs">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soil pH Interactive Slider */}
      <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
              Soil pH Level: <span className="text-base font-bold text-emerald-800">{data.soilPh}</span>
            </label>
            <span className="text-xs text-slate-500">Auto-calibrated for region • Drag slider to match farm test</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${phStatus.color}`}>
            {phStatus.label}
          </span>
        </div>

        <input
          type="range"
          min="4.5"
          max="9.0"
          step="0.1"
          value={data.soilPh}
          onChange={(e) => updateData({ soilPh: parseFloat(e.target.value) })}
          className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>4.5 (Acidic)</span>
          <span>6.0 (Slightly Acidic)</span>
          <span>7.0 (Neutral)</span>
          <span>8.0 (Alkaline)</span>
          <span>9.0 (Strongly Alkaline)</span>
        </div>
      </div>

      {/* Irrigation and Crop Rotation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
            <Droplet className="w-3.5 h-3.5 text-blue-500" />
            <span>Water / Irrigation Availability *</span>
          </label>
          <select
            value={data.irrigationAvailability}
            onChange={(e) => updateData({ irrigationAvailability: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {irrigationSources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preceding Crop in Rotation</span>
          </label>
          <input
            type="text"
            value={data.previousCrop}
            onChange={(e) => updateData({ previousCrop: e.target.value })}
            placeholder="e.g. Rice (Paddy), Fallow, Green Gram..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          ← Back to Location
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm transition-all shadow-emerald-900/10 cursor-pointer"
        >
          Next: Crop Selection →
        </button>
      </div>
    </div>
  );
};
