"use client";

import { useTrip } from "@/lib/trip-context";
import { formatDateRange, getStopIndex } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { 
  X, 
  MapPin, 
  Calendar, 
  Bed, 
  Star, 
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Cloud,
  Wifi,
  Coffee,
  Users,
  MapPinned
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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

// Mock hostel data for demo
const mockHostels: Record<string, HostelOption[]> = {
  "Antigua": [
    { id: "1", name: "Earth Lodge", image: "/hostels/earth-lodge.jpg", rating: 4.8, reviews: 342, price: 12, currency: "USD", roomType: "8-bed mixed dorm", amenities: ["Mountain Views", "Yoga", "Hiking"], distance: "15min from center", availability: "medium" },
    { id: "2", name: "Tropicana Hostel", image: "/hostels/los-patios.jpg", rating: 4.5, reviews: 892, price: 10, currency: "USD", roomType: "6-bed dorm", amenities: ["Pool", "Bar", "Tours"], distance: "5min from Parque Central", availability: "high" },
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
    { id: "d2", name: "Backpackers Inn", image: "/hostels/los-patios.jpg", rating: 4.2, reviews: 320, price: 12, currency: "USD", roomType: "8-bed dorm", amenities: ["Budget", "Social"], distance: "Near bus station", availability: "high" },
    { id: "d3", name: "Nomad's Lodge", image: "/hostels/free-cerveza.jpg", rating: 4.4, reviews: 410, price: 15, currency: "USD", roomType: "6-bed dorm", amenities: ["Fast WiFi", "Kitchen"], distance: "Old town", availability: "medium" },
  ],
};

function getHostelsForCity(city: string): HostelOption[] {
  return mockHostels[city] || mockHostels["default"];
}

export function StopDetailSheet() {
  const { trip, selectedStop, setSelectedStop, updateStopBooking, setSubPage } = useTrip();
  const [showHostels, setShowHostels] = useState(false);

  if (!selectedStop) return null;

  const hostels = getHostelsForCity(selectedStop.city);
  const isBooked = selectedStop.bookingStatus === "booked";
  const isPending = selectedStop.bookingStatus === "pending";
  const stopIndex = getStopIndex(trip, selectedStop.id);

  const handleBookHostel = (hostel: HostelOption) => {
    updateStopBooking(selectedStop.id, "booked");
    setShowHostels(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-3 flex items-start justify-between border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                isBooked ? "bg-[#10B981]" : isPending ? "bg-[#FF6B9D]" : "bg-primary"
              )}>
                {stopIndex}
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedStop.city}</h2>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold",
                  isBooked && "bg-[#10B981]/10 border-[#10B981] text-[#10B981]",
                  isPending && "bg-[#FF6B9D]/10 border-[#FF6B9D] text-[#FF6B9D]",
                  !isBooked && !isPending && "bg-primary/10 border-primary text-primary"
                )}
              >
                {isBooked ? "Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {selectedStop.country}
              {selectedStop.weather && (
                <>
                  <span className="mx-2 text-muted-foreground/40">|</span>
                  <Cloud className="w-3.5 h-3.5" />
                  {selectedStop.weather}
                </>
              )}
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

          {/* Highlight */}
          {selectedStop.highlight && (
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-3">
              <p className="text-[#10B981] font-semibold text-sm">{selectedStop.highlight}</p>
            </div>
          )}
          
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
            <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-3">
              <div className="flex items-center gap-2 text-[#10B981] font-medium text-sm mb-2">
                <Lightbulb className="w-4 h-4" />
                Traveller Tips
              </div>
              <ul className="space-y-1.5">
                {selectedStop.communityTips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-[#10B981]">-</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Current Booking */}
          {isBooked && selectedStop.hostelName && (
            <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <span className="font-semibold text-foreground">Hostel Booked</span>
              </div>
              <div className="flex gap-3">
                {selectedStop.hostelImage && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-muted">
                    <Image src={selectedStop.hostelImage || "/placeholder.svg"} alt={selectedStop.hostelName} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-foreground font-semibold">{selectedStop.hostelName}</p>
                  <p className="text-sm text-muted-foreground">{selectedStop.nights} nights</p>
                  {selectedStop.hostelPrice && (
                    <p className="text-lg font-bold text-[#10B981] mt-1">
                      ${selectedStop.hostelPrice * selectedStop.nights}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-3 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 bg-transparent"
                onClick={() => setSubPage("bookings")}
              >
                View Booking Details
                <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
              </Button>
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
                <div className="mt-3 space-y-3">
                  {hostels.map((hostel) => (
                    <div 
                      key={hostel.id}
                      className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
                    >
                      {/* Hostel Image */}
                      <div className="relative h-32 bg-muted">
                        <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
                        <Badge className={cn(
                          "absolute top-2 right-2 text-[10px] font-semibold",
                          hostel.availability === "high" && "bg-[#10B981]",
                          hostel.availability === "medium" && "bg-[#FF6B9D]",
                          hostel.availability === "low" && "bg-primary"
                        )}>
                          {hostel.availability === "high" ? "Available" : hostel.availability === "medium" ? "Few Left" : "Almost Full"}
                        </Badge>
                      </div>
                      
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{hostel.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1 text-sm">
                                <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                                {hostel.rating}
                              </span>
                              <span className="text-xs text-muted-foreground">({hostel.reviews} reviews)</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPinned className="w-3 h-3" />
                              {hostel.distance}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">${hostel.price}</p>
                            <p className="text-[10px] text-muted-foreground">per night</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {hostel.amenities.slice(0, 3).map(amenity => (
                            <span key={amenity} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full mt-3 bg-primary hover:bg-primary/90 text-white font-semibold" 
                          size="sm"
                          onClick={() => handleBookHostel(hostel)}
                        >
                          Book Now
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
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
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" onClick={() => setShowHostels(true)}>
              <Bed className="w-4 h-4 mr-2" />
              {isPending ? "Confirm Booking" : "Explore & Book Hostels"}
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
