import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Farm } from "../types";

interface LeafletMapProps {
  farms: Farm[];
  activeFarm?: Farm | null;
  onSelectFarm?: (farm: Farm) => void;
  height?: string;
}

const NEARBY_HUBS = [
  {
    name: "Khanna APMC Grain Mandi",
    type: "Mandi",
    lat: 30.702,
    lng: 76.22,
    details: "Wheat & Paddy Hub | Daily Auction 8 AM",
  },
  {
    name: "Azadpur Fruit & Vegetable Market",
    type: "Mandi",
    lat: 28.716,
    lng: 77.172,
    details: "Tomato, Potato, Onion Cold Storage",
  },
  {
    name: "Ludhiana Krishi Vigyan Kendra (KVK)",
    type: "Soil Testing",
    lat: 30.902,
    lng: 75.81,
    details: "Soil Health Testing Lab | Govt Subsidized",
  },
  {
    name: "IARI Regional Agricultural Research Station",
    type: "Research",
    lat: 30.88,
    lng: 75.84,
    details: "High Yield Seed Distribution Center",
  },
];

export const LeafletMap: React.FC<LeafletMapProps> = ({
  farms,
  activeFarm,
  onSelectFarm,
  height = "h-80",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center (Ludhiana / Punjab region or active farm)
    const centerLat = activeFarm?.location.lat || 30.901;
    const centerLng = activeFarm?.location.lng || 75.8573;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 9);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 9);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon factories
    const greenFarmIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color:#16a34a; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:bold;">🌾</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const orangeMandiIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color:#ea580c; width:24px; height:24px; border-radius:50%; border:2px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:12px;">🏪</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const blueKvkIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color:#2563eb; width:24px; height:24px; border-radius:50%; border:2px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:12px;">🔬</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Plot Farmer Fields
    farms.forEach((farm) => {
      const marker = L.marker([farm.location.lat, farm.location.lng], { icon: greenFarmIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #16a34a; font-size: 14px;">${farm.name}</strong><br/>
          <span><strong>Crop:</strong> ${farm.cropName} (${farm.areaAcres} Acres)</span><br/>
          <span><strong>Soil:</strong> ${farm.soilType}</span><br/>
          <span style="color: ${farm.healthStatus === "Healthy" ? "#16a34a" : "#d97706"}; font-weight: bold;">Status: ${farm.healthStatus}</span>
        </div>
      `);

      if (onSelectFarm) {
        marker.on("click", () => onSelectFarm(farm));
      }
    });

    // Plot Nearby Agricultural Hubs
    NEARBY_HUBS.forEach((hub) => {
      const icon = hub.type === "Mandi" ? orangeMandiIcon : blueKvkIcon;
      const marker = L.marker([hub.lat, hub.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #2563eb; font-size: 13px;">${hub.name}</strong><br/>
          <span style="font-size: 11px; color: #64748b;">${hub.type}</span><br/>
          <span style="font-size: 12px;">${hub.details}</span>
        </div>
      `);
    });

    // Force map container resize recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [farms, activeFarm]);

  return (
    <div className={`w-full rounded-2xl overflow-hidden border border-emerald-200 dark:border-slate-800 shadow-sm relative z-0 ${height}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[250px]" />
    </div>
  );
};
