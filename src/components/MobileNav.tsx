import React, { useState } from "react";
import {
  LayoutDashboard,
  MessageSquareCode,
  ScanEye,
  CloudSun,
  TrendingUp,
  Menu,
  X,
  Droplets,
  Building2,
  Tractor,
  Bell,
  Settings,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

interface MobileNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activePage, setActivePage }) => {
  const { t } = useLanguage();
  const { unreadNotificationCount } = useFarm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "chat", label: "AI Chat", icon: MessageSquareCode },
    { id: "disease", label: "Scan Crop", icon: ScanEye, highlight: true },
    { id: "weather", label: "Weather", icon: CloudSun },
    { id: "prices", label: "Mandi Rates", icon: TrendingUp },
  ];

  const drawerItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "chat", label: t("aiChat"), icon: MessageSquareCode },
    { id: "disease", label: t("diseaseDetection"), icon: ScanEye },
    { id: "weather", label: t("weatherForecast"), icon: CloudSun },
    { id: "prices", label: t("marketPrices"), icon: TrendingUp },
    { id: "fertilizer", label: t("fertilizerIrrigation"), icon: Droplets },
    { id: "schemes", label: t("governmentSchemes"), icon: Building2 },
    { id: "farms", label: t("farmsProfile"), icon: Tractor },
    { id: "notifications", label: t("notifications"), icon: Bell, count: unreadNotificationCount },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 p-5 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌾</span>
                  <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                    {t("appName")}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-600 text-white font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count && item.count > 0 ? (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Kisan Helpline: 1800-180-1551
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-emerald-100 dark:border-slate-800 lg:hidden px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  tab.highlight
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 -mt-3 scale-105"
                    : isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className={`${tab.highlight ? "w-5 h-5" : "w-4 h-4"}`} />
                <span className={`text-[10px] mt-0.5 ${isActive ? "font-bold" : "font-medium"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
