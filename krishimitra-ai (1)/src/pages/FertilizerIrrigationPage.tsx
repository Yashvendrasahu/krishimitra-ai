import React, { useState } from "react";
import {
  Droplets,
  Calculator,
  Calendar,
  FileText,
  DollarSign,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { FertilizerCalculation, IrrigationRecommendation } from "../types";
import { downloadFertilizerPdf } from "../components/PdfReportGenerator";

export const FertilizerIrrigationPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { activeFarm } = useFarm();

  const [activeTab, setActiveTab] = useState<"fertilizer" | "irrigation">("fertilizer");

  // Fertilizer Form State
  const [crop, setCrop] = useState<string>(activeFarm?.cropName || "Wheat (गेहूं)");
  const [area, setArea] = useState<number>(activeFarm?.areaAcres || 1);
  const [unit, setUnit] = useState<"acre" | "bigha" | "hectare">("acre");
  const [soilType, setSoilType] = useState<string>(activeFarm?.soilType || "Alluvial");
  const [season, setSeason] = useState<string>("Rabi");

  const [calcResult, setCalcResult] = useState<FertilizerCalculation | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  // Irrigation Form State
  const [growthStage, setGrowthStage] = useState<string>("Crown Root Initiation (20-25 days)");
  const [irrigationSystem, setIrrigationSystem] = useState<"drip" | "flood" | "sprinkler">("drip");

  const handleCalculateFertilizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    try {
      const res = await fetch("/api/fertilizer-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          area,
          unit,
          soilType,
          season,
        }),
      });

      if (!res.ok) throw new Error("Calculation failed");

      const data = await res.json();
      setCalcResult(data);
    } catch (err) {
      console.error(err);
      alert("Error calculating fertilizer schedule. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  // Mock calculation for Smart Irrigation
  const irrigationAdvice: IrrigationRecommendation = {
    crop: crop,
    growthStage: growthStage,
    waterRequirementLitersPerAcre: irrigationSystem === "drip" ? 18000 : 35000,
    irrigationFrequencyDays: soilType === "Sandy" ? 5 : 8,
    recommendedTime: "6:00 AM - 8:30 AM (Early Morning)",
    dripMethodAdvice: "Drip fertigation saves up to 45% water and prevents weed proliferation.",
    rainAdjustment: "Rain forecast tomorrow. Postpone scheduled irrigation by 2 days.",
    nextIrrigationDate: "05 August 2026",
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplets className="w-6 h-6 text-emerald-600" />
            <span>{t("fertilizerIrrigation")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Precision NPK bag dosage calculator & evapotranspiration water requirement planner
          </p>
        </div>

        {/* Dual Tab Toggle */}
        <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveTab("fertilizer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "fertilizer"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Fertilizer Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("irrigation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "irrigation"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Smart Irrigation</span>
          </button>
        </div>
      </div>

      {activeTab === "fertilizer" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Enter Crop & Land Details</span>
            </h2>

            <form onSubmit={handleCalculateFertilizer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selected Crop
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Wheat (गेहूं)">Wheat (गेहूं)</option>
                  <option value="Paddy / Rice (धान)">Paddy / Rice (धान)</option>
                  <option value="Tomato (टमाटर)">Tomato (टमाटर)</option>
                  <option value="Potato (आलू)">Potato (आलू)</option>
                  <option value="Cotton (कपास)">Cotton (कपास)</option>
                  <option value="Sugarcane (गन्ना)">Sugarcane (गन्ना)</option>
                  <option value="Mustard (सरसों)">Mustard (सरसों)</option>
                  <option value="Maize (मक्का)">Maize (मक्का)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Land Area
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="acre">Acres (एकड़)</option>
                    <option value="bigha">Bigha (बीघा)</option>
                    <option value="hectare">Hectare (हेक्टेयर)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Alluvial">Alluvial (जलोढ़)</option>
                    <option value="Black">Black Soil (काली)</option>
                    <option value="Red">Red Soil (लाल)</option>
                    <option value="Sandy">Sandy (बलुई)</option>
                    <option value="Clay">Clay (चिकनी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  >
                    <option value="Rabi">Rabi (रबी)</option>
                    <option value="Kharif">Kharif (खरीफ)</option>
                    <option value="Zaid">Zaid (जायद)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={calculating}
                className="w-full py-3 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating Soil Requirements...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Fertilizer Dosage</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            {calcResult ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {calcResult.crop} • {calcResult.area} {calcResult.unit}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Recommended Fertilizer Schedule
                    </h2>
                  </div>

                  <button
                    onClick={() => downloadFertilizerPdf(calcResult)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>PDF Schedule</span>
                  </button>
                </div>

                {/* Bags Required Grid */}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    Commercial Fertilizer Quantity Needed (50kg Bags)
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                      <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">UREA (46% N)</p>
                      <p className="text-lg font-extrabold text-amber-900 dark:text-amber-100 mt-0.5">
                        {calcResult.bagsNeeded.urea} Bags
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                      <p className="text-[10px] text-blue-800 dark:text-blue-300 font-bold">DAP (18:46:0)</p>
                      <p className="text-lg font-extrabold text-blue-900 dark:text-blue-100 mt-0.5">
                        {calcResult.bagsNeeded.dap} Bags
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                      <p className="text-[10px] text-purple-800 dark:text-purple-300 font-bold">MOP (60% K)</p>
                      <p className="text-lg font-extrabold text-purple-900 dark:text-purple-100 mt-0.5">
                        {calcResult.bagsNeeded.mop} Bags
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">EST. COST</p>
                      <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
                        ₹{calcResult.totalCostEstimateInr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage-wise Schedule Table */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Stage-wise Application Schedule
                  </p>

                  <div className="space-y-2">
                    {calcResult.schedule.map((stg, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {stg.stage} ({stg.stageHindi})
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {stg.timeframe}
                          </span>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Apply: {stg.fertilizer} ({stg.quantityKg} kg)
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {stg.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-emerald-100 dark:border-slate-800 shadow-sm text-center space-y-3">
                <Calculator className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Ready to Calculate Dosage
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Submit land size and crop on the left to generate exact Urea, DAP, and MOP bag requirements.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Smart Irrigation Tab */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Crop Growth Stage
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
              >
                <option value="Sowing / Germination (0-15 days)">Sowing / Germination (0-15 days)</option>
                <option value="Crown Root Initiation (20-25 days)">Crown Root Initiation (20-25 days)</option>
                <option value="Tillering & Jointing (40-45 days)">Tillering & Jointing (40-45 days)</option>
                <option value="Flowering / Grain Filling (75-85 days)">Flowering / Grain Filling (75-85 days)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationSystem}
                onChange={(e) => setIrrigationSystem(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
              >
                <option value="drip">Drip Irrigation (ड्रिप)</option>
                <option value="flood">Flood / Channel (बहाव)</option>
                <option value="sprinkler">Sprinkler (फव्वारा)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Soil Type
              </label>
              <input
                type="text"
                disabled
                value={soilType}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500"
              />
            </div>
          </div>

          {/* Irrigation Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 border border-blue-200/80 dark:border-slate-700 space-y-2">
              <p className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-600" /> Water Volume Required
              </p>
              <p className="text-2xl font-extrabold text-blue-950 dark:text-white">
                {irrigationAdvice.waterRequirementLitersPerAcre.toLocaleString()} Liters / Acre
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-300 opacity-90">
                Recommended Frequency: Every {irrigationAdvice.irrigationFrequencyDays} days
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-800 dark:to-slate-900 border border-emerald-200/80 dark:border-slate-700 space-y-2">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Optimal Water Window
              </p>
              <p className="text-lg font-bold text-emerald-950 dark:text-white">
                {irrigationAdvice.recommendedTime}
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 opacity-90">
                Next Scheduled Irrigation: {irrigationAdvice.nextIrrigationDate}
              </p>
            </div>
          </div>

          {/* Rain Adjustment Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Weather-based Irrigation Auto-Adjustment:</p>
              <p className="mt-0.5 opacity-90">{irrigationAdvice.rainAdjustment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
