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
  const { setSubPage, updateLegBooking, selectedLeg, trip } = useTrip();
  const { showToast } = useLocuToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [detailOption, setDetailOption] = useState<TransportOption | null>(null);

  const fromStop = selectedLeg ? trip.stops.find(s => s.id === selectedLeg.fromStopId) : null;
  const toStop = selectedLeg ? trip.stops.find(s => s.id === selectedLeg.toStopId) : null;

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "train": return Train;
      case "ferry": return Ship;
      default: return Bus;
    }
  };

  const handleBook = () => {
    if (selectedOption && selectedLeg) {
      setIsBooking(true);
      setTimeout(() => {
        updateLegBooking(selectedLeg.id, "booked");
        setIsBooked(true);
        setIsBooking(false);
        showToast("Transport booked successfully!", "success");
      }, 1500);
    }
  };

  /* --- Booked confirmation (ticket stub) --- */
  if (isBooked) {
    const bookedOption = mockTransportOptions.find(o => o.id === selectedOption);
    return (
      <div className="h-full flex flex-col bg-background paper-texture">
        <header className="glass-panel border-b border-black/5 px-4 py-4 flex items-center gap-4">
          <button onClick={() => setSubPage(null)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Booking Confirmed</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1B6B4A]/15 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-[#1B6B4A]" />
          </div>
          <h2 className="text-2xl font-serif text-foreground">Transport Booked</h2>
          <p className="text-muted-foreground font-mono text-sm mt-2">{fromStop?.city} &rarr; {toStop?.city}</p>
          {bookedOption && (
            <div className="mt-6 bg-card rounded-xl paper-shadow overflow-hidden w-full max-w-xs">
              {/* Ticket stub */}
              <div className="p-4 border-b border-dashed border-border">
                <p className="font-bold text-lg">{bookedOption.operator}</p>
                <p className="micro-label mt-1">ROUTE {bookedOption.routeCode}</p>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="micro-label">DEP. TIME</p>
                  <p className="font-mono font-semibold text-lg">{bookedOption.departure}</p>
                </div>
                <div>
                  <p className="micro-label">PLATFORM</p>
                  <p className="font-mono font-semibold text-lg">{bookedOption.platform}</p>
                </div>
                <div>
                  <p className="micro-label">SEAT</p>
                  <p className="font-mono font-semibold text-lg">{bookedOption.seat}</p>
                </div>
              </div>
              <div className="px-4 pb-4 flex justify-center">
                {/* Dummy barcode */}
                <div className="flex items-end gap-[2px] h-10 opacity-40">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="bg-foreground rounded-sm" style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${40 + Math.sin(i) * 20}%` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <Button onClick={() => setSubPage(null)} className="mt-6 bg-primary hover:bg-primary/90 text-white">
            Back to Journey
          </Button>
        </div>
      </div>
    );
  }

  /* --- Main booking page --- */
  return (
    <div className="h-full flex flex-col bg-background paper-texture">
      {/* Header */}
      <header className="shrink-0 glass-panel border-b border-black/5 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSubPage(null)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <span className="text-lg font-bold">Transport Options</span>
        </div>
      </header>

      {/* Route Info */}
      <div className="p-4 bg-card/60 border-b border-black/5">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="font-serif text-xl">{fromStop?.city || "Origin"}</p>
            <p className="micro-label mt-0.5">{fromStop?.country}</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 border-t-2 border-dashed border-muted-foreground/40" />
            <Bus className="w-5 h-5" />
            <div className="w-8 border-t-2 border-dashed border-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="font-serif text-xl">{toStop?.city || "Destination"}</p>
            <p className="micro-label mt-0.5">{toStop?.country}</p>
          </div>
        </div>
        {selectedLeg?.departureDate && (
          <div className="flex items-center justify-center gap-2 mt-3 font-mono text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      {/* Transport Options Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-[#F0EDE4] border-y border-[#DDD8CC] px-4 py-3 sticky top-0 z-10">
          <h2 className="font-serif text-lg text-foreground">Available Transport Options</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{mockTransportOptions.length} options • Compare prices & amenities</p>
        </div>
        
        <div className="p-4 space-y-4">
          {mockTransportOptions.map((option) => {
          const ModeIcon = getModeIcon(option.mode);
          const isSelected = selectedOption === option.id;

          return (
            <div
              key={option.id}
              className={cn(
                "w-full rounded-xl text-left transition-all relative bg-card paper-shadow overflow-hidden",
                isSelected && "ring-4 ring-[#1B6B4A] ring-offset-4 ring-offset-background",
              )}
              onClick={() => setSelectedOption(option.id)}
            >
              {/* Locu Recommended Banner */}
              {option.isRecommended && (
                <div className="bg-gradient-to-r from-primary to-[#FF6B9D] px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Image src="/locu-logo.png" alt="Locu" width={40} height={16} className="h-4 w-auto brightness-0 invert" />
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tracking-wide">RECOMMENDED</span>
                  </div>
                  {option.recommendReason && (
                    <p className="text-[10px] text-white/90 mt-0.5">{option.recommendReason}</p>
                  )}
                </div>
              )}

              {/* Ticket body */}
              <div className="flex">
                {/* Main info */}
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <ModeIcon className={cn("w-4 h-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{option.operator}</p>
                      <p className="micro-label">{option.type}</p>
                    </div>
                  </div>

                  {/* Times in monospace */}
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="font-mono font-semibold text-xl text-foreground">{option.departure}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="font-mono font-semibold text-xl text-foreground">{option.arrival}</span>
                    <span className="font-mono text-xs text-muted-foreground">({option.duration})</span>
                  </div>

                  {/* Stamped data fields */}
                  <div className="flex gap-4 mt-3">
                    <div>
                      <p className="micro-label">ROUTE</p>
                      <p className="font-mono font-medium text-sm">{option.routeCode}</p>
                    </div>
                    <div>
                      <p className="micro-label">PLATFORM</p>
                      <p className="font-mono font-medium text-sm">{option.platform}</p>
                    </div>
                    <div>
                      <p className="micro-label">SEAT</p>
                      <p className="font-mono font-medium text-sm">{option.seat}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {option.tags.map((tag) => (
                      <span key={tag.label} className={cn("stamp inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold", tag.color)}>
                        <tag.icon className="w-3 h-3" />
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  {/* Amenities + verified */}
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-muted-foreground">
                    <span>{option.amenities.slice(0, 3).join(" / ")}{option.amenities.length > 3 ? ` +${option.amenities.length - 3}` : ""}</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-[#8B6914] fill-[#8B6914]" />
                      {option.verifiedCount} verified
                    </span>
                  </div>
                </div>

                {/* Ticket stub (right side with perforated edge) */}
                <div className="relative flex flex-col items-center justify-center w-24 shrink-0 border-l border-dashed border-border">
                  {/* Semi-circle cutouts */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded-b-full bg-background" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full bg-background" />

                  <p className="text-2xl font-bold text-primary font-mono">${option.price}</p>
                  {option.seatsLeft < 10 && (
                    <p className="text-[10px] text-[#8B6914] font-medium mt-1">{option.seatsLeft} left</p>
                  )}

                  {/* Mini barcode */}
                  <div className="flex items-end gap-[1px] h-6 mt-3 opacity-25">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="bg-foreground" style={{ width: 1.5, height: `${30 + Math.sin(i * 1.5) * 40}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 p-3 pt-0">
                <Button 
                  onClick={() => setSelectedOption(option.id)} 
                  size="sm" 
                  variant={isSelected ? "default" : "outline"}
                  className={cn("flex-1 text-xs font-semibold", isSelected ? "gradient-vibrant text-white shadow-md" : "hover:border-primary/50")}
                >
                  {isSelected ? "Selected" : "Select This"}
                </Button>
                <Button 
                  onClick={() => setDetailOption(option)} 
                  size="sm" 
                  variant="outline"
                  className="flex-1 text-xs font-semibold"
                >
                  See More Details
                </Button>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Booking Footer */}
      <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
        <Button
          onClick={handleBook}
          disabled={!selectedOption || isBooking}
          className="w-full h-12 gradient-vibrant text-lg font-semibold text-white shadow-lg disabled:opacity-50"
        >
          {isBooking ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Booking...
            </span>
          ) : selectedOption ? (
            `Book for $${mockTransportOptions.find(o => o.id === selectedOption)?.price}`
          ) : (
            "Select an option"
          )}
        </Button>
      </div>

      {/* See More Details Popup */}
      {detailOption && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetailOption(null)} />
          <div className="relative bg-[#FFFEF9] paper-texture rounded-t-2xl sm:rounded-2xl paper-shadow w-full sm:max-w-md max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 sm:mx-4">
            {/* Header */}
            <div className="sticky top-0 z-10 glass-panel px-5 py-4 border-b border-black/5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-foreground">{detailOption.operator}</h3>
                <p className="text-xs text-muted-foreground font-mono">{detailOption.type} &middot; {detailOption.routeCode}</p>
              </div>
              <button onClick={() => setDetailOption(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Route Info */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="micro-label">Departure</p>
                  <p className="text-2xl font-mono font-bold">{detailOption.departure}</p>
                  <p className="text-xs text-muted-foreground">{fromStop?.city}</p>
                </div>
                <div className="flex flex-col items-center gap-1 flex-1 mx-4">
                  <p className="text-xs text-muted-foreground font-mono">{detailOption.duration}</p>
                  <div className="w-full h-px bg-border relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {(() => { const Icon = getModeIcon(detailOption.mode); return <Icon className="w-4 h-4 text-muted-foreground" />; })()}
                </div>
                <div className="text-center">
                  <p className="micro-label">Arrival</p>
                  <p className="text-2xl font-mono font-bold">{detailOption.arrival}</p>
                  <p className="text-xs text-muted-foreground">{toStop?.city}</p>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="micro-label">Platform</p>
                  <p className="text-lg font-mono font-bold">{detailOption.platform}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="micro-label">Seat</p>
                  <p className="text-lg font-mono font-bold">{detailOption.seat}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="micro-label">Price</p>
                  <p className="text-lg font-mono font-bold text-primary">${detailOption.price}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="micro-label mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {detailOption.amenities.map(a => (
                    <span key={a} className="px-3 py-1.5 rounded-lg bg-[#1B6B4A]/10 text-[#1B6B4A] text-xs font-semibold border border-[#1B6B4A]/20">{a}</span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {detailOption.tags.length > 0 && (
                <div>
                  <p className="micro-label mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {detailOption.tags.map(tag => {
                      const TagIcon = tag.icon;
                      return (
                        <span key={tag.label} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border", tag.color, "border-current/20")}>
                          <TagIcon className="w-3.5 h-3.5" />
                          {tag.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Community verification */}
              <div className="flex items-center gap-2 p-3 bg-[#FBBF24]/10 rounded-lg border border-[#FBBF24]/20">
                <Users className="w-4 h-4 text-[#92710C]" />
                <span className="text-xs font-medium text-[#92710C]">Verified by {detailOption.verifiedCount} travellers</span>
              </div>

              {/* Recommendation */}
              {detailOption.isRecommended && detailOption.recommendReason && (
                <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-primary font-medium">{detailOption.recommendReason}</span>
                </div>
              )}

              {/* Action */}
              <Button 
                onClick={() => { setSelectedOption(detailOption.id); setDetailOption(null); }} 
                className="w-full gradient-vibrant text-white font-semibold shadow-lg"
              >
                {selectedOption === detailOption.id ? "Already Selected" : "Select This Option"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
