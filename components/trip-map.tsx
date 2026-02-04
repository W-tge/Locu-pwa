"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
  Star,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Check,
  Bus,
  Train,
  Ship,
  Car,
} from "lucide-react";
import { formatDateRange, getStopIndex } from "@/lib/trip-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TripMap() {
  const { trip, selectedStop, setSelectedStop, selectedLeg, setSelectedLeg, setSubPage, subPage } = useTrip();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clickedLegId, setClickedLegId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [showStopPopup, setShowStopPopup] = useState<string | null>(null);
  const [showTransitPopup, setShowTransitPopup] = useState<string | null>(null);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [insightCategory, setInsightCategory] = useState("");
  const [insightLocation, setInsightLocation] = useState("");
  const [insightText, setInsightText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const transitLabelsRef = useRef<Map<string, any>>(new Map());

  // Close popups when a subpage opens
  useEffect(() => {
    if (subPage) {
      setShowStopPopup(null);
      setShowTransitPopup(null);
      setShowInsightModal(false);
    }
  }, [subPage]);

  // Close popups when clicking on map background
  const handleMapBackgroundClick = useCallback(() => {
    setShowStopPopup(null);
    setShowTransitPopup(null);
    setClickedLegId(null);
    // Close subpages when clicking back on map
    if (subPage) {
      setSubPage(null);
    }
  }, [subPage, setSubPage]);

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

      // Determine if mobile for better initial zoom
      const isMobile = window.innerWidth < 768;
      
      const mapInstance = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).fitBounds(bounds, { 
        padding: isMobile ? [30, 30] : [50, 50],
        maxZoom: isMobile ? 5 : 6
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(mapInstance);

      mapInstance.on('click', handleMapBackgroundClick);

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
          ? `<div style="position: absolute; top: -6px; left: -6px; width: ${size + 12}px; height: ${size + 12}px; border: 3px solid ${color}; border-radius: 50%; animation: pulse 2s ease-out infinite; opacity: 0.7;"></div>`
          : "";

        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position: relative; cursor: pointer;">
              ${pulseRing}
              <div style="width: ${size}px; height: ${size}px; background: ${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 16px rgba(0,0,0,0.3), 0 0 20px ${color}40; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: ${size > 30 ? 14 : 12}px; color: white; font-family: system-ui, -apple-system, sans-serif;">${number}</div>
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
        const color = isBooked ? "#10B981" : isPending ? "#F59E0B" : "#FC2869";

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
            <div class="transit-label" data-leg-id="${leg.id}" style="background: ${color}; color: white; padding: 6px 12px; border-radius: 16px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.25); text-transform: uppercase; letter-spacing: 0.5px; opacity: 0; transform: scale(0.8); transition: all 0.2s ease; pointer-events: none;">
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
        const color = isBooked ? "#10B981" : isPending ? "#F59E0B" : "#FC2869";

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
      const color = isBooked ? "#10B981" : isPending ? "#F59E0B" : "#FC2869";

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

  const handleShareInsight = () => {
    if (insightCategory && insightLocation && insightText) {
      setSubmitted(true);
      setTimeout(() => {
        setShowInsightModal(false);
        setSubmitted(false);
        setInsightCategory("");
        setInsightLocation("");
        setInsightText("");
      }, 2000);
    }
  };

  // Get popup data
  const popupStop = showStopPopup ? trip.stops.find(s => s.id === showStopPopup) : null;
  const popupLeg = showTransitPopup ? trip.transitLegs.find(l => l.id === showTransitPopup) : null;
  const popupLegFrom = popupLeg ? trip.stops.find(s => s.id === popupLeg.fromStopId) : null;
  const popupLegTo = popupLeg ? trip.stops.find(s => s.id === popupLeg.toStopId) : null;

  const getModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "bus": return Bus;
      case "train": return Train;
      case "ferry": case "boat": return Ship;
      default: return Car;
    }
  };

  // Determine if popups should be hidden (when subpage is open)
  const shouldHideOverlays = !!subPage;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", isFullscreen && "fixed inset-0 z-50")}>
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Minimal location badge - hide when subpage open */}
      <div className={cn(
        "absolute top-4 left-4 z-[1000] transition-opacity duration-200",
        shouldHideOverlays && "opacity-0 pointer-events-none"
      )}>
        <div className="bg-card/95 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-foreground">{trip.currentLocation}</span>
          </div>
        </div>
      </div>

      {/* Map controls - hide when subpage open */}
      <div className={cn(
        "absolute top-4 right-4 z-[1000] flex flex-col gap-2 transition-opacity duration-200",
        shouldHideOverlays && "opacity-0 pointer-events-none"
      )}>
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

      {/* Legend - hides on zoom and when subpage open */}
      <div className={cn(
        "absolute bottom-4 left-4 z-[999] bg-card/90 backdrop-blur-md rounded-xl px-2.5 py-2 shadow-lg border border-border/50 transition-all duration-300",
        (zoomLevel > 7 || shouldHideOverlays) && "opacity-0 pointer-events-none translate-y-2"
      )}>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Book</span>
          </div>
        </div>
      </div>

      {/* Share insight button - hide when subpage open */}
      <button
        onClick={() => setShowInsightModal(true)}
        className={cn(
          "absolute bottom-4 right-4 z-[999] bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105",
          shouldHideOverlays && "opacity-0 pointer-events-none"
        )}
      >
        <Lightbulb className="w-4 h-4" />
        <span className="text-xs font-semibold">Share Insight</span>
      </button>

      {/* Enhanced Destination Popup Modal */}
      {popupStop && !shouldHideOverlays && (
        <div 
          className="absolute inset-0 z-[1001]" 
          onClick={() => setShowStopPopup(null)}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-2xl border border-border w-[320px] max-h-[80vh] overflow-y-auto overflow-x-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowStopPopup(null)} className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-muted transition-colors z-10">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          
            {/* Header with image if booked */}
            {popupStop.bookingStatus === "booked" && popupStop.hostelImage && (
              <div className="relative h-32 w-full">
                <Image
                  src={popupStop.hostelImage || "/hostels/earth-lodge.jpg"}
                  alt={popupStop.hostelName || "Hostel"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
            )}
          
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{popupStop.city}</h3>
                  <p className="text-sm text-muted-foreground">{popupStop.country}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold",
                  popupStop.bookingStatus === "booked" ? "bg-[#10B981]/10 text-[#10B981]" :
                  popupStop.bookingStatus === "pending" ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-primary/10 text-primary"
                )}>
                  {popupStop.bookingStatus === "booked" ? "Booked" :
                   popupStop.bookingStatus === "pending" ? "Pending" : "Book Now"}
                </span>
              </div>
            
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{getStopIndex(trip, popupStop.id)}</span>
                  </div>
                  <span>Stop #{getStopIndex(trip, popupStop.id)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{popupStop.nights} nights</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDateRange(popupStop.startDate, popupStop.endDate)}</span>
                </div>
                {popupStop.weather && (
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Cloud className="w-4 h-4" />
                    <span>{popupStop.weather}</span>
                  </div>
                )}
              </div>

              {/* Booked hostel preview */}
              {popupStop.bookingStatus === "booked" && popupStop.hostelName && (
                <div className="mt-4 p-3 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm font-semibold text-[#10B981]">Accommodation Booked</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{popupStop.hostelName}</p>
                  {popupStop.hostelPrice && (
                    <p className="text-xs text-muted-foreground">${popupStop.hostelPrice}/night</p>
                  )}
                </div>
              )}

              <Button
                onClick={() => {
                  setShowStopPopup(null);
                  setSubPage("hostelDetails");
                }}
                className={cn(
                  "w-full mt-4 font-semibold",
                  popupStop.bookingStatus === "booked" 
                    ? "bg-[#10B981] hover:bg-[#10B981]/90"
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {popupStop.bookingStatus === "booked" ? "View Booking" : "Browse Hostels"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Transit Popup Modal with smart tags */}
      {popupLeg && popupLegFrom && popupLegTo && !shouldHideOverlays && (
        <div 
          className="absolute inset-0 z-[1001]" 
          onClick={() => setShowTransitPopup(null)}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-2xl border border-border w-[340px] max-h-[80vh] overflow-y-auto overflow-x-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowTransitPopup(null)} className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 hover:bg-muted transition-colors z-10">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          
          {/* Header */}
          <div className="p-5 pb-0">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                popupLeg.bookingStatus === "booked" ? "bg-[#10B981]/10" : "bg-primary/10"
              )}>
                {(() => {
                  const Icon = getModeIcon(popupLeg.mode || popupLeg.type);
                  return <Icon className={cn("w-5 h-5", popupLeg.bookingStatus === "booked" ? "text-[#10B981]" : "text-primary")} />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{popupLegFrom.city} → {popupLegTo.city}</h3>
                <p className="text-sm text-muted-foreground capitalize">{popupLeg.mode || popupLeg.type}</p>
              </div>
            </div>

            {/* Smart recommendation tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {popupLeg.price && popupLeg.price <= 25 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-semibold">
                  <DollarSign className="w-3 h-3" />
                  Cheapest
                </span>
              )}
              {popupLeg.duration && parseInt(popupLeg.duration) <= 4 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-semibold">
                  <Zap className="w-3 h-3" />
                  Fastest
                </span>
              )}
              {popupLeg.verifiedCount && popupLeg.verifiedCount > 10 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  Top Rated
                </span>
              )}
            </div>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {popupLeg.departureDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(popupLeg.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              )}
              {popupLeg.departureTime && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{popupLeg.departureTime}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">Duration</span>
              </div>
              <div className="font-semibold text-foreground">{popupLeg.duration}</div>
              {popupLeg.price && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">Price</span>
                  </div>
                  <div className="font-bold text-primary">${popupLeg.price}</div>
                </>
              )}
              {popupLeg.operator && (
                <>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">Operator</span>
                  </div>
                  <div className="font-medium text-foreground">{popupLeg.operator}</div>
                </>
              )}
            </div>

            {/* Booking status */}
            <div className="mt-4 flex items-center gap-2">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                popupLeg.bookingStatus === "booked" ? "bg-[#10B981]" :
                popupLeg.bookingStatus === "pending" ? "bg-[#F59E0B]" : "bg-primary"
              )} />
              <span className="text-sm font-medium">
                {popupLeg.bookingStatus === "booked" ? "Transport Booked" :
                 popupLeg.bookingStatus === "pending" ? "Pending Confirmation" : "Needs Booking"}
              </span>
            </div>

            {/* Verified info */}
            {popupLeg.verifiedCount && (
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                Verified by {popupLeg.verifiedCount} travellers
              </p>
            )}

            <Button
              onClick={() => {
                setShowTransitPopup(null);
                setSubPage("transportBooking");
              }}
              className={cn(
                "w-full mt-4 font-semibold",
                popupLeg.bookingStatus === "booked" 
                  ? "bg-[#10B981] hover:bg-[#10B981]/90"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {popupLeg.bookingStatus === "booked" ? "View Booking" : "View All Options"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          </div>
        </div>
      )}

      {/* Share Insight Modal */}
      {showInsightModal && (
        <div className="absolute inset-0 z-[1002] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowInsightModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-[360px] overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Thanks for sharing!</h3>
                <p className="text-sm text-muted-foreground mt-2">You earned +50 Karma Points</p>
              </div>
            ) : (
              <>
                <div className="p-5 pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Share Travel Insight</h3>
                      <p className="text-xs text-muted-foreground">Help fellow travellers with tips and warnings</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                    <Select value={insightCategory} onValueChange={setInsightCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insight type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tip">Travel Tip</SelectItem>
                        <SelectItem value="warning">Safety Warning</SelectItem>
                        <SelectItem value="recommendation">Recommendation</SelectItem>
                        <SelectItem value="transport">Transport Info</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
                    <Select value={insightLocation} onValueChange={setInsightLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {trip.stops.map(stop => (
                          <SelectItem key={stop.id} value={stop.id}>{stop.city}, {stop.country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Insight</label>
                    <Textarea
                      value={insightText}
                      onChange={e => setInsightText(e.target.value)}
                      placeholder="Share your insight, tip, or experience..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleShareInsight} className="flex-1 font-semibold">
                      Share Insight (+50 pts)
                    </Button>
                    <Button variant="outline" onClick={() => setShowInsightModal(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
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
