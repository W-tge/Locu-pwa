"use client";

import React from "react"

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { cn } from "@/lib/utils";
import { 
  Bus, 
  Train,
  Truck,
  Anchor,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  ArrowRight,
  Calendar,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef, useCallback } from "react";

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry": return Anchor;
    case "train": return Train;
    case "jeep": return Truck;
    case "flight": return Plane;
    default: return Bus;
  }
}

function getOptionIcon(type: string) {
  if (type.toLowerCase().includes("flight") || type.toLowerCase().includes("air")) return Plane;
  if (type.toLowerCase().includes("boat") || type.toLowerCase().includes("ferry")) return Anchor;
  if (type.toLowerCase().includes("train")) return Train;
  return Bus;
}

interface TransportOption {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: string;
  amenities: string[];
  seatsLeft?: number;
  verifiedCount?: number;
}

const defaultTransportOptions: TransportOption[] = [
  { id: "1", operator: "Pullman", departureTime: "07:00", arrivalTime: "13:00", duration: "6h", price: 25, type: "Semi-cama", amenities: ["AC", "WiFi", "Toilet"], seatsLeft: 12, verifiedCount: 45 },
  { id: "2", operator: "Cruz del Sur", departureTime: "22:00", arrivalTime: "04:00", duration: "6h", price: 32, type: "Cama", amenities: ["AC", "WiFi", "Toilet", "Blanket"], seatsLeft: 4, verifiedCount: 78 },
  { id: "3", operator: "Local Bus", departureTime: "Any", arrivalTime: "-", duration: "7h", price: 12, type: "Regular", amenities: ["Basic"], verifiedCount: 23 },
];

export function TransitDetailSheet() {
  const { trip, selectedLeg, setSelectedLeg, updateLegBooking, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const startY = useRef(0);

  const handleDismiss = useCallback(() => {
    setSelectedLeg(null);
  }, [setSelectedLeg]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - startY.current > 60) handleDismiss();
  }, [handleDismiss]);

  if (!selectedLeg) return null;

  const fromStop = trip.stops.find(s => s.id === selectedLeg.fromStopId);
  const toStop = trip.stops.find(s => s.id === selectedLeg.toStopId);
  if (!fromStop || !toStop) return null;

  const TransportIcon = getTransportIcon(selectedLeg.type);
  const isBooked = selectedLeg.bookingStatus === "booked";
  const isPending = selectedLeg.bookingStatus === "pending";
  const transportOptions = selectedLeg.transportOptions || defaultTransportOptions;

  // Determine smart tags
  const cheapestPrice = Math.min(...transportOptions.map(o => o.price));
  const fastestDuration = transportOptions.reduce((min, o) => {
    const hrs = Number.parseInt(o.duration) || 99;
    return hrs < min ? hrs : min;
  }, 99);
  const mostVerified = Math.max(...transportOptions.map(o => o.verifiedCount || 0));

  const handleBookTransport = (option: TransportOption) => {
    updateLegBooking(selectedLeg.id, "booked");
    showToast(`${option.operator} booked! ${fromStop.city} to ${toStop.city}`, "success");
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/20" onClick={handleDismiss} />
      
      {/* Sheet - bottom-16 leaves room for nav */}
      <div className="fixed inset-x-0 bottom-16 lg:bottom-0 z-[61] animate-in slide-in-from-bottom duration-300">
        <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
          {/* Minimize Bar */}
          <button
            className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onClick={handleDismiss}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label="Minimize"
          >
            <div className="w-10 h-1.5 rounded-full bg-muted-foreground/40 hover:bg-muted-foreground/60 transition-colors" />
          </button>
          
          {/* Header */}
          <div className="px-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isBooked ? "bg-[#10B981]/20 text-[#10B981]" : 
                isPending ? "bg-[#F59E0B]/20 text-[#F59E0B]" : 
                "bg-primary/20 text-primary"
              )}>
                <TransportIcon className="w-4 h-4" />
              </div>
              <span className="text-sm text-muted-foreground capitalize">{selectedLeg.mode || selectedLeg.type}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold ml-auto",
                  isBooked && "bg-[#10B981]/10 border-[#10B981] text-[#10B981]",
                  isPending && "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]",
                  !isBooked && !isPending && "bg-primary/10 border-primary text-primary"
                )}
              >
                {isBooked ? "Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 ml-10">
              <span className="text-lg font-bold text-foreground">{fromStop.city}</span>
              <ArrowRight className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-foreground">{toStop.city}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              {selectedLeg.departureDate && (
                <div className="rounded-xl bg-muted/50 p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                    <Calendar className="w-3 h-3" /> Date
                  </div>
                  <p className="font-semibold text-foreground mt-0.5 text-xs">
                    {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              )}
              <div className="rounded-xl bg-muted/50 p-2.5">
                <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                  <Clock className="w-3 h-3" /> Duration
                </div>
                <p className="font-semibold text-foreground mt-0.5 text-xs">{selectedLeg.duration}</p>
              </div>
              {selectedLeg.price && (
                <div className="rounded-xl bg-muted/50 p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                    <DollarSign className="w-3 h-3" /> From
                  </div>
                  <p className="font-bold text-primary mt-0.5 text-xs">${cheapestPrice}</p>
                </div>
              )}
            </div>

            {/* Alert */}
            {selectedLeg.alert && (
              <div className="rounded-xl border border-[#FF6B9D]/40 bg-[#FF6B9D]/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF6B9D] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{selectedLeg.alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedLeg.alert.body}</p>
                    {selectedLeg.alert.action && (
                      <Button size="sm" className="mt-2 bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white h-7 text-xs" onClick={() => showToast(`Opening ${selectedLeg.alert!.action}...`, "info")}>
                        {selectedLeg.alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Community Tip */}
            {selectedLeg.communityTip && (
              <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/5 p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">{selectedLeg.communityTip}</p>
                    {selectedLeg.verifiedCount && (
                      <p className="text-[10px] text-[#FBBF24] mt-1 font-medium">Verified by {selectedLeg.verifiedCount} travellers</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Booked Info */}
            {isBooked && selectedLeg.operator && (
              <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="font-semibold text-[#10B981] text-sm">Transport Booked</span>
                </div>
                <p className="font-semibold text-foreground">{selectedLeg.operator}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {selectedLeg.departureTime && <span>Departs: {selectedLeg.departureTime}</span>}
                  <span>{selectedLeg.duration}</span>
                </div>
                <p className="text-lg font-bold text-[#10B981] mt-1">${selectedLeg.price}</p>
              </div>
            )}
            
            {/* Transport Options - reference image style */}
            {!isBooked && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Available Options:</p>
                {transportOptions.map((option) => {
                  const isCheapest = option.price === cheapestPrice;
                  const isFastest = (Number.parseInt(option.duration) || 99) === fastestDuration;
                  const isTopRated = (option.verifiedCount || 0) === mostVerified && mostVerified > 0;
                  const OptionIcon = getOptionIcon(option.type);
                  
                  return (
                    <div 
                      key={option.id}
                      className="rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedLeg(null);
                        setSubPage("transportBooking");
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <OptionIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground">{option.operator}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {option.duration}
                            </p>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-primary">${option.price}</p>
                      </div>
                      
                      {/* Insight badge - like reference image */}
                      {(option.verifiedCount || 0) > 20 && (
                        <div className="mt-2 ml-7">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FBBF24]/10 text-xs text-[#92711a]">
                            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-[#FBBF24]"><path d="M8 1.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V2a.5.5 0 01.5-.5zM8 11a3 3 0 100-6 3 3 0 000 6zm0 1a4 4 0 110-8 4 4 0 010 8z"/></svg>
                            Insight provided by {option.verifiedCount} travellers
                          </span>
                        </div>
                      )}
                      
                      {/* Smart tags row */}
                      <div className="flex flex-wrap gap-1.5 mt-2 ml-7">
                        {isCheapest && (
                          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-semibold">Cheapest</span>
                        )}
                        {isFastest && (
                          <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-semibold">Fastest</span>
                        )}
                        {isTopRated && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FBBF24]/10 text-[#92711a] text-[10px] font-semibold">Top Rated</span>
                        )}
                        {option.seatsLeft && option.seatsLeft < 10 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF6B9D]/10 text-[#FF6B9D] text-[10px] font-semibold">{option.seatsLeft} seats left</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border bg-card">
            {!isBooked ? (
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" 
                onClick={() => {
                  setSelectedLeg(null);
                  setSubPage("transportBooking");
                }}
              >
                <TransportIcon className="w-4 h-4 mr-2" />
                View All & Book
              </Button>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" onClick={handleDismiss}>
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
