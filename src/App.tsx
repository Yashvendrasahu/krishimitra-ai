import React, { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { FarmProvider } from "./context/FarmContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";

import { Dashboard } from "./pages/Dashboard";
import { AiChat } from "./pages/AiChat";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { WeatherPage } from "./pages/WeatherPage";
import { MarketPricesPage } from "./pages/MarketPricesPage";
import { FertilizerIrrigationPage } from "./pages/FertilizerIrrigationPage";
import { GovernmentSchemesPage } from "./pages/GovernmentSchemesPage";
import { FarmsProfilePage } from "./pages/FarmsProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";

function AppContent() {
  const [activePage, setActivePage] = useState<string>("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} />;
      case "chat":
        return <AiChat />;
      case "disease":
        return <DiseaseDetection />;
      case "weather":
        return <WeatherPage />;
      case "prices":
        return <MarketPricesPage />;
      case "fertilizer":
        return <FertilizerIrrigationPage />;
      case "schemes":
        return <GovernmentSchemesPage />;
      case "farms":
        return <FarmsProfilePage />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Sticky Tab Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <FarmProvider>
        <AppContent />
      </FarmProvider>
    </LanguageProvider>
  );
}
