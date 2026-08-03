import React, { useState } from "react";
import {
  Tractor,
  User,
  Plus,
  Trash2,
  MapPin,
  CheckCircle2,
  PlusCircle,
  Save,
  Sprout,
  Calendar,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFarm } from "../context/FarmContext";
import { Farm } from "../types";

export const FarmsProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, updateProfile, farms, addFarm, deleteFarm, activeFarm, setActiveFarm } = useFarm();

  const [showAddModal, setShowAddModal] = useState(false);

  // Profile Form
  const [profileName, setProfileName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [district, setDistrict] = useState(profile.district);
  const [state, setState] = useState(profile.state);
  const [mandiPref, setMandiPref] = useState(profile.mandiPreference);

  // Add Farm Form
  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("Wheat (गेहूं)");
  const [cropVariety, setCropVariety] = useState("Sharbati");
  const [areaAcres, setAreaAcres] = useState(2.5);
  const [soilType, setSoilType] = useState<any>("Alluvial");
  const [sowingDate, setSowingDate] = useState("2025-11-15");
  const [placeName, setPlaceName] = useState(profile.district + ", " + profile.state);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone,
      district,
      state,
      mandiPreference: mandiPref,
    });
    alert("Profile details updated successfully!");
  };

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    const newFarm: Farm = {
      id: "farm_" + Date.now(),
      name: farmName,
      cropName,
      cropVariety,
      areaAcres,
      sowingDate,
      soilType,
      location: {
        lat: 30.9,
        lng: 75.85,
        placeName,
      },
      healthStatus: "Healthy",
    };

    addFarm(newFarm);
    setShowAddModal(false);
    setFarmName("");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tractor className="w-6 h-6 text-emerald-600" />
            <span>{t("farmsProfile")}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage field land records, crop varieties, soil types & farmer contact info
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Field</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registered Farms List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Registered Agricultural Fields ({farms.length})</span>
          </h2>

          <div className="space-y-3">
            {farms.map((farm) => {
              const isActive = activeFarm?.id === farm.id;

              return (
                <div
                  key={farm.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isActive
                      ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                      : "bg-white dark:bg-slate-900 border-emerald-100 dark:border-slate-800 shadow-sm hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-slate-900 dark:text-white">
                          {farm.name}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        📍 {farm.location.placeName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveFarm(farm)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100"
                        }`}
                      >
                        {isActive ? "Selected" : "Select"}
                      </button>

                      {farms.length > 1 && (
                        <button
                          onClick={() => deleteFarm(farm.id)}
                          className="p-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100"
                          title="Delete Field"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Crop</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{farm.cropName}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Area</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{farm.areaAcres} Acres</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Soil Type</p>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{farm.soilType}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Status</p>
                      <p className="font-bold text-emerald-600">{farm.healthStatus}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Farmer Profile Form */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Farmer Account Details</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred APMC Mandi
                </label>
                <input
                  type="text"
                  value={mandiPref}
                  onChange={(e) => setMandiPref(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for Adding New Farm */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-100 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>Register New Field Plot</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFarm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Field Name / Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Plot (गेहूं का खेत)"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Crop
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Alluvial">Alluvial (जलोढ़)</option>
                  <option value="Black">Black Soil (काली)</option>
                  <option value="Red">Red Soil (लाल)</option>
                  <option value="Sandy">Sandy (बलुई)</option>
                  <option value="Clay">Clay (चिकनी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location Place Name
                </label>
                <input
                  type="text"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
