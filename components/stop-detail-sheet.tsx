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
  ChevronLeft,
  ChevronRight,
  Cloud,
  Wifi,
  Coffee,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useCallback, useMemo } from "react";
import { useHostelsForCity } from "@/lib/api/hooks";
import type { HostelOptionDto } from "@/lib/api/types";

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

function mapDtoToHostelOption(d: HostelOptionDto): HostelOption {
  return {
    id: d.id,
    name: d.name,
    image: d.image,
    rating: d.rating,
    reviews: d.reviews,
    price: d.price,
    currency: d.currency ?? "USD",
    roomType: d.roomType,
    amenities: d.amenities ?? [],
    distance: d.distance,
    availability: d.availability,
  };
}

function getHostelsForCityFallback(city: string): HostelOption[] {
  return mockHostels[city] || mockHostels["default"];
}

// ---- Inline Mini Calendar ----
function MiniCalendar({ selectedStart, selectedEnd, onSelect, onClose }: {
  selectedStart: Date;
  selectedEnd: Date;
  onSelect: (start: Date, end: Date) => void;
  onClose: () => void;
}) {
  const [viewMonth, setViewMonth] = useState(new Date(selectedStart.getFullYear(), selectedStart.getMonth(), 1));
  const [pickingEnd, setPickingEnd] = useState(false);
  const [tempStart, setTempStart] = useState(selectedStart);
  const [tempEnd, setTempEnd] = useState(selectedEnd);

  const monthName = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    if (!pickingEnd) {
      setTempStart(clicked);
      setPickingEnd(true);
    } else {
      const newEnd = clicked > tempStart ? clicked : tempStart;
      const newStart = clicked > tempStart ? tempStart : clicked;
      setTempStart(newStart);
      setTempEnd(newEnd);
      setPickingEnd(false);
      onSelect(newStart, newEnd);
    }
  };

  const isInRange = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d >= tempStart && d <= tempEnd;
  };

  const isStart = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d.toDateString() === tempStart.toDateString();
  };

  const isEnd = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    return d.toDateString() === tempEnd.toDateString();
  };

  const isPast = (day: number) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  };

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-card paper-shadow p-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} className="p-1 hover:bg-muted rounded-md">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-serif font-semibold">{monthName}</span>
        <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} className="p-1 hover:bg-muted rounded-md">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mb-2 font-medium">
        {pickingEnd ? "Now select your check-out date" : "Select your check-in date"}
      </p>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const past = isPast(day);
          const inRange = isInRange(day);
          const start = isStart(day);
          const end = isEnd(day);

          return (
            <button
              key={day}
              disabled={past}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-8 text-xs rounded-md transition-all font-medium",
                past && "text-muted-foreground/30 cursor-not-allowed",
                !past && !inRange && "hover:bg-primary/10 text-foreground",
                inRange && !start && !end && "bg-primary/10 text-primary",
                (start || end) && "bg-primary text-white font-bold"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {Math.max(1, Math.round((tempEnd.getTime() - tempStart.getTime()) / (1000 * 60 * 60 * 24)))} nights selected
        </div>
        <button onClick={onClose} className="text-xs font-semibold text-primary hover:underline">Done</button>
      </div>
    </div>
  );
}

export function StopDetailSheet() {
  const { trip, selectedStop, setSelectedStop, updateStopBooking, updateStopDates, setSubPage, setPendingBooking } = useTrip();
  const { showToast } = useLocuToast();
  const [showHostels, setShowHostels] = useState(false);
  const [isBooked, setIsBookedLocal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const dragRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleDismiss = useCallback(() => {
    setSelectedStop(null);
    setShowHostels(false);
    setIsBookedLocal(false);
    setShowCalendar(false);
  }, [setSelectedStop]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - startY.current > 60) {
      handleDismiss();
    }
  }, [handleDismiss]);

  const city = selectedStop?.city ?? "";
  const checkIn = selectedStop?.startDate ?? "";
  const checkOut = selectedStop?.endDate ?? "";
  const fallback = useMemo(
    () => getHostelsForCityFallback(city) as unknown as import("@/lib/api/types").HostelOptionDto[],
    [city]
  );
  const { hostels: apiHostels } = useHostelsForCity(city, checkIn, checkOut, fallback);
  const hostels: HostelOption[] =
    apiHostels.length > 0
      ? apiHostels.map(mapDtoToHostelOption)
      : getHostelsForCityFallback(city);

  if (!selectedStop) return null;

  const stopBooked = selectedStop.bookingStatus === "booked" || isBooked;
  const stopIndex = getStopIndex(trip, selectedStop.id);

  const handleBookHostel = (hostel: HostelOption) => {
    setPendingBooking(hostel);
    setShowHostels(false);
    setSubPage("hostelCheckout");
  };

  const handleDateSelect = (start: Date, end: Date) => {
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    updateStopDates(selectedStop.id, startStr, endStr);
    showToast(`Dates updated for ${selectedStop.city}`, "success");
  };

  const nights = selectedStop.nights || (() => {
    const s = new Date(selectedStop.startDate);
    const e = new Date(selectedStop.endDate);
    return Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  })();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/20" onClick={handleDismiss} />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-16 lg:bottom-0 z-[61] animate-in slide-in-from-bottom duration-300"
        ref={dragRef}
      >
        <div className="bg-[#FFFEF9] paper-texture border-t-2 border-[#DDD8CC] rounded-t-3xl paper-shadow max-h-[70vh] overflow-hidden flex flex-col">
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
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                stopBooked ? "bg-[#10B981]" : "bg-primary"
              )}>
                {stopIndex}
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedStop.city}</h2>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold ml-auto",
                  stopBooked ? "bg-[#10B981]/10 border-[#10B981] text-[#10B981]" : "bg-primary/10 border-primary text-primary"
                )}
              >
                {stopBooked ? "Booked" : "Needs Booking"}
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
            {/* Date & Duration - Interactive Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={cn(
                  "flex-1 rounded-xl p-3 text-left transition-all border-2",
                  showCalendar
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="micro-label">Dates</span>
                  <span className="ml-auto text-[10px] text-primary font-semibold">
                    {showCalendar ? "Close" : "Edit"}
                  </span>
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {formatDateRange(selectedStop.startDate, selectedStop.endDate)}
                </p>
              </button>
              <div className="w-px bg-border" />
              <div className="flex-1 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Bed className="w-3.5 h-3.5" />
                  <span className="micro-label">Duration</span>
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {nights} {nights === 1 ? "night" : "nights"}
                </p>
              </div>
            </div>

            {/* Calendar Picker */}
            {showCalendar && (
              <MiniCalendar
                selectedStart={new Date(selectedStop.startDate)}
                selectedEnd={new Date(selectedStop.endDate)}
                onSelect={handleDateSelect}
                onClose={() => setShowCalendar(false)}
              />
            )}

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
                      className="text-xs font-semibold text-primary hover:underline mt-1 flex items-center gap-1"
                      onClick={() => setSubPage("bookingDetails")}
                    >
                      View Booking Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Look at Hostels - expandable preview */}
            {!stopBooked && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowHostels(!showHostels)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                    showHostels
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card/80 hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Bed className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm text-foreground">Quick Look at Hostels</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{hostels.length} options in {selectedStop.city}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0", showHostels && "rotate-180")} />
                </button>
                
                {showHostels && (
                  <div className="space-y-2 pl-1">
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
                            <span key={a} className="px-2.5 py-1 rounded-full bg-[#1B6B4A]/10 text-[10px] font-semibold text-[#1B6B4A] border border-[#1B6B4A]/20">{a}</span>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full mt-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm" 
                          size="sm"
                          onClick={() => handleBookHostel(hostel)}
                        >
                          Book this one
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
              <Button 
                className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all" 
                style={{ background: "linear-gradient(135deg, #FC2869 0%, #FF6B9D 60%, #F59E0B 100%)" }}
                onClick={() => setSubPage("hostelDetails")}
              >
                <Bed className="w-4 h-4 mr-2" />
                Book Hostels
              </Button>
            ) : (
              <Button 
                className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #FC2869 0%, #FF6B9D 60%, #F59E0B 100%)" }}
                onClick={() => setSubPage("bookingDetails")}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                View Booking Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
