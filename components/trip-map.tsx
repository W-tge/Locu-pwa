"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Navigation,
  Lightbulb,
  MapPin,
} from "lucide-react";

export function TripMap() {
  const { trip, selectedStop, setSelectedStop, selectedLeg, setSelectedLeg, setMenuPage } = useTrip();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clickedLegId, setClickedLegId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(6);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const transitLabelsRef = useRef<Map<string, any>>(new Map());

  // Calculate if legend should be hidden (zoom > 8)
  const showLegend = zoomLevel <= 8;

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

      // Calculate bounds for route
      const bounds = L.latLngBounds(
        trip.stops.map((stop) => [stop.latitude, stop.longitude])
      );

      // Initialize map
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).fitBounds(bounds, { padding: [50, 50] });

      // Use a dark, clean tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(mapInstance);

      // Listen for map clicks to dismiss transit labels
      mapInstance.on('click', () => {
        setClickedLegId(null);
      });

      // Track zoom level
      mapInstance.on('zoomend', () => {
        setZoomLevel(mapInstance.getZoom());
      });

      setMap(mapInstance);
      setZoomLevel(mapInstance.getZoom());

      // Custom marker icon
      const createIcon = (
        color: string,
        isActive: boolean = false,
        isSelected: boolean = false
      ) => {
        const size = isSelected ? 32 : isActive ? 28 : 20;
        const pulseRing = isActive
          ? `<div style="
            position: absolute;
            top: -8px;
            left: -8px;
            width: ${size + 16}px;
            height: ${size + 16}px;
            border: 3px solid ${color};
            border-radius: 50%;
            animation: pulse 2s ease-out infinite;
            opacity: 0.7;
          "></div>`
          : "";

        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position: relative; cursor: pointer;">
              ${pulseRing}
              <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 0 20px ${color}40;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${isActive ? '<div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>' : ""}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Add route polylines
      trip.transitLegs.forEach((leg) => {
        const fromStop = trip.stops.find((s) => s.id === leg.fromStopId);
        const toStop = trip.stops.find((s) => s.id === leg.toStopId);
        if (!fromStop || !toStop) return;

        const isBooked = leg.bookingStatus === "booked";
        const isPending = leg.bookingStatus === "pending";
        const color = isBooked ? "#00D4AA" : isPending ? "#FF6B9D" : "#FC2869";

        const latlngs = [
          [fromStop.latitude, fromStop.longitude],
          [toStop.latitude, toStop.longitude],
        ];

        const polyline = L.polyline(latlngs as [number, number][], {
          color: color,
          weight: isBooked ? 5 : 4,
          opacity: isBooked ? 1 : 0.8,
          dashArray: isBooked ? undefined : "8, 8",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapInstance);

        polyline.on("mouseover", function() {
          this.setStyle({ weight: 7, opacity: 1 });
        });
        
        polyline.on("mouseout", function() {
          this.setStyle({ weight: isBooked ? 5 : 4, opacity: isBooked ? 1 : 0.8 });
        });

        polyline.on("click", (e: any) => {
          e.originalEvent.stopPropagation();
          setClickedLegId(leg.id);
          setSelectedLeg(leg);
        });

        polylinesRef.current.push({ polyline, leg });

        // Add transport label (hidden by default)
        const midLat = (fromStop.latitude + toStop.latitude) / 2;
        const midLng = (fromStop.longitude + toStop.longitude) / 2;

        const modeIcon = L.divIcon({
          className: "mode-label",
          html: `
            <div class="transit-label" data-leg-id="${leg.id}" style="
              background: ${color};
              color: white;
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 16px rgba(0,0,0,0.25), 0 0 20px ${color}50;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              opacity: 0;
              transform: scale(0.8);
              transition: all 0.2s ease;
              pointer-events: none;
            ">
              ${leg.type === "ferry" ? "FERRY" : leg.type === "jeep" ? "JEEP" : "BUS"} - ${leg.duration}
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });

        const labelMarker = L.marker([midLat, midLng], { icon: modeIcon, interactive: false }).addTo(mapInstance);
        transitLabelsRef.current.set(leg.id, labelMarker);
      });

      // Add stop markers
      trip.stops.forEach((stop, index) => {
        const isActive = stop.status === "ACTIVE";
        const isBooked = stop.bookingStatus === "booked";
        const isPending = stop.bookingStatus === "pending";
        const color = isBooked ? "#00D4AA" : isPending ? "#FF6B9D" : "#FC2869";

        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: createIcon(color, isActive),
          zIndexOffset: isActive ? 1000 : index,
        }).addTo(mapInstance);

        const popupContent = `
          <div style="padding: 12px; min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-weight: 800; font-size: 16px; color: #0f172a;">${stop.city}</span>
              ${isActive ? '<span style="background: linear-gradient(135deg, #FC2869, #FF6B9D); color: white; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">NOW</span>' : ""}
            </div>
            <div style="color: #64748b; font-size: 13px; margin-bottom: 10px;">${stop.country}</div>
            ${stop.highlight ? `<div style="color: #7C3AED; font-size: 12px; margin-bottom: 10px; font-weight: 500;">${stop.highlight}</div>` : ""}
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="
                display: inline-block;
                padding: 5px 14px;
                border-radius: 14px;
                font-size: 12px;
                font-weight: 600;
                background: ${color}20;
                color: ${color};
              ">${isBooked ? "Booked" : isPending ? "Pending" : "Book Now"}</span>
              <span style="color: #94a3b8; font-size: 12px; font-weight: 500;">${stop.nights} nights</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: false,
          className: "custom-popup",
        });

        marker.on("click", () => {
          setSelectedStop(stop);
          setClickedLegId(null);
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

  // Show/hide transit labels based on clicked leg
  useEffect(() => {
    transitLabelsRef.current.forEach((labelMarker, legId) => {
      const el = labelMarker.getElement();
      if (el) {
        const labelDiv = el.querySelector('.transit-label');
        if (labelDiv) {
          if (clickedLegId === legId) {
            labelDiv.style.opacity = '1';
            labelDiv.style.transform = 'scale(1)';
          } else {
            labelDiv.style.opacity = '0';
            labelDiv.style.transform = 'scale(0.8)';
          }
        }
      }
    });
  }, [clickedLegId]);

  useEffect(() => {
    if (selectedLeg) {
      setClickedLegId(selectedLeg.id);
    }
  }, [selectedLeg]);

  // Update markers when selection changes
  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach(({ marker, stop, createIcon }) => {
      const isSelected = selectedStop?.id === stop.id;
      const isActive = stop.status === "ACTIVE";
      const isBooked = stop.bookingStatus === "booked";
      const isPending = stop.bookingStatus === "pending";
      const color = isBooked ? "#00D4AA" : isPending ? "#FF6B9D" : "#FC2869";

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

      {/* Simplified current location badge - just city name */}
      <div className="absolute top-3 left-3 z-[1000]">
        <div className="bg-card/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg border border-border/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
          <span className="text-xs font-semibold text-foreground">
            {trip.currentLocation}
          </span>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50 hover:bg-card hover:scale-105 transition-all"
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
          className="p-2.5 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50 hover:bg-card hover:scale-105 transition-all"
          aria-label="Center on current location"
        >
          <Navigation className="w-4 h-4 text-primary" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50 hover:bg-card hover:scale-105 transition-all"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-card/90 backdrop-blur-md rounded-xl shadow-lg border border-border/50 hover:bg-card hover:scale-105 transition-all"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Intel Hub / Contribute button */}
      <button
        onClick={() => setMenuPage("intel-hub")}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-gradient-to-r from-primary to-[#FF6B9D] text-white px-3 py-1.5 rounded-full shadow-lg shadow-primary/30 flex items-center gap-1.5 hover:scale-105 transition-transform"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">Share Intel</span>
      </button>

      {/* Legend - smaller and auto-hides when zooming in */}
      <div 
        className={cn(
          "absolute bottom-3 left-3 z-[1000] bg-card/90 backdrop-blur-md rounded-xl px-2.5 py-2 shadow-lg border border-border/50 transition-all duration-300",
          !showLegend && "opacity-0 pointer-events-none translate-y-2"
        )}
      >
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6B9D]" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Unbooked</span>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: var(--card);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
        }
        .custom-popup .leaflet-popup-tip {
          background: var(--card);
          border: 1px solid var(--border);
        }
        .leaflet-container {
          font-family: inherit;
          background: #e8eef5;
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
