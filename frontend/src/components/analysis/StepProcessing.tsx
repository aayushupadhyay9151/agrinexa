import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Sprout, CloudRain, Cpu } from 'lucide-react';

interface StepProcessingProps {
  onComplete: () => void;
  hasError?: string | null;
}

export const StepProcessing: React.FC<StepProcessingProps> = ({ onComplete, hasError }) => {
  const steps = [
    { id: 1, label: 'Analyzing your geographic coordinates...', icon: Sprout },
    { id: 2, label: 'Fetching real weather intelligence (Open-Meteo & ERA5)...', icon: CloudRain },
    { id: 3, label: 'Evaluating crop biological thresholds & soil affinity...', icon: Cpu },
    { id: 4, label: 'Generating seasonal crop outlook & risk matrices...', icon: Sparkles }
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (hasError) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [hasError, onComplete]);

  return (
    <div className="py-12 px-4 max-w-md mx-auto text-center space-y-8">
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
        <div className="relative w-20 h-20 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xl shadow-emerald-900/30">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Synthesizing Farm Intelligence
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Processing live meteorological forecasts, soil chemistry, and crop stage modeling.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left space-y-4">
        {steps.map((st, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              className={`flex items-center space-x-3.5 p-2 rounded-xl transition-all ${
                isCurrent ? 'bg-white shadow-sm border border-emerald-200 font-semibold' : ''
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-emerald-800 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300" />
                )}
              </div>
              <span className={`text-xs ${isCurrent ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {hasError && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {hasError}
        </div>
      )}
    </div>
  );
};
