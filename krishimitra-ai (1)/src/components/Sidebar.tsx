import React from "react";
import {
  LayoutDashboard,
  MessageSquareCode,
  ScanEye,
  CloudSun,
  TrendingUp,
  Droplets,
  Building2,
  Tractor,
  Bell,
  Settings,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { t } = useLanguage();
  const { unreadNotificationCount } = useFarm();

  const navItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "chat", label: t("aiChat"), icon: MessageSquareCode, badge: "AI Voice" },
    { id: "disease", label: t("diseaseDetection"), icon: ScanEye, highlight: true },
    { id: "weather", label: t("weatherForecast"), icon: CloudSun },
    { id: "prices", label: t("marketPrices"), icon: TrendingUp },
    { id: "fertilizer", label: t("fertilizerIrrigation"), icon: Droplets },
    { id: "schemes", label: t("governmentSchemes"), icon: Building2 },
    { id: "farms", label: t("farmsProfile"), icon: Tractor },
    { id: "notifications", label: t("notifications"), icon: Bell, count: unreadNotificationCount },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-3 border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col h-full justify-between">
        <nav className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Agricultural Portal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count && item.count > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom Rain Advisory Banner */}
        <div className="mt-4 p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
              ⛈️ Rain Alert
            </span>
            <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full">
              48h
            </span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-snug font-medium">
            Heavy rain expected in 48h. Secure harvested crops & clear field drainage.
          </p>
        </div>
      </div>
    </aside>
  );
};
