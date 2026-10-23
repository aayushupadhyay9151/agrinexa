import React, { useState } from 'react';
import { Search, PlusCircle, CheckCircle2, Droplets, Calendar, Thermometer, Filter } from 'lucide-react';
import { CropProfile } from '../../types/index.js';

interface StepCropProps {
  crops: CropProfile[];
  selectedCrop: string;
  onSelectCrop: (cropName: string, duration?: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepCrop: React.FC<StepCropProps> = ({
  crops,
  selectedCrop,
  onSelectCrop,
  onNext,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customDays, setCustomDays] = useState<number>(120);

  const categories = ['All', 'Cereal / Grain', 'Pulse / Legume', 'Oilseed', 'Cash / Fiber', 'Vegetable / Tuber', 'Spice / Plantation'];

  const filteredCrops = crops.filter((c) => {
    const matchesCat = activeCategory === 'All' || c.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCustomCropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSelectCrop(customName.trim(), customDays);
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 3 — Target Crop Selection</h2>
          <p className="text-sm text-slate-500">
            Select a crop from the validated agronomic catalog or enter a custom specialty crop.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          <span>+ Add Custom Crop</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter crops by name or botanical classification..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto p-1">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
          return (
            <div
              key={crop.id}
              onClick={() => onSelectCrop(crop.name, Math.round((crop.duration_min + crop.duration_max) / 2))}
              className={`p-4 rounded-xl border text-left cursor-pointer relative transition-all ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-600/30 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}

              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full inline-block mb-1.5">
                {crop.category}
              </span>

              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {crop.name}
              </h4>
              <p className="text-xs text-slate-400 italic mb-3">
                {crop.scientific_name}
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: <strong>{crop.duration_min}–{crop.duration_max} days</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>Comfort: <strong>{crop.temp_ideal_min}°C – {crop.temp_ideal_max}°C</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Water Need: <strong>{crop.water_need}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Crop Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Custom Agricultural Crop</h3>
            <p className="text-xs text-slate-500">
              AgriNexa will evaluate any regional, specialty, or medicinal crop against your local environmental parameters.
            </p>

            <form onSubmit={handleCustomCropSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Dragon Fruit, Quinoa, Chia, Saffron..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Expected Growing Duration (Days) *
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="450"
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 120)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-sm"
                >
                  Select Custom Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Indicator & Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          ← Back to Land Details
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-600">
            Selected: <strong className="text-emerald-800">{selectedCrop || 'None'}</strong>
          </span>
          <button
            type="button"
            disabled={!selectedCrop}
            onClick={onNext}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              selectedCrop
                ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/10 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Next: Cultivation Plan →
          </button>
        </div>
      </div>
    </div>
  );
};
