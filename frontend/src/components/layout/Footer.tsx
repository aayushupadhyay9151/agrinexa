import React from 'react';
import { Sprout, ShieldAlert, Cloud, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 text-white cursor-pointer" onClick={() => setCurrentTab('home')}>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Agri<span className="text-emerald-400">Nexa</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart crop prediction & farm intelligence system. Combining location, crop biology, and multi-layered weather data from planting to harvest.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[11px]">
              <Cloud className="w-3.5 h-3.5" />
              <span>Real Open-Meteo & ERA5 Engine</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('new-analysis')} className="hover:text-emerald-400 transition-colors">
                  Crop Suitability Wizard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('weather')} className="hover:text-emerald-400 transition-colors">
                  Weather Intelligence Explorer
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('history')} className="hover:text-emerald-400 transition-colors">
                  Farm Plan Archive
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Farmer Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge & About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              About & Methodology
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setCurrentTab('how-it-works')} className="hover:text-emerald-400 transition-colors">
                  How AgriNexa Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-emerald-400 transition-colors">
                  Technology & Agriculture
                </button>
              </li>
              <li>
                <span className="text-slate-500">20+ Crop Variety Catalog</span>
              </li>
              <li>
                <span className="text-slate-500">Dual-Horizon Weather Engine</span>
              </li>
            </ul>
          </div>

          {/* Agricultural Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Agronomic Advisory</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              The AgriNexa Suitability Score and input recommendations are decision-support indices based on environmental benchmarks. For commercial dosage and field treatment, always consult a certified local agricultural extension officer and physical soil test card.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriNexa – Smart Crop Prediction & Farm Intelligence System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built for Modern Sustainable Farming</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
