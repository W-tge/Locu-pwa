"use client";

import React from "react"

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { formatDateRange, getStopIndex } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  MapPin, 
  Calendar, 
  Bed, 
  Star, 
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Cloud,
  Wifi,
  Coffee,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useCallback } from "react";

interface HostelOption {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  roomType: string;
  amenities: string[];
  distance: string;
  availability: "high" | "medium" | "low";
}

const mockHostels: Record<string, HostelOption[]> = {
  "Antigua": [
    { id: "1", name: "Earth Lodge", image: "/hostels/earth-lodge.jpg", rating: 4.8, reviews: 342, price: 12, currency: "USD", roomType: "8-bed mixed dorm", amenities: ["Mountain Views", "Yoga", "Hiking"], distance: "15min from center", availability: "medium" },
    { id: "2", name: "Tropicana Hostel", image: "/hostels/antigua-hostel.jpg", rating: 4.5, reviews: 892, price: 10, currency: "USD", roomType: "6-bed dorm", amenities: ["Pool", "Bar", "Tours"], distance: "5min from Parque Central", availability: "high" },
  ],
  "Lake Atitlan": [
    { id: "3", name: "Free Cerveza", image: "/hostels/free-cerveza.jpg", rating: 4.7, reviews: 654, price: 10, currency: "USD", roomType: "4-bed dorm", amenities: ["Lake Views", "Bar", "Hammocks"], distance: "On the water", availability: "low" },
  ],
  "Medellin": [
    { id: "4", name: "Los Patios Hostel", image: "/hostels/los-patios.jpg", rating: 4.6, reviews: 1240, price: 18, currency: "USD", roomType: "8-bed mixed dorm", amenities: ["Pool", "Coworking", "Rooftop"], distance: "0.3km from Parque Lleras", availability: "medium" },
    { id: "5", name: "Selina Medellin", image: "/hostels/selina-medellin.jpg", rating: 4.4, reviews: 890, price: 22, currency: "USD", roomType: "6-bed dorm", amenities: ["Pool", "Yoga", "Bar"], distance: "0.5km from Metro", availability: "high" },
  ],
  "default": [
    { id: "d1", name: "Selina Hostel", image: "/hostels/selina-medellin.jpg", rating: 4.5, reviews: 500, price: 18, currency: "USD", roomType: "6-bed dorm", amenities: ["Co-working", "Pool"], distance: "Central location", availability: "high" },
    { id: "d2", name: "Backpackers Inn", image: "/hostels/granada-hostel.jpg", rating: 4.2, reviews: 320, price: 12, currency: "USD", roomType: "8-bed dorm", amenities: ["Budget", "Social"], distance: "Near bus station", availability: "high" },
    { id: "d3", name: "Nomad's Lodge", image: "/hostels/cusco-hostel.jpg", rating: 4.4, reviews: 410, price: 15, currency: "USD", roomType: "6-bed dorm", amenities: ["Fast WiFi", "Kitchen"], distance: "Old town", availability: "medium" },
  ],
};

function getHostelsForCity(city: string): HostelOption[] {
  return mockHostels[city] || mockHostels["default"];
}

export function StopDetailSheet() {
  const { trip, selectedStop, setSelectedStop, updateStopBooking, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const [showHostels, setShowHostels] = useState(false);
  const [isBooked, setIsBookedLocal] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleDismiss = useCallback(() => {
    setSelectedStop(null);
    setShowHostels(false);
    setIsBookedLocal(false);
  }, [setSelectedStop]);

  // Drag-down to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - startY.current > 60) {
      handleDismiss();
    }
  }, [handleDismiss]);

  if (!selectedStop) return null;

  const hostels = getHostelsForCity(selectedStop.city);
  const stopBooked = selectedStop.bookingStatus === "booked" || isBooked;
  const isPending = selectedStop.bookingStatus === "pending";
  const stopIndex = getStopIndex(trip, selectedStop.id);

  const handleBookHostel = (hostel: HostelOption) => {
    updateStopBooking(selectedStop.id, "booked");
    setIsBookedLocal(true);
    setShowHostels(false);
    showToast(`${hostel.name} booked for ${selectedStop.city}!`, "success");
  };

  return (
    <>
      {/* Backdrop - click to dismiss */}
      <div 
        className="fixed inset-0 z-[60] bg-black/20" 
        onClick={handleDismiss}
      />
      
      {/* Sheet - sits above backdrop but below bottom nav */}
      <div 
        className="fixed inset-x-0 bottom-16 lg:bottom-0 z-[61] animate-in slide-in-from-bottom duration-300"
        ref={dragRef}
      >
        <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
          {/* Minimize Bar - tap or drag to close */}
          <button
            className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onClick={handleDismiss}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label="Minimize"
          >
            <div className="w-10 h-1.5 rounded-full bg-muted-foreground/40 hover:bg-muted-foreground/60 transition-colors" />
          </button>
          
          {/* Header - no X button, minimize bar handles close */}
          <div className="px-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                stopBooked ? "bg-[#10B981]" : isPending ? "bg-[#F59E0B]" : "bg-primary"
              )}>
                {stopIndex}
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedStop.city}</h2>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold ml-auto",
                  stopBooked && "bg-[#10B981]/10 border-[#10B981] text-[#10B981]",
                  isPending && "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]",
                  !stopBooked && !isPending && "bg-primary/10 border-primary text-primary"
                )}
              >
                {stopBooked ? "Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 ml-10">
              <MapPin className="w-3.5 h-3.5" />
              {selectedStop.country}
              {selectedStop.weather && (
                <>
                  <span className="mx-1 text-muted-foreground/40">|</span>
                  <Cloud className="w-3.5 h-3.5" />
                  {selectedStop.weather}
                </>
              )}
            </p>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Date & Duration */}
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  Dates
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {formatDateRange(selectedStop.startDate, selectedStop.endDate)}
                </p>
              </div>
              <div className="flex-1 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Bed className="w-3.5 h-3.5" />
                  Duration
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {selectedStop.durationDays} {selectedStop.durationDays === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>

            {/* Booked Hostel Info */}
            {stopBooked && selectedStop.hostelName && (
              <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="text-sm font-semibold text-[#10B981]">Accommodation Confirmed</span>
                </div>
                <div className="flex gap-3">
                  {selectedStop.hostelImage && (
                    <Image
                      src={selectedStop.hostelImage || "/placeholder.svg"}
                      alt={selectedStop.hostelName}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover w-20 h-16"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{selectedStop.hostelName}</p>
                    {selectedStop.hostelPrice && (
                      <p className="text-sm text-primary font-bold">${selectedStop.hostelPrice}/night</p>
                    )}
                    <button 
                      className="text-xs text-primary hover:underline mt-1"
                      onClick={() => setSubPage("hostelDetails")}
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hostel Options - expandable */}
            {!stopBooked && (
              <div>
                <button
                  onClick={() => setShowHostels(!showHostels)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-sm">Browse Hostels ({hostels.length})</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showHostels && "rotate-180")} />
                </button>
                
                {showHostels && (
                  <div className="mt-2 space-y-2">
                    {hostels.map((hostel, i) => (
                      <div key={hostel.id} className={cn(
                        "rounded-xl border p-3",
                        i === 0 ? "border-primary/40 bg-primary/5" : "border-border"
                      )}>
                        {i === 0 && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Image src="/locu-logo.png" alt="Locu" width={40} height={16} className="h-3.5 w-auto" />
                            <span className="text-[10px] font-bold text-primary">RECOMMENDED</span>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Image
                            src={hostel.image || "/placeholder.svg"}
                            alt={hostel.name}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover w-20 h-16 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{hostel.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
                              <span>{hostel.rating}</span>
                              <span>({hostel.reviews})</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{hostel.roomType}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="font-bold text-primary">${hostel.price}<span className="text-xs text-muted-foreground font-normal">/night</span></p>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-[10px]",
                                  hostel.availability === "low" ? "border-[#FF6B9D] text-[#FF6B9D]" :
                                  hostel.availability === "medium" ? "border-[#F59E0B] text-[#F59E0B]" :
                                  "border-[#10B981] text-[#10B981]"
                                )}
                              >
                                {hostel.availability === "low" ? "Few left" : hostel.availability === "medium" ? "Filling up" : "Available"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {hostel.amenities.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">{a}</span>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm" 
                          size="sm"
                          onClick={() => handleBookHostel(hostel)}
                        >
                          Book Now
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Action Footer */}
          <div className="p-4 border-t border-border bg-card">
            {!stopBooked ? (
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" onClick={() => setSubPage("hostelDetails")}>
                <Bed className="w-4 h-4 mr-2" />
                Explore & Book Hostels
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
