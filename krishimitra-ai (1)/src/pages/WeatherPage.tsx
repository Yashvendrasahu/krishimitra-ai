import React, { useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

export const WeatherPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { weather, loadingWeather, refreshWeather, activeFarm } = useFarm();
  const [selectedCity, setSelectedCity] = useState("Ludhiana");

  const popularAgriCities = [
    "Ludhiana",
    "Karnal",
    "Khanna",
    "Agra",
    "Nashik",
    "Jaipur",
    "Rajkot",
    "Indore",
    "Varanasi",
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-emerald-600" />
            <span>{t("weatherForecast")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agricultural micro-climate forecast, soil moisture & spray timing advisory
          </p>
        </div>

        {/* Location Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 shadow-sm"
            >
              {popularAgriCities.map((city) => (
                <option key={city} value={city}>
                  📍 {city}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={refreshWeather}
            disabled={loadingWeather}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            title="Refresh weather"
          >
            <RefreshCw className={`w-4 h-4 ${loadingWeather ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {weather && (
        <>
          {/* Main Weather Card */}
          <div className="bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{weather.city}, {weather.state}</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    {weather.temp}°C
                  </span>
                  <span className="text-sm font-medium opacity-80">
                    Feels like {weather.feelsLike}°C
                  </span>
                </div>

                <p className="text-base font-semibold text-emerald-100 mt-2">
                  {weather.condition}
                </p>

                <p className="text-xs text-emerald-200 mt-1">
                  Soil Moisture: <span className="font-bold text-white">{weather.soilMoisture}%</span> • UV Index: {weather.uvIndex}
                </p>
              </div>

              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-emerald-200 text-[10px] uppercase font-bold">Rain Probability</p>
                  <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-1">
                    <CloudRain className="w-4 h-4 text-emerald-300" />
                    <span>{weather.rainProbability}%</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-emerald-200 text-[10px] uppercase font-bold">Air Humidity</p>
                  <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-1">
                    <Droplets className="w-4 h-4 text-blue-300" />
                    <span>{weather.humidity}%</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-emerald-200 text-[10px] uppercase font-bold">Wind Speed</p>
                  <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-1">
                    <Wind className="w-4 h-4 text-emerald-300" />
                    <span>{weather.windSpeed} km/h</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-emerald-200 text-[10px] uppercase font-bold">UV Level</p>
                  <p className="text-lg font-extrabold text-white mt-1 flex items-center gap-1">
                    <Sun className="w-4 h-4 text-amber-300" />
                    <span>{weather.uvIndex} Moderate</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Agronomy Spray & Irrigation Decision Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Smart Farming Decision Schedule for {weather.city}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>Pesticide Spray: Delay Spraying</span>
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 opacity-90">
                  65% rain probability today & tomorrow. Spray will wash off. Wait for sunny window on Monday.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Irrigation: Hold Water</span>
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 opacity-90">
                  Soil moisture is adequate (42%). Upcoming rain will satisfy crop water demand for 3 days.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Fertilizer Top-Dressing</span>
                </p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 opacity-90">
                  Ideal time to broadcast Urea right after light showers when soil is moist.
                </p>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>7-Day Agricultural Forecast</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-center space-y-2 transition-all ${
                    idx === 0
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                  }`}
                >
                  <p className="text-xs font-bold">{f.day}</p>
                  <p className="text-[10px] opacity-70">{f.date}</p>

                  <div className="text-xl my-1">
                    {f.rainProb > 50 ? "🌧" : f.rainProb > 20 ? "⛅" : "☀️"}
                  </div>

                  <p className="text-xs font-extrabold">
                    {f.tempMax}° / {f.tempMin}°
                  </p>

                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      idx === 0
                        ? "bg-white/20 text-white"
                        : f.rainProb > 50
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    🌧 {f.rainProb}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
