import React, { useState, useEffect } from 'react';
import {
  Sprout,
  MapPin,
  Layers,
  Calendar,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { StepLocation } from '../components/analysis/StepLocation.js';
import { StepLand } from '../components/analysis/StepLand.js';
import { StepCrop } from '../components/analysis/StepCrop.js';
import { StepCultivation } from '../components/analysis/StepCultivation.js';
import { StepProcessing } from '../components/analysis/StepProcessing.js';
import { SmartCropRecommendationView } from '../components/analysis/SmartCropRecommendationView.js';
import { cropApi } from '../api/cropApi.js';
import { analysisApi } from '../api/analysisApi.js';
import { CropProfile } from '../types/index.js';

interface NewAnalysisPageProps {
  onCompleteAnalysis: (analysisId: string) => void;
  onCancel: () => void;
}

export const NewAnalysisPage: React.FC<NewAnalysisPageProps> = ({
  onCompleteAnalysis,
  onCancel
}) => {
  // Mode selection: 'choose-mode' | 'manual-validation' | 'smart-recommendation'
  const [analysisMode, setAnalysisMode] = useState<'choose-mode' | 'manual-validation' | 'smart-recommendation'>('choose-mode');

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [crops, setCrops] = useState<CropProfile[]>([]);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [createdAnalysisId, setCreatedAnalysisId] = useState<string | null>(null);

  // Form State for Manual Validation
  const [formData, setFormData] = useState({
    country: 'India',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Gill Agricultural Center',
    latitude: 30.9010,
    longitude: 75.8573,
    landArea: 10,
    landUnit: 'acre',
    soilType: 'Alluvial',
    soilPh: 6.8,
    irrigationAvailability: 'Canal Irrigation',
    previousCrop: 'Rice (Paddy)',
    cropName: 'Wheat',
    customDuration: 120,
    plantingDate: new Date().toISOString().split('T')[0],
    irrigationMethod: 'Drip Irrigation',
    farmingMethod: 'Precision / Smart Agriculture'
  });

  useEffect(() => {
    async function loadCrops() {
      try {
        const res = await cropApi.getAllCrops();
        if (res.crops) setCrops(res.crops);
      } catch (err) {
        console.error('Failed to load crop catalog:', err);
      }
    }
    loadCrops();
  }, []);

  const handleUpdate = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleCropSelect = (cropName: string, duration?: number) => {
    handleUpdate({
      cropName,
      customDuration: duration || 120
    });
  };

  const handleSubmitAnalysis = async () => {
    setCurrentStep(5);
    setProcessingError(null);

    try {
      const res = await analysisApi.createAnalysis({
        cropName: formData.cropName,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        latitude: formData.latitude,
        longitude: formData.longitude,
        landArea: formData.landArea,
        landUnit: formData.landUnit,
        soilType: formData.soilType,
        soilPh: formData.soilPh,
        irrigationAvailability: formData.irrigationAvailability,
        previousCrop: formData.previousCrop,
        plantingDate: formData.plantingDate,
        customDuration: formData.customDuration
      });

      if (res.success && res.analysisId) {
        setCreatedAnalysisId(res.analysisId);
      } else {
        setProcessingError(res.message || 'Analysis generation failed.');
      }
    } catch (err: any) {
      console.error('Error submitting analysis:', err);
      setProcessingError(err.message || 'Network or meteorological service error.');
    }
  };

  // Called when a user selects a recommended crop from Smart Recommendation mode
  const handleSelectFromRecommendation = async (cropName: string, duration: number, details: any) => {
    setFormData((prev) => ({
      ...prev,
      cropName,
      customDuration: duration,
      ...details
    }));
    setAnalysisMode('manual-validation');
    setCurrentStep(5);
    setProcessingError(null);

    try {
      const res = await analysisApi.createAnalysis({
        cropName,
        country: details.country || 'India',
        state: details.state || '',
        district: details.district || 'Plot',
        village: details.village || 'Plot',
        latitude: details.latitude,
        longitude: details.longitude,
        landArea: details.landArea || 5,
        landUnit: details.landUnit || 'acre',
        soilType: details.soilType || 'Alluvial',
        soilPh: details.soilPh || 6.8,
        irrigationAvailability: details.irrigationAvailability || 'Canal Irrigation',
        previousCrop: '',
        plantingDate: details.plantingDate || new Date().toISOString().split('T')[0],
        customDuration: duration
      });

      if (res.success && res.analysisId) {
        setCreatedAnalysisId(res.analysisId);
      } else {
        setProcessingError(res.message || 'Analysis failed');
      }
    } catch (err: any) {
      setProcessingError(err.message || 'Processing failed');
    }
  };

  const handleProcessingComplete = () => {
    if (createdAnalysisId) {
      onCompleteAnalysis(createdAnalysisId);
    }
  };

  const stepLabels = [
    { num: 1, label: 'Location', icon: MapPin },
    { num: 2, label: 'Land & Soil', icon: Layers },
    { num: 3, label: 'Crop Select', icon: Sprout },
    { num: 4, label: 'Cultivation', icon: Calendar },
    { num: 5, label: 'Intelligence', icon: Sparkles }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 2 OPTIONS CHOOSE-MODE LANDING */}
      {analysisMode === 'choose-mode' && (
        <div className="space-y-8 py-4">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Analysis Pathways
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How would you like to plan your farm?
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Choose the path that best matches your agricultural knowledge and planning needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* OPTION 1: SPECIFIC CROP VALIDATION */}
            <div
              onClick={() => {
                setAnalysisMode('manual-validation');
                setCurrentStep(1);
              }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Option 1 • Experienced / Specific
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    I Know What Crop to Plant
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You already have a specific crop in mind (e.g. Wheat, Cotton, Mustard, Tomato, or custom). AgriNexa will validate whether your soil and climate can sustain it, forecast weather across each growth stage, identify thermal/moisture risks, and formulate fertilizer and machinery schedules.
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Choose from 20+ crops or enter a custom specialty crop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Calculates exact harvest date & 7-stage growth milestones</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Generates custom nutrient program and machinery calendar</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 bg-emerald-800 group-hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Plan My Specific Crop</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* OPTION 2: SMART CROP RECOMMENDATION */}
            <div
              onClick={() => setAnalysisMode('smart-recommendation')}
              className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 border border-emerald-700/60 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-400/20 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/30">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    Option 2 • Beginner / Smart Discovery
                  </span>
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    Recommend the Best Crop for My Land
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  New to farming or exploring what will be most productive and resilient? Just enter your location and plot size. AgriNexa will evaluate all 20+ commercial crops against your local climate and rank the most suitable, beginner-friendly options.
                </p>

                <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero farming expertise or soil laboratory tests required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ranks crops with beginner difficulty and capital investment ratings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1-Click conversion from recommendation into complete farm plan</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Find Best Crops for Me</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPTION 2 VIEW: SMART CROP RECOMMENDATION */}
      {analysisMode === 'smart-recommendation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setAnalysisMode('choose-mode')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              ← Back to Option Choices
            </button>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <SmartCropRecommendationView
            onSelectCropAndGenerate={handleSelectFromRecommendation}
            onSwitchToManual={() => {
              setAnalysisMode('manual-validation');
              setCurrentStep(1);
            }}
          />
        </div>
      )}

      {/* OPTION 1 VIEW: MANUAL 5-STEP GUIDED WIZARD */}
      {analysisMode === 'manual-validation' && (
        <div className="space-y-6">
          {/* Header & Step Indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setAnalysisMode('choose-mode')}
                  className="text-xs font-semibold text-emerald-800 hover:underline mb-1 block"
                >
                  ← Switch Planning Option
                </button>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Option 1 • Specific Crop Plan
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Validate & Schedule: {formData.cropName}
                </h1>
              </div>
              <button
                onClick={onCancel}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            {/* Step Progression Bar */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {stepLabels.map((st) => {
                const isDone = st.num < currentStep;
                const isCurrent = st.num === currentStep;

                return (
                  <div
                    key={st.num}
                    className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 border border-emerald-300'
                        : isDone
                        ? 'bg-white border border-emerald-200 text-emerald-800'
                        : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                        isCurrent
                          ? 'bg-emerald-800 text-white'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : st.num}
                    </div>
                    <span
                      className={`text-[11px] font-semibold hidden sm:inline ${
                        isCurrent ? 'text-emerald-950 font-bold' : isDone ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Wizard Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8">
            {currentStep === 1 && (
              <StepLocation
                data={{
                  country: formData.country,
                  state: formData.state,
                  district: formData.district,
                  village: formData.village,
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  soilType: formData.soilType,
                  soilPh: formData.soilPh
                }}
                updateData={handleUpdate}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <StepLand
                data={{
                  landArea: formData.landArea,
                  landUnit: formData.landUnit,
                  soilType: formData.soilType,
                  soilPh: formData.soilPh,
                  irrigationAvailability: formData.irrigationAvailability,
                  previousCrop: formData.previousCrop
                }}
                updateData={handleUpdate}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <StepCrop
                crops={crops}
                selectedCrop={formData.cropName}
                onSelectCrop={handleCropSelect}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <StepCultivation
                cropName={formData.cropName}
                durationDays={formData.customDuration}
                plantingDate={formData.plantingDate}
                irrigationMethod={formData.irrigationMethod}
                farmingMethod={formData.farmingMethod}
                updateData={handleUpdate}
                onSubmit={handleSubmitAnalysis}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <StepProcessing
                onComplete={handleProcessingComplete}
                hasError={processingError}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
