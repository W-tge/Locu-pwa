"use client";

import { useEffect, useRef, useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Navigation,
} from "lucide-react";

export function TripMap() {
  const { trip, selectedStop, setSelectedStop, setSelectedLeg } = useTrip();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || map) return;

    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      // Calculate bounds for Andes route
      const bounds = L.latLngBounds(
        trip.stops.map((stop) => [stop.latitude, stop.longitude])
      );

      // Initialize map
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).fitBounds(bounds, { padding: [40, 40] });

      // Use a clean, modern tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(mapInstance);

      setMap(mapInstance);

      // Custom marker icon
      const createIcon = (
        color: string,
        isActive: boolean = false,
        isSelected: boolean = false
      ) => {
        const size = isSelected ? 28 : isActive ? 24 : 18;
        const pulseRing = isActive
          ? `<div style="
            position: absolute;
            top: -6px;
            left: -6px;
            width: ${size + 12}px;
            height: ${size + 12}px;
            border: 2px solid ${color};
            border-radius: 50%;
            animation: pulse 2s ease-out infinite;
            opacity: 0.6;
          "></div>`
          : "";

        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position: relative;">
              ${pulseRing}
              <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${isActive ? '<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>' : ""}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Add route polylines with different styles
      trip.transitLegs.forEach((leg) => {
        const fromStop = trip.stops.find((s) => s.id === leg.fromStopId);
        const toStop = trip.stops.find((s) => s.id === leg.toStopId);
        if (!fromStop || !toStop) return;

        const isBooked = leg.bookingStatus === "booked";
        const isPending = leg.bookingStatus === "pending";
        const isJeep = leg.type === "jeep";
        const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

        // Create curved path for visual interest
        const latlngs = [
          [fromStop.latitude, fromStop.longitude],
          [toStop.latitude, toStop.longitude],
        ];

        const polyline = L.polyline(latlngs as [number, number][], {
          color: color,
          weight: isBooked ? 5 : 4,
          opacity: isBooked ? 1 : 0.7,
          // Jeep/offroad routes are dashed, buses are solid
          dashArray: isJeep ? "12, 8" : isBooked ? undefined : "6, 6",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapInstance);

        polyline.on("click", () => {
          setSelectedLeg(leg);
        });

        // Add transport mode label on the line
        const midLat = (fromStop.latitude + toStop.latitude) / 2;
        const midLng = (fromStop.longitude + toStop.longitude) / 2;

        const modeIcon = L.divIcon({
          className: "mode-label",
          html: `
            <div style="
              background: ${color};
              color: white;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              text-transform: uppercase;
            ">
              ${leg.type === "jeep" ? "JEEP" : leg.type === "ferry" ? "FERRY" : "BUS"} ${leg.duration}
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });

        L.marker([midLat, midLng], { icon: modeIcon, interactive: false }).addTo(
          mapInstance
        );

        polylinesRef.current.push(polyline);
      });

      // Add stop markers
      trip.stops.forEach((stop, index) => {
        const isActive = stop.status === "ACTIVE";
        const isBooked = stop.bookingStatus === "booked";
        const isPending = stop.bookingStatus === "pending";
        const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: createIcon(color, isActive),
          zIndexOffset: isActive ? 1000 : index,
        }).addTo(mapInstance);

        // Popup content
        const popupContent = `
          <div style="padding: 10px; min-width: 180px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 15px;">${stop.city}</span>
              ${isActive ? '<span style="background: #FC2869; color: white; padding: 2px 6px; border-radius: 8px; font-size: 9px; font-weight: 600;">NOW</span>' : ""}
            </div>
            <div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">${stop.country}</div>
            ${stop.highlight ? `<div style="color: #FF9F43; font-size: 11px; margin-bottom: 8px;">${stop.highlight}</div>` : ""}
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="
                display: inline-block;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                background: ${color}20;
                color: ${color};
              ">${isBooked ? "Booked" : isPending ? "Pending" : "Book Now"}</span>
              <span style="color: #94a3b8; font-size: 11px;">${stop.nights} nights</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: false,
          className: "custom-popup",
        });

        marker.on("click", () => {
          setSelectedStop(stop);
        });

        markersRef.current.push({ marker, stop, createIcon });
      });
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update markers when selection changes
  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach(({ marker, stop, createIcon }) => {
      const isSelected = selectedStop?.id === stop.id;
      const isActive = stop.status === "ACTIVE";
      const isBooked = stop.bookingStatus === "booked";
      const isPending = stop.bookingStatus === "pending";
      const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

      marker.setIcon(createIcon(color, isActive, isSelected));

      if (isSelected) {
        map.setView([stop.latitude, stop.longitude], map.getZoom(), {
          animate: true,
        });
      }
    });
  }, [selectedStop, map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleRecenter = () => {
    if (!map) return;
    const activeStop = trip.stops.find((s) => s.status === "ACTIVE");
    if (activeStop) {
      map.setView([activeStop.latitude, activeStop.longitude], 8, {
        animate: true,
      });
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        isFullscreen && "fixed inset-0 z-50"
      )}
    >
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Current location badge */}
      <div className="absolute top-3 left-3 z-[1000]">
        <div className="bg-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              {trip.currentLocation}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Day {trip.currentDay} of your journey
          </p>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border hover:bg-card transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-foreground" />
          ) : (
            <Maximize2 className="w-4 h-4 text-foreground" />
          )}
        </button>
        <button
          onClick={handleRecenter}
          className="p-2.5 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border hover:bg-card transition-colors"
          aria-label="Center on current location"
        >
          <Navigation className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border hover:bg-card transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border hover:bg-card transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-border">
        <div className="flex flex-col gap-1.5 text-[10px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-muted-foreground">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">Unbooked</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 bg-foreground" />
              <span className="text-muted-foreground">Bus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-6 h-0.5 bg-foreground"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)",
                }}
              />
              <span className="text-muted-foreground">Jeep/Offroad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: var(--card);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border);
        }
        .custom-popup .leaflet-popup-tip {
          background: var(--card);
          border: 1px solid var(--border);
        }
        .leaflet-container {
          font-family: inherit;
          background: #f8f9fa;
        }
        .custom-marker,
        .mode-label {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
