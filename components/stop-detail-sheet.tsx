"use client";

import { useTrip } from "@/lib/trip-context";
import { formatDateRange } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { 
  X, 
  MapPin, 
  Calendar, 
  Bed, 
  Star, 
  Wifi, 
  Coffee, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HostelOption {
  name: string;
  rating: number;
  price: number;
  currency: string;
  tags: string[];
  availability: "high" | "medium" | "low";
  imageUrl?: string;
}

// Mock hostel data for demo
const mockHostels: Record<string, HostelOption[]> = {
  "Mexico City": [
    { name: "Casa Pepe Hostel", rating: 9.2, price: 18, currency: "USD", tags: ["Rooftop Bar", "Walking Tours"], availability: "medium" },
    { name: "Hostel Mundo Joven Catedral", rating: 8.8, price: 15, currency: "USD", tags: ["Central Location", "Social"], availability: "high" },
    { name: "Mexico City Hostel", rating: 8.5, price: 12, currency: "USD", tags: ["Budget", "Dorms"], availability: "high" },
  ],
  "Oaxaca": [
    { name: "Hostal Central Oaxaca", rating: 9.0, price: 15, currency: "USD", tags: ["Cooking Class", "Courtyard"], availability: "low" },
    { name: "Casa Angel Youth Hostel", rating: 8.7, price: 14, currency: "USD", tags: ["Colonial Building", "WiFi"], availability: "medium" },
  ],
  "default": [
    { name: "Selina Hostel", rating: 8.5, price: 20, currency: "USD", tags: ["Co-working", "Pool"], availability: "high" },
    { name: "Backpackers Inn", rating: 8.2, price: 12, currency: "USD", tags: ["Budget", "Social"], availability: "high" },
    { name: "Nomad's Lodge", rating: 8.8, price: 16, currency: "USD", tags: ["Digital Nomad", "Fast WiFi"], availability: "medium" },
  ],
};

function getHostelsForCity(city: string): HostelOption[] {
  return mockHostels[city] || mockHostels["default"];
}

export function StopDetailSheet() {
  const { selectedStop, setSelectedStop, updateStopBooking } = useTrip();
  const [showHostels, setShowHostels] = useState(false);

  if (!selectedStop) return null;

  const hostels = getHostelsForCity(selectedStop.city);
  const isBooked = selectedStop.bookingStatus === "booked";
  const isPending = selectedStop.bookingStatus === "pending";

  const handleBookHostel = (hostel: HostelOption) => {
    updateStopBooking(selectedStop.id, "booked");
    setShowHostels(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-3 flex items-start justify-between border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{selectedStop.city}</h2>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  isBooked && "bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]",
                  isPending && "bg-[#FF9F43]/10 border-[#FF9F43] text-[#FF9F43]",
                  !isBooked && !isPending && "bg-[#FC2869]/10 border-[#FC2869] text-[#FC2869]"
                )}
              >
                {isBooked ? "Booked" : isPending ? "Pending" : "Not Booked"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {selectedStop.country}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedStop(null)}
            className="shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {/* Date & Duration */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                Dates
              </div>
              <p className="font-semibold text-foreground mt-1">
                {formatDateRange(selectedStop.startDate, selectedStop.endDate)}
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Bed className="w-4 h-4" />
                Duration
              </div>
              <p className="font-semibold text-foreground mt-1">
                {selectedStop.nights} nights
              </p>
            </div>
          </div>
          
          {/* Tags */}
          {selectedStop.tags && selectedStop.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedStop.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Community Tips */}
          {selectedStop.communityTips && selectedStop.communityTips.length > 0 && (
            <div className="rounded-xl border border-[#FF9F43]/30 bg-[#FF9F43]/5 p-3">
              <div className="flex items-center gap-2 text-[#FF9F43] font-medium text-sm mb-2">
                <Lightbulb className="w-4 h-4" />
                Traveller Tips
              </div>
              <ul className="space-y-1.5">
                {selectedStop.communityTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-[#FF9F43]">-</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Current Booking */}
          {isBooked && selectedStop.hostelName && (
            <div className="rounded-xl border border-[#4ECDC4]/30 bg-[#4ECDC4]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#4ECDC4]" />
                <span className="font-semibold text-foreground">Booked</span>
              </div>
              <p className="text-foreground font-medium">{selectedStop.hostelName}</p>
              {selectedStop.hostelPrice && (
                <p className="text-sm text-muted-foreground">
                  ${selectedStop.hostelPrice} {selectedStop.currency}/night
                </p>
              )}
            </div>
          )}
          
          {/* Hostel Selection */}
          {!isBooked && (
            <div>
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => setShowHostels(!showHostels)}
              >
                <span className="flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  {isPending ? "Confirm Hostel Booking" : "Find & Book Hostel"}
                </span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showHostels && "rotate-180")} />
              </Button>
              
              {showHostels && (
                <div className="mt-3 space-y-2">
                  {hostels.map((hostel, i) => (
                    <div 
                      key={i}
                      className="rounded-xl border border-border bg-card p-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{hostel.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-3.5 h-3.5 text-[#FF9F43] fill-[#FF9F43]" />
                              {hostel.rating}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px]",
                                hostel.availability === "high" && "border-[#4ECDC4] text-[#4ECDC4]",
                                hostel.availability === "medium" && "border-[#FF9F43] text-[#FF9F43]",
                                hostel.availability === "low" && "border-[#FC2869] text-[#FC2869]"
                              )}
                            >
                              {hostel.availability === "high" ? "Available" : hostel.availability === "medium" ? "Few Left" : "Almost Full"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hostel.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">${hostel.price}</p>
                          <p className="text-[10px] text-muted-foreground">/night</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-3 gradient-primary text-white" 
                        size="sm"
                        onClick={() => handleBookHostel(hostel)}
                      >
                        Book on Hostelworld
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
          {!isBooked ? (
            <Button className="w-full gradient-primary text-white" onClick={() => setShowHostels(true)}>
              <Bed className="w-4 h-4 mr-2" />
              {isPending ? "Confirm Booking" : "Book Accommodation"}
            </Button>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedStop(null)}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
