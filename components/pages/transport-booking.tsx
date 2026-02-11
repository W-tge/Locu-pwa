"use client";

import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bus,
  Train,
  Ship,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Calendar,
  DollarSign,
  Shield,
  Star,
  Sparkles,
  Bike,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransportOption {
  id: string;
  operator: string;
  type: string;
  mode: "bus" | "train" | "ferry";
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  routeCode: string;
  platform: string;
  seat: string;
  amenities: string[];
  seatsLeft: number;
  tags: { label: string; icon: any; color: string }[];
  verifiedCount: number;
  isRecommended?: boolean;
  recommendReason?: string;
}

const mockTransportOptions: TransportOption[] = [
  {
    id: "1",
    operator: "Pullman",
    type: "Semi-cama",
    mode: "bus",
    departure: "07:00",
    arrival: "10:00",
    duration: "3h",
    price: 8,
    routeCode: "PLM-118",
    platform: "B4",
    seat: "22A",
    amenities: ["AC", "WiFi", "Toilet"],
    seatsLeft: 12,
    tags: [
      { label: "Cheapest", icon: DollarSign, color: "text-[#1B6B4A] bg-[#1B6B4A]/8" },
    ],
    verifiedCount: 47,
  },
  {
    id: "2",
    operator: "Cruz del Sur",
    type: "Cama",
    mode: "bus",
    departure: "08:30",
    arrival: "11:00",
    duration: "2.5h",
    price: 12,
    routeCode: "CDS-402",
    platform: "A2",
    seat: "08B",
    amenities: ["AC", "WiFi", "Toilet", "Blanket", "Meal"],
    seatsLeft: 4,
    tags: [
      { label: "Fastest", icon: Zap, color: "text-[#1B4A6B] bg-[#1B4A6B]/8" },
      { label: "Top Rated", icon: Star, color: "text-[#8B6914] bg-[#8B6914]/8" },
    ],
    verifiedCount: 124,
    isRecommended: true,
    recommendReason: "Best balance of price, comfort & speed based on traveller ratings",
  },
  {
    id: "3",
    operator: "Tica Bus",
    type: "Regular",
    mode: "bus",
    departure: "12:00",
    arrival: "15:30",
    duration: "3.5h",
    price: 6,
    routeCode: "TCB-210",
    platform: "C1",
    seat: "36A",
    amenities: ["AC"],
    seatsLeft: 20,
    tags: [
      { label: "Budget", icon: DollarSign, color: "text-[#1B6B4A] bg-[#1B6B4A]/8" },
    ],
    verifiedCount: 23,
  },
  {
    id: "4",
    operator: "Linea Dorada",
    type: "Ejecutivo",
    mode: "bus",
    departure: "22:00",
    arrival: "06:00",
    duration: "8h",
    price: 18,
    routeCode: "LDR-802",
    platform: "A1",
    seat: "04A",
    amenities: ["AC", "WiFi", "Toilet", "Full Recline", "Meal", "Blanket"],
    seatsLeft: 8,
    tags: [
      { label: "Safest", icon: Shield, color: "text-[#1B4A6B] bg-[#1B4A6B]/8" },
      { label: "Night Bus", icon: Clock, color: "text-[#6B5814] bg-[#6B5814]/8" },
    ],
    verifiedCount: 89,
  },
];

export function TransportBooking() {
  const { setSubPage, selectedLeg, trip, setPendingBooking } = useTrip();
  const { showToast } = useLocuToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const fromStop = selectedLeg ? trip.stops.find(s => s.id === selectedLeg.fromStopId) : null;
  const toStop = selectedLeg ? trip.stops.find(s => s.id === selectedLeg.toStopId) : null;

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "train": return Train;
      case "ferry": return Ship;
      default: return Bus;
    }
  };

  const handleBookOption = (option: TransportOption) => {
    setBookingId(option.id);
    setTimeout(() => {
      setPendingBooking(option);
      setSubPage("transitCheckout");
      setBookingId(null);
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 glass-panel border-b border-black/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSubPage(null)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground">Transport Options</h1>
        </div>
      </header>

      {/* Route Hero — Ticket stub style */}
      <div className="shrink-0 bg-card paper-texture border-b border-border">
        <div className="px-5 py-4">
          {/* Origin / Destination row */}
          <div className="flex items-center gap-3">
            {/* From */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">From</p>
              <p className="font-[var(--font-hand)] text-2xl text-foreground leading-tight truncate">{fromStop?.city || selectedLeg?.fromStopId || "Origin"}</p>
              <p className="text-xs text-muted-foreground">{fromStop?.country || ""}</p>
            </div>

            {/* Route arrow with transport icon */}
            <div className="flex flex-col items-center gap-1 shrink-0 px-2">
              <div className="w-10 h-10 rounded-full gradient-vibrant flex items-center justify-center shadow-md">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-4 h-px bg-border" />
                <ArrowRight className="w-3 h-3" />
                <div className="w-4 h-px bg-border" />
              </div>
            </div>

            {/* To */}
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">To</p>
              <p className="font-[var(--font-hand)] text-2xl text-foreground leading-tight truncate">{toStop?.city || selectedLeg?.toStopId || "Destination"}</p>
              <p className="text-xs text-muted-foreground">{toStop?.country || ""}</p>
            </div>
          </div>

          {/* Date + duration strip */}
          <div className="flex items-center justify-center gap-4 mt-3 py-2 px-4 bg-muted/40 rounded-lg border border-dashed border-border">
            {selectedLeg?.departureDate && (
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-mono font-medium text-xs">
                  {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
            )}
            {selectedLeg?.duration && (
              <>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-xs">{selectedLeg.duration}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section label */}
        <div className="px-5 py-2.5 flex items-center justify-between border-t border-dashed border-border">
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">{mockTransportOptions.length} Options Available</p>
          <p className="text-[10px] text-muted-foreground">Sorted By Recommendation</p>
        </div>
      </div>

      {/* Transport Options List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">

        {mockTransportOptions.map((option) => {
          const ModeIcon = getModeIcon(option.mode);
          const isSelected = selectedOption === option.id;
          const isExpanded = expandedOption === option.id;
          const isBookingThis = bookingId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={cn(
                "rounded-xl transition-all duration-200 cursor-pointer overflow-hidden",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                  : "border border-border shadow-sm hover:border-primary/40 hover:shadow-md"
              )}
            >
              {/* Recommended banner */}
              {option.isRecommended && (
                <div className="bg-gradient-to-r from-primary to-[#FF6B9D] px-4 py-1.5 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white tracking-wider uppercase">Locu Recommended</span>
                </div>
              )}

              <div className="bg-card">
                {/* Main content row */}
                <div className="p-4 pb-3">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <ModeIcon className={cn("w-5 h-5 transition-colors", isSelected ? "text-primary" : "text-muted-foreground")} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{option.operator}</h3>
                        <span className="text-xs text-muted-foreground">{option.type}</span>
                      </div>

                      {/* Time row */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono font-bold text-lg text-foreground">{option.departure}</span>
                        <div className="flex items-center gap-1 flex-1">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-[10px] text-muted-foreground font-mono px-1">{option.duration}</span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                        <span className="font-mono font-bold text-lg text-foreground">{option.arrival}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {option.tags.map((tag) => (
                          <span key={tag.label} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold", tag.color)}>
                            <tag.icon className="w-3 h-3" />
                            {tag.label}
                          </span>
                        ))}
                        {option.seatsLeft < 10 && (
                          <span className="text-[10px] text-[#B45309] font-medium">{option.seatsLeft} seats left</span>
                        )}
                      </div>
                    </div>

                    {/* Price column */}
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-primary font-mono">${option.price}</p>
                      <p className="text-[10px] text-muted-foreground">per person</p>
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <div className={cn(
                  "overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-60" : "max-h-0"
                )}>
                  <div className="px-4 pb-3 pt-0 border-t border-dashed border-border mx-4">
                    <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="micro-label">Route</p>
                        <p className="font-mono font-semibold text-sm">{option.routeCode}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="micro-label">Platform</p>
                        <p className="font-mono font-semibold text-sm">{option.platform}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="micro-label">Seat</p>
                        <p className="font-mono font-semibold text-sm">{option.seat}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {option.amenities.map(a => (
                        <span key={a} className="px-2 py-1 rounded-md bg-[#1B6B4A]/8 text-[#1B6B4A] text-[10px] font-semibold">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      <Star className="w-3 h-3 text-[#8B6914] fill-[#8B6914]" />
                      <span>Verified by {option.verifiedCount} travellers</span>
                    </div>
                    {option.recommendReason && (
                      <div className="flex items-start gap-1.5 mt-2 p-2 bg-primary/5 rounded-lg">
                        <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        <p className="text-[10px] text-primary font-medium">{option.recommendReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: details toggle + Book button */}
                <div className="flex items-center gap-2 px-4 pb-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedOption(isExpanded ? null : option.id); }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-muted"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? "Less" : "Details"}
                  </button>
                  <div className="flex-1" />
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleBookOption(option); }}
                    disabled={isBookingThis}
                    size="sm"
                    className={cn(
                      "font-semibold text-sm px-5 shadow-sm transition-all",
                      isBookingThis
                        ? "bg-muted text-muted-foreground"
                        : "gradient-vibrant text-white hover:shadow-md"
                    )}
                  >
                    {isBookingThis ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </span>
                    ) : (
                      <>Book ${option.price}</>
                    )}
                  </Button>
                </div>

                {/* Selection indicator bar */}
                {isSelected && (
                  <div className="h-1 gradient-vibrant" />
                )}
              </div>
            </div>
          );
        })}

        {/* Bike taxi tip card */}
        <div className="rounded-xl bg-[#FEFCE8] border border-[#FDE68A] p-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <Bike className="w-5 h-5 text-[#92710C]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                <p className="font-semibold text-sm text-[#92710C]">Local Tip</p>
              </div>
              <p className="text-xs text-[#92710C]/80 mt-1 leading-relaxed">
                Travellers report local bike taxis (mototaxis) are a much cheaper alternative for shorter hops between towns. Always negotiate the price beforehand and pay with cash.
              </p>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-medium text-[#92710C]/60">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Reported by 83 travellers
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Typically $1-3 USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
