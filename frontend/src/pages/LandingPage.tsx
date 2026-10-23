import React from 'react';
import {
  Sprout,
  CloudSun,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onNavigateTab }) => {
  const { user, demoLogin } = useAuth();

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Enter Location',
      desc: 'Use one-click GPS or search your exact village, district, and coordinates.',
      icon: Compass
    },
    {
      step: '02',
      title: 'Add Farm Details',
      desc: 'Specify acreage, soil type (Alluvial, Black, Loam), pH, and irrigation type.',
      icon: Layers
    },
    {
      step: '03',
      title: 'Select Crop',
      desc: 'Choose from 20+ validated crops or input your own specialty regional crop.',
      icon: Sprout
    },
    {
      step: '04',
      title: 'Analyze Weather & Crop Conditions',
      desc: 'Backend synthesizes live 14-day forecasts and ERA5 historical climate normals.',
      icon: CloudSun
    },
    {
      step: '05',
      title: 'Get Your Crop Plan',
      desc: 'Receive your Suitability Score, growth timeline, risk alerts, and inputs schedule.',
      icon: Sparkles
    }
  ];

  const features = [
    {
      title: 'Dual-Horizon Weather Intelligence',
      desc: 'Combines verified short-term live forecasts with multi-year ERA5 climatological baselines across the entire 90–180+ day crop duration. No fabricated forecasts.',
      icon: CloudSun,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'AgriNexa Suitability Engine',
      desc: 'Transparent multi-parameter scoring balancing thermal comfort, water availability, humidity thresholds, and soil chemistry affinity.',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: 'Dynamic Stage-by-Stage Lifecycle',
      desc: 'Automated milestone scheduling from germination to maturity with date windows, vulnerability checks, and optimal thermal boundaries.',
      icon: Calendar,
      color: 'from-amber-600 to-orange-600'
    },
    {
      title: 'Proactive Environmental Risk Scanner',
      desc: 'Early warnings for frost, thermal stress, drought spells, waterlogging, and microclimate disease favorability with precautionary action plans.',
      icon: ShieldAlert,
      color: 'from-rose-600 to-red-600'
    },
    {
      title: 'Fertilizer & Machinery Roadmap',
      desc: 'Basal, vegetative, and reproductive nutrient schedules paired with timely tillage, sowing, spraying, and harvesting equipment timelines.',
      icon: Wrench,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: '20+ Agronomic Crop Catalog',
      desc: 'Detailed physiological specifications across Cereals, Pulses, Cash crops, Oilseeds, Vegetables, and Spices with custom crop extensibility.',
      icon: Sprout,
      color: 'from-emerald-700 to-green-700'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Generation Agricultural Technology</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Know Your Crop. <br />
                <span className="text-emerald-800">Plan Your Harvest.</span> <br />
                Grow Smarter.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                AgriNexa combines location, crop and weather intelligence to help farmers make smarter cultivation decisions from planting to harvest.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartAnalysis}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Start Crop Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => onNavigateTab('how-it-works')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Explore How It Works</span>
                </button>

                {!user && (
                  <button
                    onClick={() => demoLogin()}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-medium text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Demo</span>
                  </button>
                )}
              </div>

              {/* 2-Option Pathway Preview Pill */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Choose your mode:</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 font-medium">🌾 Option 1: Validate a Specific Crop</span>
                <span className="bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">🤖 Option 2: AI Crop Recommendation (Beginner)</span>
              </div>

              {/* Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="block text-2xl font-black text-slate-900">20+</span>
                  <span className="text-xs text-slate-500 font-medium">Validated Crop Profiles</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-emerald-700">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Real Weather API</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-slate-900">7-Stage</span>
                  <span className="text-xs text-slate-500 font-medium">Growth Lifecycle</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Interactive Preview Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">AgriNexa Live Intelligence</h4>
                      <p className="text-[10px] text-slate-400">Ludhiana, Punjab • Wheat (120 Days)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Live
                  </span>
                </div>

                {/* Score Gauge Preview */}
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                        AgriNexa Suitability Score
                      </span>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-4xl font-black text-white">87</span>
                        <span className="text-slate-300 text-xs">/ 100</span>
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                        Highly Suitable
                      </span>
                    </div>

                    <div className="text-right text-xs space-y-1">
                      <div className="text-slate-300 text-[11px]">Planting: <span className="text-white font-semibold">15 Oct</span></div>
                      <div className="text-slate-300 text-[11px]">Harvest: <span className="text-emerald-400 font-bold">12 Feb</span></div>
                      <div className="text-[10px] text-slate-400">Thermal Comfort: 92%</div>
                    </div>
                  </div>
                </div>

                {/* Weather Trend Sneak Peek */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Weather Outlook</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Forecast + Climate Normals</span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 px-1">
                    {[18, 20, 22, 21, 19, 17, 16, 18, 21, 23, 22, 20].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          style={{ height: `${(val / 25) * 48}px` }}
                          className={`w-full rounded-t-sm transition-all ${
                            idx < 5 ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Sowing</span>
                    <span>Tillering</span>
                    <span>Flowering</span>
                    <span>Maturity</span>
                  </div>
                </div>

                {/* Timeline Mini Ribbon */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Phenological Stages
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium">
                    <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100">
                      Germination
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100">
                      Tillering
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100">
                      Flowering
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-100">
                      Harvest
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-STEP HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Intelligent Workflow
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How AgriNexa Works in 5 Steps
          </h2>
          <p className="text-sm text-slate-500">
            From plot coordinates to complete harvest schedules in less than 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {howItWorksSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-800/30">
                    {s.step}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Engineered for Precision Farm Management
          </h2>
          <p className="text-sm text-slate-500">
            Comprehensive agronomic intelligence combining meteorology, physiology, and field machinery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TECHNOLOGY & METHODOLOGY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Technology for Smarter Farming
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Data-Driven Precision Without The Hype
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                AgriNexa synthesizes empirical meteorological telemetry from Open-Meteo with multi-decadal ERA5 climate averages, published agronomical temperature thresholds, and soil chemistry models.
              </p>
              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transparent Suitability Index rather than unverified empirical yield promises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dual short-range forecast & historical climatology timeline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Full machine and nutrient scheduling mapped to actual field dates</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartAnalysis}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Launch Crop Analysis Report →
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Core Agronomic Datasets
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <span className="block font-bold text-white mb-0.5">Atmospheric Forecast</span>
                  <span className="text-slate-400 text-[11px]">Temperature, humidity, precipitation probability up to 14 days</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <span className="block font-bold text-white mb-0.5">ERA5 Climate Reanalysis</span>
                  <span className="text-slate-400 text-[11px]">Multi-year historical norms across remainder of harvest</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <span className="block font-bold text-white mb-0.5">Crop Catalog</span>
                  <span className="text-slate-400 text-[11px]">Cereals, pulses, oilseeds, tubers, cash, and spices</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <span className="block font-bold text-white mb-0.5">Farm Machinery Calendar</span>
                  <span className="text-slate-400 text-[11px]">Tillage, sowing, sprayers, and combine timing windows</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
