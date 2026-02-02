"use client";

import { useEffect, useRef, useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";

export function TripMap() {
  const { trip, selectedStop, setSelectedStop, setSelectedLeg } = useTrip();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || map) return;

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      const L = await import("leaflet");

      // Calculate bounds
      const bounds = L.latLngBounds(
        trip.stops.map((stop) => [stop.latitude, stop.longitude])
      );

      // Initialize map
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).fitBounds(bounds, { padding: [50, 50] });

      // Add tile layer with a stylish dark theme
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(mapInstance);

      setMap(mapInstance);

      // Custom icon function
      const createIcon = (color: string, isSelected: boolean = false) => {
        const size = isSelected ? 20 : 14;
        return L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          "></div>`,
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
        const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

        const polyline = L.polyline(
          [
            [fromStop.latitude, fromStop.longitude],
            [toStop.latitude, toStop.longitude],
          ],
          {
            color: color,
            weight: isBooked ? 4 : 3,
            opacity: isBooked ? 0.9 : 0.6,
            dashArray: isBooked ? undefined : "8, 8",
          }
        ).addTo(mapInstance);

        polyline.on("click", () => {
          setSelectedLeg(leg);
        });

        polylinesRef.current.push(polyline);
      });

      // Add stop markers
      trip.stops.forEach((stop, index) => {
        const isBooked = stop.bookingStatus === "booked";
        const isPending = stop.bookingStatus === "pending";
        const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: createIcon(color),
        }).addTo(mapInstance);

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 150px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${stop.city}</div>
            <div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">${stop.country}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                background: ${isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869"}20;
                color: ${isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869"};
              ">${isBooked ? "Booked" : isPending ? "Pending" : "Book Now"}</span>
              <span style="color: #94a3b8; font-size: 11px;">${stop.duration} days</span>
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
      const isBooked = stop.bookingStatus === "booked";
      const isPending = stop.bookingStatus === "pending";
      const color = isBooked ? "#4ECDC4" : isPending ? "#FF9F43" : "#FC2869";

      marker.setIcon(createIcon(color, isSelected));

      if (isSelected) {
        map.setView([stop.latitude, stop.longitude], map.getZoom(), {
          animate: true,
        });
      }
    });
  }, [selectedStop, map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();

  return (
    <div
      className={cn(
        "relative h-full w-full rounded-xl overflow-hidden border border-border",
        isFullscreen && "fixed inset-0 z-50 rounded-none"
      )}
    >
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Map overlay - Title */}
      <div className="absolute top-3 left-3 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
        <h2 className="text-sm font-bold text-foreground">{trip.name}</h2>
        <p className="text-xs text-muted-foreground">
          {trip.stops.length} stops across{" "}
          {new Set(trip.stops.map((s) => s.country)).size} countries
        </p>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border hover:bg-card transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-foreground" />
          ) : (
            <Maximize2 className="w-4 h-4 text-foreground" />
          )}
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border hover:bg-card transition-colors"
        >
          <ZoomIn className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border hover:bg-card transition-colors"
        >
          <ZoomOut className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4]" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9F43]" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FC2869]" />
            <span className="text-muted-foreground">Not Booked</span>
          </div>
        </div>
      </div>

      {/* Custom styles for Leaflet popups */}
      <style jsx global>{`
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
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
