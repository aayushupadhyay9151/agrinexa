import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { analysisApi } from '../api/analysisApi.js';
import { AnalysisSummary } from '../types/index.js';

interface HistoryPageProps {
  onStartNewAnalysis: () => void;
  onViewAnalysis: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onStartNewAnalysis,
  onViewAnalysis
}) => {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const res = await analysisApi.getUserAnalyses();
        if (res.analyses) setAnalyses(res.analyses);
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this agricultural record?')) return;
    try {
      await analysisApi.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const cropNames = ['All', ...new Set(analyses.map((a) => a.crop_name))];

  const filtered = analyses.filter((a) => {
    const matchesCrop = selectedCropFilter === 'All' || a.crop_name === selectedCropFilter;
    const matchesSearch =
      a.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Historical Archive
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Crop Analysis History
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review past farm plans, verified suitability evaluations, and meteorological models.
          </p>
        </div>

        <button
          onClick={onStartNewAnalysis}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Crop Analysis</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop, city, or district..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {cropNames.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCropFilter === c
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid Showcase */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading historical analyses...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Crop</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Land Area</th>
                  <th className="p-4">Planting Window</th>
                  <th className="p-4">Estimated Harvest</th>
                  <th className="p-4">Suitability</th>
                  <th className="p-4">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onViewAnalysis(item.id)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Sprout className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.crop_name}</span>
                    </td>
                    <td className="p-4">
                      {item.district || item.village || 'Plot'}, {item.country}
                    </td>
                    <td className="p-4 font-medium">
                      {item.land_area} {item.land_unit}
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      {item.planting_date}
                    </td>
                    <td className="p-4 font-mono font-semibold text-emerald-800">
                      {item.harvest_date}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.suitability_score}% ({item.suitability_tier})
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {item.created_at.slice(0, 10)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewAnalysis(item.id);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-emerald-800 rounded-lg inline-block"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg inline-block"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <Sprout className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching crop reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? 'Try adjusting your search terms or filters.' : 'Run your first crop prediction analysis to build your farm record history.'}
          </p>
        </div>
      )}
    </div>
  );
};
