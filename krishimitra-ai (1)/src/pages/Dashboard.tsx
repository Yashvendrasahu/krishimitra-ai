import React from "react";
import {
  CloudSun,
  ScanEye,
  TrendingUp,
  Droplets,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Bot,
  MapPin,
  Calendar,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { LeafletMap } from "../components/LeafletMap";

interface DashboardProps {
  setActivePage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { t, language } = useLanguage();
  const {
    profile,
    farms,
    activeFarm,
    weather,
    mandiPrices,
    diseaseReports,
    notifications,
  } = useFarm();

  const latestReport = diseaseReports[0];

  return (
    <div className="space-y-6 pb-20 lg:pb-10">
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-800 text-white p-6 sm:p-8 shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold backdrop-blur-sm">
            <span>🌾</span>
            <span>
              {language === "hi"
                ? `राम राम, ${profile.name} जी!`
                : `Welcome back, ${profile.name}!`}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            {language === "hi"
              ? "आपकी फसल का स्मार्ट AI सुरक्षा कवच"
              : "Smart Precision & AI Protection for Your Crops"}
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm font-normal max-w-xl">
            {language === "hi"
              ? "आज का मौसम अनुकूल है। पत्तियों के पीलेपन और नमी की स्थिति पर AI नजर रख रहा है।"
              : "Favorable farming conditions detected today. AI is actively monitoring leaf health & moisture logs."}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage("chat")}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4 text-slate-900" />
              <span>{language === "hi" ? "AI से सवाल पूछें (बोलकर)" : "Ask AI Assistant (Voice)"}</span>
            </button>

            <button
              onClick={() => setActivePage("disease")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-xs backdrop-blur-md flex items-center gap-2 transition-colors"
            >
              <ScanEye className="w-4 h-4" />
              <span>{language === "hi" ? "फसल फोटो स्कैन करें" : "Scan Disease Photo"}</span>
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-9xl">
          🌾
        </div>
      </div>

      {/* Top Row: High Density Stats & Active Crop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather Card */}
        <div className="sm:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Today's Weather</p>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">{weather ? weather.temp : 28}°C</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {weather ? weather.condition : "Mostly Sunny"} • Humidity {weather ? weather.humidity : 45}%
            </p>
          </div>
          <div className="text-5xl">☀️</div>
        </div>

        {/* Soil Moisture Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Soil Moisture</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {weather ? weather.soilMoisture : 34}%
            </h3>
            <div className="w-full bg-emerald-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${weather ? weather.soilMoisture : 34}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
            💧 Irrigation recommended in 4h
          </p>
        </div>

        {/* Active Crop Card */}
        <div className="bg-emerald-900 dark:bg-emerald-950 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Active Crop</p>
          <div className="flex justify-between items-end mt-4 z-10">
            <div>
              <h3 className="text-xl font-extrabold">{activeFarm?.cropName || "Wheat"}</h3>
              <p className="text-[11px] text-emerald-200">{activeFarm?.name || "Main Plot"} • {activeFarm?.areaAcres || 4.5} Acres</p>
            </div>
            <span className="text-xs bg-emerald-800/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-700/50 font-bold shrink-0">
              Stage: Tillering
            </span>
          </div>
          <div className="absolute right-2 top-2 text-4xl opacity-10 pointer-events-none">🌾</div>
        </div>
      </div>

      {/* Middle Grid: Disease Lab & Mandi Price Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease Detection Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white text-sm">
              <span className="text-emerald-600">🦠</span> Disease Lab
            </h4>
            <button
              onClick={() => setActivePage("disease")}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              View History
            </button>
          </div>
          <div className="flex-1 border-2 border-dashed border-emerald-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/30 dark:bg-slate-800/30 gap-2 p-4 text-center">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-xl shadow-sm border border-emerald-100 dark:border-slate-700">
              📸
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Detect Crop Disease</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload a clear photo of leaf or stem</p>
            </div>
            <button
              onClick={() => setActivePage("disease")}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Upload Image
            </button>
          </div>
        </div>

        {/* Mandi Price Trends */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-slate-800 p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white text-sm">
              <span className="text-emerald-600">📈</span> Mandi Prices
            </h4>
            <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-400">
              <span>Daily</span>
              <span className="text-emerald-600 dark:text-emerald-400 underline">Weekly</span>
              <span>Monthly</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Tomato</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ₹2,400 <span className="text-red-500 text-[10px] font-normal">↓ 2.1%</span>
              </p>
              <p className="text-[10px] text-slate-400">Karnal Mandi</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Wheat</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ₹2,125 <span className="text-emerald-500 text-[10px] font-normal">↑ 0.8%</span>
              </p>
              <p className="text-[10px] text-slate-400">Ambala Mandi</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Potato</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                ₹1,800 <span className="text-emerald-500 text-[10px] font-normal">↑ 4.5%</span>
              </p>
              <p className="text-[10px] text-slate-400">Panipat Mandi</p>
            </div>
          </div>
          <div className="h-16 mt-1 bg-emerald-50/40 dark:bg-slate-800/30 rounded-xl border border-emerald-100/50 dark:border-slate-800 flex items-end justify-between p-2 gap-1.5">
            <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 h-[40%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-300 dark:bg-emerald-800/70 h-[60%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-400 dark:bg-emerald-700/80 h-[55%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-500 dark:bg-emerald-600/90 h-[80%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-600 dark:bg-emerald-500 h-[70%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-700 dark:bg-emerald-400 h-[95%] rounded-t-sm"></div>
            <div className="w-full bg-emerald-600 dark:bg-emerald-500 h-[85%] rounded-t-sm"></div>
          </div>
        </div>
      </div>

      {/* Fertilizer Calculator Row */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-emerald-100 dark:border-slate-800 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100 dark:border-slate-700 shrink-0">
            🧮
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-white">Fertilizer Calculator</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Get AI-suggested Urea & DAP dosage for your field area.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select defaultValue="Wheat" className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none rounded-full px-4 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500">
            <option value="">Select Crop</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice / Paddy">Rice / Paddy</option>
            <option value="Mustard">Mustard</option>
          </select>
          <input
            type="number"
            placeholder="Land (Acre)"
            defaultValue={activeFarm?.areaAcres || 4.5}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none rounded-full px-4 py-2 text-xs font-semibold w-28 focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={() => setActivePage("fertilizer")}
            className="bg-emerald-900 hover:bg-emerald-950 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            Calculate
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Buttons */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t("quickActions")}</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActivePage("chat")}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-800 dark:to-slate-900 border border-emerald-200/80 dark:border-slate-700 hover:shadow-md text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Voice Assistant</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Ask in Hindi / Eng</p>
            </button>

            <button
              onClick={() => setActivePage("fertilizer")}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-900 border border-amber-200/80 dark:border-slate-700 hover:shadow-md text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                <Droplets className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Fertilizer Calc</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Urea & DAP Dosage</p>
            </button>

            <button
              onClick={() => setActivePage("schemes")}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 border border-blue-200/80 dark:border-slate-700 hover:shadow-md text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Govt Schemes</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">PM-KISAN Subsidies</p>
            </button>

            <button
              onClick={() => setActivePage("weather")}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-800 dark:to-slate-900 border border-purple-200/80 dark:border-slate-700 hover:shadow-md text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow group-hover:scale-110 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">Irrigation Advisory</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Rain & Drip Water</p>
            </button>
          </div>

          {/* Scheme Alert Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t("schemeAlerts")}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
                Deadline Soon
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Pradhan Mantri Fasal Bima Yojana (PMFBY)
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Kharif crop insurance subsidy closes August 31, 2026. Get up to 90% premium coverage.
            </p>
            <button
              onClick={() => setActivePage("schemes")}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Apply / View Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Preview Component */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Interactive Field & Mandi Map</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Displaying your farm coordinates and nearby APMC Mandis / Soil Labs
              </p>
            </div>
            <button
              onClick={() => setActivePage("farms")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Manage Fields
            </button>
          </div>

          <LeafletMap farms={farms} activeFarm={activeFarm} height="h-72" />

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Your Fields
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" /> APMC Mandi
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Soil Labs (KVK)
              </span>
            </div>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </div>
    </div>
  );
};
