import React, { createContext, useContext, useState, useEffect } from "react";
import { Farm, FarmerProfile, NotificationItem, WeatherData, MandiPrice, DiseaseAnalysis } from "../types";
import { storageService, isFirebaseConfigured } from "../lib/firebase";

interface FarmContextType {
  profile: FarmerProfile;
  updateProfile: (updated: Partial<FarmerProfile>) => void;
  farms: Farm[];
  activeFarm: Farm | null;
  setActiveFarm: (farm: Farm) => void;
  addFarm: (farm: Farm) => void;
  deleteFarm: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadNotificationCount: number;
  weather: WeatherData | null;
  loadingWeather: boolean;
  refreshWeather: () => Promise<void>;
  mandiPrices: MandiPrice[];
  loadingPrices: boolean;
  diseaseReports: DiseaseAnalysis[];
  addDiseaseReport: (report: DiseaseAnalysis) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FarmerProfile>(() => storageService.getProfile());
  const [farms, setFarms] = useState<Farm[]>(() => storageService.getFarms());
  const [activeFarm, setActiveFarm] = useState<Farm | null>(() => (farms.length > 0 ? farms[0] : null));
  const [diseaseReports, setDiseaseReports] = useState<DiseaseAnalysis[]>(() => storageService.getDiseaseReports());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("krishimitra_theme") === "dark";
  });

  // Dark Mode side effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("krishimitra_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("krishimitra_theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch Weather
  const refreshWeather = async () => {
    setLoadingWeather(true);
    try {
      const city = activeFarm?.location.placeName.split(",")[0] || profile.district || "Ludhiana";
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.error("Failed to fetch weather", e);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch Prices & Notifications on mount
  useEffect(() => {
    refreshWeather();

    const fetchPrices = async () => {
      setLoadingPrices(true);
      try {
        const res = await fetch("/api/market-prices");
        if (res.ok) {
          const data = await res.json();
          setMandiPrices(data.prices || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrices(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchPrices();
    fetchNotifications();

    // Firebase Firestore Sync
    if (isFirebaseConfigured) {
      storageService.fetchProfileFromFirebase().then((remoteProfile) => {
        if (remoteProfile) setProfile(remoteProfile);
      });
      storageService.fetchFarmsFromFirebase().then((remoteFarms) => {
        if (remoteFarms && remoteFarms.length > 0) setFarms(remoteFarms);
      });
      storageService.fetchDiseaseReportsFromFirebase().then((remoteReports) => {
        if (remoteReports) setDiseaseReports(remoteReports);
      });
    }
  }, []);

  // Sync activeFarm when farms change
  useEffect(() => {
    if (!activeFarm && farms.length > 0) {
      setActiveFarm(farms[0]);
    }
  }, [farms, activeFarm]);

  const updateProfile = (updated: Partial<FarmerProfile>) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  const addFarm = (farm: Farm) => {
    const updatedFarms = storageService.saveFarm(farm);
    setFarms(updatedFarms);
    setActiveFarm(farm);
  };

  const deleteFarm = (id: string) => {
    const updatedFarms = storageService.deleteFarm(id);
    setFarms(updatedFarms);
    if (activeFarm?.id === id) {
      setActiveFarm(updatedFarms[0] || null);
    }
  };

  const addDiseaseReport = (report: DiseaseAnalysis) => {
    const updated = storageService.saveDiseaseReport(report);
    setDiseaseReports(updated);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <FarmContext.Provider
      value={{
        profile,
        updateProfile,
        farms,
        activeFarm,
        setActiveFarm,
        addFarm,
        deleteFarm,
        notifications,
        markNotificationRead,
        unreadNotificationCount,
        weather,
        loadingWeather,
        refreshWeather,
        mandiPrices,
        loadingPrices,
        diseaseReports,
        addDiseaseReport,
        isDarkMode,
        toggleDarkMode,
        isOnline,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm must be used within FarmProvider");
  }
  return context;
};
