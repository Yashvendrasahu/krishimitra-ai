import React, { useState } from "react";
import {
  Settings,
  Languages,
  Volume2,
  Moon,
  Wifi,
  Download,
  RotateCcw,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { storageService } from "../lib/firebase";
import { OtpAuthModal } from "../components/OtpAuthModal";

export const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { profile } = useFarm();
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleResetData = () => {
    if (window.confirm("This will clear cached chat history and restore default farmer state. Continue?")) {
      storageService.clearChatHistory();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>{t("settings")}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          App preferences, language options, voice speech settings & mobile OTP account
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-6">
        {/* Mobile Number & OTP Login Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-green-800 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {language === "hi" ? "मोबाइल नंबर सत्यापन (OTP Login)" : "Mobile Number OTP Verification"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {profile.phone ? `Logged in: ${profile.phone} (${profile.name})` : "Enter mobile number to sync farms & alerts"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowOtpModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-sm hover:bg-emerald-50 transition-all flex items-center gap-2 shrink-0"
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>{language === "hi" ? "ओटीपी से लॉगिन / नंबर बदलें" : "Login / Change Number"}</span>
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-emerald-600" />
            <span>App Preferred Language (भाषा चुनें)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setLanguage("hi")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                language === "hi"
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md shadow-emerald-600/20"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
            >
              <p className="text-sm font-bold">हिंदी (Hindi)</p>
              <p className="text-[10px] opacity-80 mt-0.5">वॉयस और एआई चैट सपोर्ट</p>
            </button>

            <button
              onClick={() => setLanguage("en")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                language === "en"
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-md shadow-emerald-600/20"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
            >
              <p className="text-sm font-bold">English</p>
              <p className="text-[10px] opacity-80 mt-0.5">Full AI Voice Support</p>
            </button>
          </div>
        </div>

        {/* Voice Speech Settings */}
        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Voice Assistant & Speech Synthesis</span>
          </h2>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Auto Read Out AI Responses</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automatically plays voice narration when Gemini AI finishes generating answers.
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600" />
          </div>
        </div>

        {/* PWA / Offline Status */}
        <div className="space-y-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Progressive Web App (PWA) & Offline Cache</span>
          </h2>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">
                  PWA Ready & Local Storage Persistence
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Mandi prices and crop disease logs remain accessible even without mobile internet.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
              Active
            </span>
          </div>
        </div>

        {/* Storage Reset */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Storage & Cache</span>
          </h2>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 hover:bg-red-100 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Cache & Reset App State</span>
          </button>
        </div>
      </div>

      <OtpAuthModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} />
    </div>
  );
};
