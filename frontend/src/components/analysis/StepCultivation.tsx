import React from 'react';
import { Calendar, Clock, Sprout, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface StepCultivationProps {
  cropName: string;
  durationDays: number;
  plantingDate: string;
  updateData: (fields: { plantingDate?: string; customDuration?: number; irrigationMethod?: string; farmingMethod?: string }) => void;
  irrigationMethod: string;
  farmingMethod: string;
  onSubmit: () => void;
  onBack: () => void;
}

export const StepCultivation: React.FC<StepCultivationProps> = ({
  cropName,
  durationDays,
  plantingDate,
  updateData,
  irrigationMethod,
  farmingMethod,
  onSubmit,
  onBack
}) => {
  // Calculate estimated harvest date
  const computeHarvestDate = () => {
    if (!plantingDate) return 'Select date';
    const pDate = new Date(plantingDate);
    const hDate = new Date(pDate);
    hDate.setDate(hDate.getDate() + durationDays);
    return hDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const irrigationMethods = ['Drip Irrigation', 'Sprinkler System', 'Furrow / Ridge', 'Flood / Basin', 'Rainfed'];
  const farmingMethods = ['Precision / Smart Agriculture', 'Conventional Commercial', 'Organic / Regenerative'];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Step 4 — Cultivation & Planting Schedule</h2>
        <p className="text-sm text-slate-500">
          Establish the sowing baseline to align dynamic growth phases with forecasted weather patterns.
        </p>
      </div>

      {/* Date & Harvest Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block mb-1">
              Target Crop
            </span>
            <h3 className="text-2xl font-black text-white">{cropName}</h3>
            <span className="text-xs text-emerald-200/80">Full biological lifecycle</span>
          </div>

          <div className="border-l border-white/10 sm:pl-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block mb-1">
              Duration
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="30"
                max="450"
                value={durationDays}
                onChange={(e) => updateData({ customDuration: parseInt(e.target.value, 10) || 120 })}
                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white font-bold text-lg text-center outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-sm font-semibold">Days</span>
            </div>
          </div>

          <div className="border-l border-white/10 sm:pl-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Projected Harvest Date</span>
            </span>
            <h4 className="text-lg font-bold text-white">{computeHarvestDate()}</h4>
            <span className="text-[11px] text-slate-300">Synchronized with weather engine</span>
          </div>
        </div>
      </div>

      {/* Sowing Date Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Planned Planting Date *</span>
          </label>
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => updateData({ plantingDate: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Irrigation Methodology
          </label>
          <select
            value={irrigationMethod}
            onChange={(e) => updateData({ irrigationMethod: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {irrigationMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Farming Strategy
          </label>
          <select
            value={farmingMethod}
            onChange={(e) => updateData({ farmingMethod: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {farmingMethods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Summary */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
        <p className="font-semibold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
          AgriNexa Ready to Execute Pipeline:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Query Open-Meteo live forecast & ERA5 climate normals</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compute 7-stage growth timeline milestones</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Calculate multi-factor Suitability Score</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Scan thermal, drought, and pathogen risk levels</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          ← Back to Crop
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white shadow-md shadow-emerald-900/20 flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
        >
          <span>Run Farm Intelligence Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
