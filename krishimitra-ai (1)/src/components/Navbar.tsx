import React, { useState } from "react";
import {
  Sprout,
  Sun,
  Moon,
  Globe,
  Bell,
  Wifi,
  WifiOff,
  ChevronDown,
  Sparkles,
  MapPin,
  Smartphone,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { OtpAuthModal } from "./OtpAuthModal";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const {
    profile,
    farms,
    activeFarm,
    setActiveFarm,
    unreadNotificationCount,
    isDarkMode,
    toggleDarkMode,
    isOnline,
  } = useFarm();

  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-emerald-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage("dashboard")}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-emerald-900 dark:text-emerald-100 underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-4">
                  {t("appName")}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-600" /> AI 🌾
                </span>
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-slate-400 hidden sm:block font-medium">
                {t("appTagline")}
              </p>
            </div>
          </button>

          {/* Active Farm Selector */}
          {farms.length > 0 && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowFarmDropdown(!showFarmDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700/80 text-emerald-900 dark:text-emerald-200 text-xs font-semibold border border-emerald-200/60 dark:border-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[130px] truncate">
                  {activeFarm ? activeFarm.name : "Select Farm"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showFarmDropdown && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-emerald-100 dark:border-slate-800 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    My Fields ({farms.length})
                  </div>
                  {farms.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFarm(f);
                        setShowFarmDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors ${
                        activeFarm?.id === f.id
                          ? "font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-slate-800/60"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate">{f.name}</span>
                      <span className="text-[10px] text-slate-400">{f.cropName}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        setActivePage("farms");
                        setShowFarmDropdown(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      + Add New Field
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online / Offline Status */}
          <div
            title={isOnline ? "Online Mode - Synced" : "Offline Mode - Saved Locally"}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Synced</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Language Switcher Pill */}
          <div className="flex bg-emerald-100 dark:bg-slate-800 rounded-full p-1 border border-emerald-200/60 dark:border-slate-700">
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                language === "en"
                  ? "bg-white text-emerald-800 shadow-sm dark:bg-slate-700 dark:text-emerald-300 font-bold"
                  : "text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
              }`}
              title="Switch to English"
            >
              English
            </button>
            <button
              onClick={toggleLanguage}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                language === "hi"
                  ? "bg-white text-emerald-800 shadow-sm dark:bg-slate-700 dark:text-emerald-300 font-bold"
                  : "text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
              }`}
              title="Switch to Hindi"
            >
              हिन्दी
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Toggle Light / Dark theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActivePage("notifications")}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* OTP Login Button */}
          <button
            onClick={() => setShowOtpModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-105"
            title="Login with Mobile OTP"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {language === "hi" ? "ओटीपी लॉगिन" : "OTP Login"}
            </span>
          </button>

          {/* Farmer Profile Badge */}
          <div
            onClick={() => setActivePage("farms")}
            className="hidden sm:flex items-center gap-2.5 border-l border-emerald-100 dark:border-slate-800 pl-3 cursor-pointer hover:opacity-90 transition-opacity"
            title="Farmer Profile"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{profile.name}</p>
              <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{profile.phone || `${profile.state}, ${profile.district}`}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-200 dark:bg-emerald-900 border-2 border-emerald-400 dark:border-emerald-600 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-200 text-xs shadow-sm">
              {profile.name ? profile.name.charAt(0) : "👨‍🌾"}
            </div>
          </div>
        </div>
      </div>

      <OtpAuthModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} />
    </header>
  );
};
