import React from 'react';
import { Sprout, ShieldCheck, Database, CloudSun, Leaf, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About AgriNexa
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Technology for Smarter Farming
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Empowering agricultural producers with verified weather intelligence, physiological modeling, and actionable farm decisions.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Our Core Mission</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Agricultural planning has traditionally relied on intuition, static almanacs, or generic seasonal forecasts that fail to account for field-level microclimates and crop stage vulnerabilities. AgriNexa was developed to bridge this gap.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          By combining accurate geographic coordinates, live satellite and atmospheric models from Open-Meteo, historical ERA5 reanalysis archives, and validated agronomic biology, AgriNexa equips growers with a comprehensive cultivation roadmap before placing a single seed in the soil.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
            <CloudSun className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950">Real Data</h4>
            <p className="text-xs text-emerald-900/80">No fabricated future forecasts; distinct separation of live feeds and climate normals.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
            <Leaf className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950">Biological Rigor</h4>
            <p className="text-xs text-emerald-900/80">Crop-specific temperature limits, water demand curves, and phenological milestones.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950">Responsible Tech</h4>
            <p className="text-xs text-emerald-900/80">Transparent suitability indexing with non-prescriptive agricultural extension disclaimers.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-emerald-400">Architectural Principles</h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>Zero Client Key Exposure:</strong> All weather provider keys are mediated securely through backend micro-endpoints.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>High Performance Persistence:</strong> Built with local ACID-compliant SQLite for zero-latency retrieval and offline resilience.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span><strong>Responsive & Accessible:</strong> Designed for smooth operational utility on smartphones in the field as well as desktop workstations.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
