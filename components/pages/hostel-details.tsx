"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Coffee,
  Users,
  Heart,
  CheckCircle2,
  Sparkles,
  Shield,
  Moon,
  Zap,
  Clock,
  Bus,
  AlertTriangle,
  Laptop,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Hostel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  distance: string;
  amenities: string[];
  description: string;
  isRecommended?: boolean;
  recommendReason?: string;
  tags?: { label: string; icon: any; color: string }[];
  availability: "high" | "medium" | "low";
  matchScore?: number;
  tripFit?: string;
  checkinNote?: string;
  podRooms?: string;
  wifiSpeed?: string;
  securityNote?: string;
}

const mockHostels: Hostel[] = [
  {
    id: "1",
    name: "Selina Medellin",
    image: "/hostels/antigua-hostel.jpg",
    rating: 4.8,
    reviews: 1247,
    price: 22,
    distance: "0.3km from Parque Lleras",
    amenities: ["Free WiFi", "Pool", "Coworking", "Breakfast"],
    description: "Modern coworking hostel with rooftop pool and vibrant social scene. Perfect for digital nomads looking to balance work and play.",
    isRecommended: true,
    recommendReason: "Best match for your social preferences & proximity to nightlife after your 3-day trek",
    tags: [
      { label: "Social", icon: Users, color: "bg-[#3B82F6]/10 text-[#3B82F6]" },
      { label: "Restful", icon: Moon, color: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
    ],
    availability: "medium",
    matchScore: 95,
    tripFit: "Close to the bus terminal for your early departure to Salento",
    checkinNote: "Your bus arrives at 3 PM - reception is 24hr with luggage storage",
    podRooms: "3 beds available in the same 8-bed dorm",
    wifiSpeed: "50 Mbps - Verified by Locu users",
  },
  {
    id: "2",
    name: "Los Patios Hostel",
    image: "/hostels/flores-hostel.jpg",
    rating: 4.6,
    reviews: 892,
    price: 18,
    distance: "0.5km from Old Town",
    amenities: ["Free WiFi", "Common Area", "Kitchen", "Tours"],
    description: "Beautiful colonial building with lush courtyard. Great for meeting other travellers in a relaxed setting.",
    tags: [
      { label: "Budget Pick", icon: Zap, color: "bg-[#10B981]/10 text-[#10B981]" },
    ],
    availability: "high",
    matchScore: 82,
    tripFit: "Near historic walking tours you saved",
    podRooms: "4 beds available in same dorm - book for your whole pod",
    securityNote: "24/7 security & CCTV",
  },
  {
    id: "3",
    name: "Casa Kiwi",
    image: "/hostels/granada-hostel.jpg",
    rating: 4.5,
    reviews: 634,
    price: 15,
    distance: "0.8km from Old Town",
    amenities: ["Free WiFi", "Bar", "Events", "Lockers"],
    description: "Party hostel with nightly events and rooftop bar. Budget-friendly option for social travellers.",
    tags: [
      { label: "Cheapest", icon: Zap, color: "bg-[#10B981]/10 text-[#10B981]" },
    ],
    availability: "high",
    matchScore: 71,
  },
  {
    id: "4",
    name: "Masaya Medellin",
    image: "/hostels/cusco-hostel.jpg",
    rating: 4.7,
    reviews: 1089,
    price: 24,
    distance: "0.2km from Metro",
    amenities: ["Free WiFi", "Rooftop", "Restaurant", "Tours"],
    description: "Upscale hostel with stunning city views and excellent security. Great location near public transport.",
    tags: [
      { label: "Safe Pick", icon: Shield, color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
    ],
    availability: "low",
    matchScore: 88,
    tripFit: "Direct metro line to airport for your next flight",
    securityNote: "Female-only dorms available, 24hr reception",
  },
];

export function HostelDetails() {
  const { setSubPage, updateStopBooking, selectedStop } = useTrip();
  const { showToast } = useLocuToast();
  const [savedHostels, setSavedHostels] = useState<string[]>([]);
  const [bookingHostel, setBookingHostel] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [bookedHostel, setBookedHostel] = useState<Hostel | null>(null);
  const [expandedHostel, setExpandedHostel] = useState<string | null>(null);

  const cityName = selectedStop?.city || "Medellin";
  const nights = selectedStop?.nights || 5;

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasSaved = savedHostels.includes(id);
    setSavedHostels((prev) => (wasSaved ? prev.filter((h) => h !== id) : [...prev, id]));
    showToast(wasSaved ? "Removed from saved" : "Saved to your list", wasSaved ? "info" : "success");
  };

  const handleBook = (hostel: Hostel) => {
    setBookingHostel(hostel.id);
    setTimeout(() => {
      if (selectedStop) updateStopBooking(selectedStop.id, "booked");
      setBookedHostel(hostel);
      setIsBooked(true);
      showToast(`Booked ${hostel.name}!`, "success");
    }, 1500);
  };

  const handleBookForPod = (hostel: Hostel) => {
    setBookingHostel(hostel.id);
    showToast("Reserving beds for 10 min while your Pod confirms...", "reminder", 3000);
    setTimeout(() => {
      if (selectedStop) updateStopBooking(selectedStop.id, "booked");
      setBookedHostel(hostel);
      setIsBooked(true);
    }, 2000);
  };

  const getAvailabilityInfo = (a: string) => {
    switch (a) {
      case "high": return { text: "Good availability", color: "text-[#10B981] bg-[#10B981]/10" };
      case "medium": return { text: "Limited rooms", color: "text-[#F59E0B] bg-[#F59E0B]/10" };
      case "low": return { text: "Almost full", color: "text-primary bg-primary/10" };
      default: return { text: "Check availability", color: "text-muted-foreground bg-muted" };
    }
  };

  if (isBooked && bookedHostel) {
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
          <h2 className="text-2xl font-bold text-foreground">{"You're all set!"}</h2>
          <p className="text-muted-foreground mt-2">
            Your stay at <span className="font-semibold text-foreground">{bookedHostel.name}</span> is confirmed.
          </p>
          <p className="text-sm text-muted-foreground mt-1">{nights} nights &middot; ${bookedHostel.price * nights} total</p>
          <Button onClick={() => setSubPage(null)} className="mt-6 bg-primary hover:bg-primary/90 text-white">
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
          <span className="text-lg font-bold">Hostels in {cityName}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Smart info banner */}
        <div className="bg-muted/50 rounded-xl p-3 text-sm text-muted-foreground">
          Showing {mockHostels.length} hostels for <span className="font-semibold text-foreground">{nights} nights</span> &middot; Sorted by your preferences
        </div>

        {mockHostels.map((hostel) => {
          const isExpanded = expandedHostel === hostel.id;

          return (
            <div
              key={hostel.id}
              className={cn(
                "bg-card rounded-2xl border overflow-hidden transition-all",
                hostel.isRecommended ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              )}
            >
              {/* Locu Recommended Banner */}
              {hostel.isRecommended && (
                <div className="bg-gradient-to-r from-primary to-[#FF6B9D] px-4 py-2.5">
                  <div className="flex items-center gap-2 text-white">
                    <Image src="/locu-logo.png" alt="Locu" width={40} height={16} className="h-4 w-auto brightness-0 invert" />
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-bold">Recommended for You</span>
                  </div>
                  {hostel.recommendReason && (
                    <p className="text-xs text-white/90 mt-1">{hostel.recommendReason}</p>
                  )}
                </div>
              )}

              <div className="p-4">
                {/* Main info row */}
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
                    <button onClick={(e) => toggleSave(hostel.id, e)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors">
                      <Heart className={cn("w-4 h-4 transition-colors", savedHostels.includes(hostel.id) ? "text-primary fill-primary" : "text-muted-foreground")} />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground truncate">{hostel.name}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-bold text-primary">${hostel.price}</span>
                        <p className="text-[10px] text-muted-foreground">per night</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                      <span className="text-sm font-semibold">{hostel.rating}</span>
                      <span className="text-xs text-muted-foreground">({hostel.reviews.toLocaleString()})</span>
                      {hostel.matchScore && (
                        <span className={cn(
                          "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
                          hostel.matchScore >= 90 ? "bg-[#10B981]/10 text-[#10B981]" :
                          hostel.matchScore >= 80 ? "bg-[#3B82F6]/10 text-[#3B82F6]" : "bg-muted text-muted-foreground"
                        )}>
                          {hostel.matchScore}% match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{hostel.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Smart Tags */}
                {hostel.tags && hostel.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hostel.tags.map((tag) => (
                      <span key={tag.label} className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold", tag.color)}>
                        <tag.icon className="w-3 h-3" /> {tag.label}
                      </span>
                    ))}
                    {hostel.podRooms && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-semibold">
                        <Users className="w-3 h-3" /> Pod Ready
                      </span>
                    )}
                    {hostel.wifiSpeed && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <Laptop className="w-3 h-3" /> {hostel.wifiSpeed}
                      </span>
                    )}
                  </div>
                )}

                {/* Trip-fit banner */}
                {hostel.tripFit && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#3B82F6]/5 border border-[#3B82F6]/15">
                    <p className="text-xs text-[#3B82F6] font-medium flex items-center gap-1.5">
                      <Bus className="w-3 h-3 shrink-0" /> {hostel.tripFit}
                    </p>
                  </div>
                )}

                {/* Check-in intelligence */}
                {hostel.checkinNote && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#10B981]/5 border border-[#10B981]/15">
                    <p className="text-xs text-[#10B981] font-medium flex items-center gap-1.5">
                      <Clock className="w-3 h-3 shrink-0" /> {hostel.checkinNote}
                    </p>
                  </div>
                )}

                {/* Security note */}
                {hostel.securityNote && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/15">
                    <p className="text-xs text-[#F59E0B] font-medium flex items-center gap-1.5">
                      <Shield className="w-3 h-3 shrink-0" /> {hostel.securityNote}
                    </p>
                  </div>
                )}

                {/* Expandable description */}
                <button onClick={() => setExpandedHostel(isExpanded ? null : hostel.id)} className="w-full text-left mt-3">
                  <p className={cn("text-sm text-muted-foreground", !isExpanded && "line-clamp-2")}>{hostel.description}</p>
                  {!isExpanded && <span className="text-xs text-primary font-medium">Read more</span>}
                </button>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hostel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted">{amenity}</Badge>
                  ))}
                </div>

                {/* Pod rooms info */}
                {hostel.podRooms && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#3B82F6]/5 border border-[#3B82F6]/10">
                    <p className="text-xs text-[#3B82F6] font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {hostel.podRooms}
                    </p>
                  </div>
                )}

                {/* Availability & Book */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex flex-col gap-1">
                    <Badge className={cn("text-xs w-fit", getAvailabilityInfo(hostel.availability).color)}>
                      {getAvailabilityInfo(hostel.availability).text}
                    </Badge>
                    <span className="text-xs text-muted-foreground">${hostel.price * nights} for {nights} nights</span>
                  </div>

                  <div className="flex gap-2">
                    {hostel.podRooms && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBookForPod(hostel)}
                        disabled={!!bookingHostel}
                        className="text-xs bg-transparent"
                      >
                        <Users className="w-3.5 h-3.5 mr-1" /> Book for Pod
                      </Button>
                    )}
                    <Button
                      onClick={() => handleBook(hostel)}
                      disabled={!!bookingHostel}
                      size="sm"
                      className="font-semibold text-white"
                    >
                      {bookingHostel === hostel.id ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </span>
                      ) : (
                        "Book Now"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
