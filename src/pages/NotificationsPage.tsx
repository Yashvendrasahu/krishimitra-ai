import React from "react";
import { Bell, Check, Trash2, CloudRain, ShieldAlert, TrendingUp, Building2, Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";

export const NotificationsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { notifications, markNotificationRead, clearNotifications } = useFarm();

  const getIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case "disease":
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case "market":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "scheme":
        return <Building2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>{t("notifications")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weather alerts, disease warnings, price surges & scheme updates
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No unread alerts or notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`py-3 px-3 rounded-2xl flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                  !n.read
                    ? "bg-emerald-50/60 dark:bg-slate-800/60 font-semibold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {language === "hi" && n.titleHindi ? n.titleHindi : n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {language === "hi" && n.messageHindi ? n.messageHindi : n.message}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {n.date}
                    </p>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                    }}
                    className="p-1 rounded-lg hover:bg-emerald-200/50 text-emerald-700"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
