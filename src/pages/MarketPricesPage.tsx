import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { MandiPrice } from "../types";

export const MarketPricesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { mandiPrices, loadingPrices } = useFarm();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<MandiPrice | null>(null);

  const filteredPrices = mandiPrices.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.crop.toLowerCase().includes(query) ||
      item.cropHindi.includes(query) ||
      item.mandi.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query)
    );
  });

  const activePrice = selectedCrop || filteredPrices[0] || mandiPrices[0];

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>{t("marketPrices")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live APMC Mandi rates across Indian states & 7-day price trend analysis
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, mandi or state..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Selected Crop Recharts Trend Chart */}
      {activePrice && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {activePrice.state} • {activePrice.mandi}
                </span>
                <span className="text-xs text-slate-400">Variety: {activePrice.variety}</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {activePrice.crop} ({activePrice.cropHindi})
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                ₹{activePrice.modalPrice} <span className="text-xs font-semibold text-slate-400">/ Quintal</span>
              </p>
              <div
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  activePrice.change >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {activePrice.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>
                  {activePrice.change >= 0 ? `+₹${activePrice.change}` : `₹${activePrice.change}`} today
                </span>
              </div>
            </div>
          </div>

          {/* Min / Modal / Max Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Min Price</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                ₹{activePrice.minPrice}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Modal Rate</p>
              <p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">
                ₹{activePrice.modalPrice}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Max Price</p>
              <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                ₹{activePrice.maxPrice}
              </p>
            </div>
          </div>

          {/* Recharts Price History Line Chart */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              7-Day Price Trend History (₹ / Quintal)
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activePrice.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={["auto", "auto"]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      color: "#ffffff",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: "#16a34a", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Mandi Price Table & List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>State Mandi Price Board ({filteredPrices.length})</span>
          </span>
          <span className="text-xs font-normal text-slate-400">Click row to inspect trend</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Crop / Variety</th>
                <th className="py-3 px-3">Mandi / District</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3 text-right">Modal Price</th>
                <th className="py-3 px-3 text-right">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredPrices.map((item) => {
                const isSelected = activePrice?.id === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedCrop(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/80 dark:bg-slate-800 font-semibold text-emerald-900 dark:text-emerald-200"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <td className="py-3 px-3">
                      <p className="font-bold">{item.crop} ({item.cropHindi})</p>
                      <p className="text-[10px] text-slate-400">{item.variety}</p>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium">{item.mandi}</p>
                      <p className="text-[10px] text-slate-400">{item.district}</p>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-400">
                      {item.state}
                    </td>

                    <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{item.modalPrice} <span className="text-[10px] text-slate-400 font-normal">/ Qtl</span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] ${
                          item.change >= 0
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {item.change >= 0 ? `+₹${item.change}` : `₹${item.change}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
