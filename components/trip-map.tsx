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
  X,
  Calendar,
  Cloud,
  Bed,
  ChevronRight,
} from "lucide-react";
import { formatDateRange, getStopIndex } from "@/lib/trip-data";
import { Button } from "@/components/ui/button";

export function TripMap() {
  const { trip, selectedStop, setSelectedStop, selectedLeg, setSelectedLeg, setSubPage } = useTrip();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clickedLegId, setClickedLegId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [showStopPopup, setShowStopPopup] = useState<string | null>(null);
  const [showTransitPopup, setShowTransitPopup] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const transitLabelsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || map) return;

    const loadLeaflet = async () => {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      const bounds = L.latLngBounds(
        trip.stops.map((stop) => [stop.latitude, stop.longitude])
      );

      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).fitBounds(bounds, { padding: [50, 50] });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(mapInstance);

      mapInstance.on('click', () => {
        setClickedLegId(null);
        setShowStopPopup(null);
        setShowTransitPopup(null);
      });

      mapInstance.on('zoomend', () => {
        setZoomLevel(mapInstance.getZoom());
      });
      setZoomLevel(mapInstance.getZoom());

      setMap(mapInstance);

      // Numbered marker icon
      const createIcon = (
        color: string,
        number: number,
        isActive: boolean = false,
        isSelected: boolean = false
      ) => {
        const size = isSelected ? 36 : isActive ? 32 : 26;
        const pulseRing = isActive
          ? `<div style="
            position: absolute;
            top: -6px;
            left: -6px;
            width: ${size + 12}px;
            height: ${size + 12}px;
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
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: ${size > 30 ? 14 : 12}px;
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
              ">
                ${number}
              </div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      };

      // Route polylines
      trip.transitLegs.forEach((leg) => {
        const fromStop = trip.stops.find((s) => s.id === leg.fromStopId);
        const toStop = trip.stops.find((s) => s.id === leg.toStopId);
        if (!fromStop || !toStop) return;

        const isBooked = leg.bookingStatus === "booked";
        const isPending = leg.bookingStatus === "pending";
        const color = isBooked ? "#7C3AED" : isPending ? "#FF6B9D" : "#FC2869";

        const latlngs = [
          [fromStop.latitude, fromStop.longitude],
          [toStop.latitude, toStop.longitude],
        ];

        const polyline = L.polyline(latlngs as [number, number][], {
          color: color,
          weight: isBooked ? 4 : 3,
          opacity: isBooked ? 1 : 0.8,
          dashArray: isBooked ? undefined : "8, 8",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(mapInstance);

        polyline.on("mouseover", function() {
          this.setStyle({ weight: 6, opacity: 1 });
        });
        
        polyline.on("mouseout", function() {
          this.setStyle({ weight: isBooked ? 4 : 3, opacity: isBooked ? 1 : 0.8 });
        });

        polyline.on("click", (e: any) => {
          e.originalEvent.stopPropagation();
          setClickedLegId(leg.id);
          setShowTransitPopup(leg.id);
          setShowStopPopup(null);
          setSelectedLeg(leg);
        });

        polylinesRef.current.push({ polyline, leg });

        // Transit label
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
              box-shadow: 0 4px 16px rgba(0,0,0,0.25);
              text-transform: uppercase;
              letter-spacing: 0.5px;
              opacity: 0;
              transform: scale(0.8);
              transition: all 0.2s ease;
              pointer-events: none;
            ">
              ${leg.mode || leg.type} - ${leg.duration}
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });

        const labelMarker = L.marker([midLat, midLng], { icon: modeIcon, interactive: false }).addTo(mapInstance);
        transitLabelsRef.current.set(leg.id, labelMarker);
      });

      // Stop markers with numbers
      trip.stops.forEach((stop, index) => {
        const isActive = stop.status === "ACTIVE";
        const isBooked = stop.bookingStatus === "booked";
        const isPending = stop.bookingStatus === "pending";
        const color = isBooked ? "#7C3AED" : isPending ? "#FF6B9D" : "#FC2869";

        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: createIcon(color, index + 1, isActive),
          zIndexOffset: isActive ? 1000 : index,
        }).addTo(mapInstance);

        marker.on("click", (e: any) => {
          e.originalEvent?.stopPropagation?.();
          setShowStopPopup(stop.id);
          setShowTransitPopup(null);
          setSelectedStop(stop);
        });

        markersRef.current.push({ marker, stop, createIcon, index: index + 1 });
      });
    };

    loadLeaflet();

    return () => {
      if (map) map.remove();
    };
  }, []);

  // Show/hide transit labels
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
    if (selectedLeg) setClickedLegId(selectedLeg.id);
  }, [selectedLeg]);

  useEffect(() => {
    if (!map) return;
    markersRef.current.forEach(({ marker, stop, createIcon, index }) => {
      const isSelected = selectedStop?.id === stop.id;
      const isActive = stop.status === "ACTIVE";
      const isBooked = stop.bookingStatus === "booked";
      const isPending = stop.bookingStatus === "pending";
      const color = isBooked ? "#7C3AED" : isPending ? "#FF6B9D" : "#FC2869";

      marker.setIcon(createIcon(color, index, isActive, isSelected));

      if (isSelected) {
        map.setView([stop.latitude, stop.longitude], map.getZoom(), { animate: true });
      }
    });
  }, [selectedStop, map]);

  const handleZoomIn = () => map?.zoomIn();
  const handleZoomOut = () => map?.zoomOut();
  const handleRecenter = () => {
    if (!map) return;
    const activeStop = trip.stops.find((s) => s.status === "ACTIVE");
    if (activeStop) {
      map.setView([activeStop.latitude, activeStop.longitude], 7, { animate: true });
    }
  };

  // Get popup data
  const popupStop = showStopPopup ? trip.stops.find(s => s.id === showStopPopup) : null;
  const popupLeg = showTransitPopup ? trip.transitLegs.find(l => l.id === showTransitPopup) : null;
  const popupLegFrom = popupLeg ? trip.stops.find(s => s.id === popupLeg.fromStopId) : null;
  const popupLegTo = popupLeg ? trip.stops.find(s => s.id === popupLeg.toStopId) : null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", isFullscreen && "fixed inset-0 z-50")}>
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Minimal location badge */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-card/95 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-foreground">{trip.currentLocation}</span>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-3 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 hover:bg-card transition-all">
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <button onClick={handleRecenter} className="p-3 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 hover:bg-card transition-all">
          <Navigation className="w-5 h-5 text-primary" />
        </button>
        <button onClick={handleZoomIn} className="p-3 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 hover:bg-card transition-all">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-3 bg-card/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 hover:bg-card transition-all">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Legend - hides on zoom */}
      <div className={cn(
        "absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-md rounded-xl px-2.5 py-2 shadow-lg border border-border/50 transition-all duration-300",
        zoomLevel > 7 && "opacity-0 pointer-events-none translate-y-2"
      )}>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B9D]" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Book</span>
          </div>
        </div>
      </div>

      {/* Share insight button */}
      <button
        onClick={() => setSubPage("intelHub")}
        className="absolute bottom-4 right-4 z-[1000] bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
      >
        <Lightbulb className="w-4 h-4" />
        <span className="text-xs font-semibold">Share Insight</span>
      </button>

      {/* Destination Popup Modal */}
      {popupStop && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-card rounded-2xl shadow-2xl border border-border w-[280px] overflow-hidden animate-in zoom-in-95 duration-200">
          <button onClick={() => setShowStopPopup(null)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors z-10">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="p-5">
            <h3 className="text-xl font-bold text-foreground">{popupStop.city}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{popupStop.country}</p>
            
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-primary font-bold">Stop #{getStopIndex(trip, popupStop.id)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(popupStop.startDate, popupStop.endDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>{popupStop.nights} nights</span>
              </div>
              {popupStop.weather && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Cloud className="w-4 h-4" />
                  <span>{popupStop.weather}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                popupStop.bookingStatus === "booked" ? "bg-[#7C3AED]" :
                popupStop.bookingStatus === "pending" ? "bg-[#FF6B9D]" : "bg-primary"
              )} />
              <span className="text-sm font-medium">
                {popupStop.bookingStatus === "booked" ? "Hostel Booked" :
                 popupStop.bookingStatus === "pending" ? "Pending Confirmation" : "Needs Booking"}
              </span>
            </div>

            <Button
              onClick={() => {
                setShowStopPopup(null);
                setSelectedStop(popupStop);
              }}
              className={cn(
                "w-full mt-4 font-semibold",
                popupStop.bookingStatus === "booked" 
                  ? "bg-[#7C3AED] hover:bg-[#7C3AED]/90"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {popupStop.bookingStatus === "booked" ? "View Booking" : "Book Accommodation"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Transit Popup Modal */}
      {popupLeg && popupLegFrom && popupLegTo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-card rounded-2xl shadow-2xl border border-border w-[300px] overflow-hidden animate-in zoom-in-95 duration-200">
          <button onClick={() => setShowTransitPopup(null)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors z-10">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="p-5">
            <h3 className="text-lg font-bold text-foreground">{popupLegFrom.city} → {popupLegTo.city}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{popupLeg.mode || popupLeg.type}</p>
            
            <div className="mt-4 space-y-2.5 text-sm">
              {popupLeg.departureDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(popupLeg.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  {popupLeg.departureTime && <span>at {popupLeg.departureTime}</span>}
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{popupLeg.duration}</span>
              </div>
              {popupLeg.price && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-bold text-primary">${popupLeg.price}</span>
                </div>
              )}
              {popupLeg.operator && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operator</span>
                  <span className="font-medium">{popupLeg.operator}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                popupLeg.bookingStatus === "booked" ? "bg-[#7C3AED]" :
                popupLeg.bookingStatus === "pending" ? "bg-[#FF6B9D]" : "bg-primary"
              )} />
              <span className="text-sm font-medium">
                {popupLeg.bookingStatus === "booked" ? "Transport Booked" :
                 popupLeg.bookingStatus === "pending" ? "Pending" : "Needs Booking"}
              </span>
            </div>

            <Button
              onClick={() => {
                setShowTransitPopup(null);
                setSelectedLeg(popupLeg);
              }}
              className={cn(
                "w-full mt-4 font-semibold",
                popupLeg.bookingStatus === "booked" 
                  ? "bg-[#7C3AED] hover:bg-[#7C3AED]/90"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {popupLeg.bookingStatus === "booked" ? "View Details" : "Book Transport"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }
        .leaflet-container { font-family: inherit; background: #e8eef5; }
        .custom-marker, .mode-label { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
}
