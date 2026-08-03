import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "../types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
}

const DICTIONARY: Record<string, { en: string; hi: string }> = {
  appName: { en: "KrishiMitra AI", hi: "कृषि मित्र AI" },
  appTagline: { en: "Smart AI Assistant for Farmers", hi: "किसानों का स्मार्ट AI सलाहकार" },
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  aiChat: { en: "AI Chat Assistant", hi: "AI चैट सहायक" },
  diseaseDetection: { en: "Disease Detection", hi: "फसल रोग पहचान" },
  weatherForecast: { en: "Weather Forecast", hi: "मौसम पूर्वानुमान" },
  marketPrices: { en: "Market Prices", hi: "मंडी भाव" },
  fertilizerIrrigation: { en: "Fertilizer & Irrigation", hi: "खाद एवं सिंचाई" },
  governmentSchemes: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
  farmsProfile: { en: "My Farms & Profile", hi: "मेरे खेत एवं प्रोफाइल" },
  notifications: { en: "Notifications", hi: "सूचनाएं" },
  settings: { en: "Settings", hi: "सेटिंग्स" },

  // Dashboard translations
  weatherToday: { en: "Today's Weather", hi: "आज का मौसम" },
  cropHealthSummary: { en: "Crop Health Summary", hi: "फसल स्वास्थ्य का हाल" },
  aiRecommendations: { en: "AI Recommendations", hi: "AI सलाह और सुझाव" },
  mandiPriceWidget: { en: "Market Rates Today", hi: "आज के ताजा मंडी भाव" },
  schemeAlerts: { en: "Scheme Alerts & Subsidies", hi: "सरकारी योजना एवं सब्सिडी अपडेट" },
  quickActions: { en: "Quick Farmer Actions", hi: "त्वरित किसान सेवाएं" },

  // Action buttons
  uploadPhoto: { en: "Upload Crop Photo", hi: "फसल का फोटो अपलोड करें" },
  askVoice: { en: "Voice Assistant", hi: "बोलकर सवाल पूछें" },
  calculateFertilizer: { en: "Fertilizer Calculator", hi: "खाद मात्रा मापें" },
  downloadPdf: { en: "Download PDF Report", hi: "PDF रिपोर्ट डाउनलोड करें" },
  scanCrop: { en: "Scan Disease", hi: "रोग की जांच करें" },
  getIrrigationSchedule: { en: "Water Schedule", hi: "सिंचाई समय सारणी" },

  // Common UI
  acres: { en: "Acres", hi: "एकड़" },
  quintal: { en: "Quintal", hi: "कुंतल" },
  inr: { en: "₹", hi: "₹" },
  searchPlaceholder: { en: "Search crop, mandi, scheme or ask AI...", hi: "फसल, मंडी, योजना या AI से सवाल खोजें..." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("krishimitra_lang") as Language) || "hi";
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("krishimitra_lang", lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key].en;
    }
    return key;
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        speakText,
        isSpeaking,
        stopSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
