"use client";

import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
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
    price: 18,
    amenities: ["AC", "WiFi", "Toilet"],
    seatsLeft: 12,
    tags: [
      { label: "Cheapest", icon: DollarSign, color: "bg-[#10B981]/10 text-[#10B981]" },
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
    price: 25,
    amenities: ["AC", "WiFi", "Toilet", "Blanket", "Meal"],
    seatsLeft: 4,
    tags: [
      { label: "Fastest", icon: Zap, color: "bg-[#3B82F6]/10 text-[#3B82F6]" },
      { label: "Top Rated", icon: Star, color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
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
    price: 15,
    amenities: ["AC"],
    seatsLeft: 20,
    tags: [
      { label: "Budget", icon: DollarSign, color: "bg-[#10B981]/10 text-[#10B981]" },
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
    price: 45,
    amenities: ["AC", "WiFi", "Toilet", "Full Recline", "Meal", "Blanket"],
    seatsLeft: 8,
    tags: [
      { label: "Safest", icon: Shield, color: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
      { label: "Night Bus", icon: Clock, color: "bg-muted text-muted-foreground" },
    ],
    verifiedCount: 89,
  },
];

export function TransportBooking() {
  const { setSubPage, updateLegBooking, selectedLeg, trip } = useTrip();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

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
      }, 1500);
    }
  };

  if (isBooked) {
    const bookedOption = mockTransportOptions.find(o => o.id === selectedOption);
    return (
      <div className="h-full flex flex-col bg-background">
        <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
          <button onClick={() => setSubPage(null)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Booking Confirmed</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Transport Booked!</h2>
          <p className="text-muted-foreground mt-2">{fromStop?.city} → {toStop?.city}</p>
          {bookedOption && (
            <div className="mt-4 p-4 bg-card rounded-xl border border-border w-full max-w-xs">
              <p className="font-bold">{bookedOption.operator}</p>
              <p className="text-sm text-muted-foreground">{bookedOption.departure} · {bookedOption.duration}</p>
              <p className="text-lg font-bold text-[#10B981] mt-2">${bookedOption.price}</p>
            </div>
          )}
          <Button onClick={() => setSubPage(null)} className="mt-6 bg-primary hover:bg-primary/90">
            Back to Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSubPage(null)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <span className="text-lg font-bold">Transport Options</span>
        </div>
      </header>

      {/* Route Info */}
      <div className="p-4 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="font-bold text-lg">{fromStop?.city || "Origin"}</p>
            <p className="text-xs text-muted-foreground">{fromStop?.country}</p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 border-t-2 border-dashed border-primary" />
            <Bus className="w-5 h-5" />
            <div className="w-8 border-t-2 border-dashed border-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{toStop?.city || "Destination"}</p>
            <p className="text-xs text-muted-foreground">{toStop?.country}</p>
          </div>
        </div>
        {selectedLeg?.departureDate && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      {/* Transport Options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockTransportOptions.map((option) => {
          const ModeIcon = getModeIcon(option.mode);
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={cn(
                "w-full rounded-xl border text-left transition-all relative overflow-hidden",
                selectedOption === option.id ? "border-primary shadow-md" : "border-border bg-card hover:border-primary/50",
                option.isRecommended && selectedOption !== option.id && "border-primary/50"
              )}
            >
              {/* Locu Recommended Banner */}
              {option.isRecommended && (
                <div className="bg-gradient-to-r from-primary to-[#FF6B9D] px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Image src="/locu-logo.png" alt="Locu" width={40} height={16} className="h-4 w-auto brightness-0 invert" />
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Recommended</span>
                  </div>
                  {option.recommendReason && (
                    <p className="text-[10px] text-white/90 mt-0.5">{option.recommendReason}</p>
                  )}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Mode Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    selectedOption === option.id ? "bg-primary/10" : "bg-muted"
                  )}>
                    <ModeIcon className={cn("w-5 h-5", selectedOption === option.id ? "text-primary" : "text-muted-foreground")} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{option.operator}</p>
                      <Badge variant="secondary" className="text-[10px]">{option.type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <span className="font-semibold">{option.departure}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="font-semibold">{option.arrival}</span>
                      <span className="text-muted-foreground">({option.duration})</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {option.tags.map((tag) => (
                        <span key={tag.label} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", tag.color)}>
                          <tag.icon className="w-3 h-3" />
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                      {option.amenities.slice(0, 4).map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                      {option.amenities.length > 4 && <span>+{option.amenities.length - 4}</span>}
                    </div>

                    {/* Verified */}
                    <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
                      Verified by {option.verifiedCount} travellers
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary">${option.price}</p>
                    {option.seatsLeft < 10 && (
                      <p className="text-[10px] text-[#F59E0B] font-medium mt-0.5">{option.seatsLeft} left</p>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedOption === option.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Pro tip */}
        <div className="p-3 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-[#FBBF24]">Pro tip:</span> Night buses save accommodation costs!
          </p>
        </div>
      </div>

      {/* Booking Footer */}
      <div className="shrink-0 p-4 border-t border-border bg-card">
        <Button
          onClick={handleBook}
          disabled={!selectedOption || isBooking}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-semibold"
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
    </div>
  );
}
