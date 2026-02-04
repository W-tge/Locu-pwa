"use client";

import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Bed,
  Bus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample booking images
const bookingImages: Record<string, string> = {
  "Antigua": "/hostels/antigua-hostel.jpg",
  "San Pedro": "/hostels/free-cerveza.jpg",
  "Flores": "/hostels/flores-hostel.jpg",
  "Granada": "/hostels/granada-hostel.jpg",
  "Medellin": "/hostels/selina-medellin.jpg",
  "Salento": "/hostels/los-patios.jpg",
  "Quito": "/hostels/quito-hostel.jpg",
  "Cusco": "/hostels/cusco-hostel.jpg",
};

function getBookingImage(location: string): string {
  for (const [key, value] of Object.entries(bookingImages)) {
    if (location.includes(key)) return value;
  }
  return "/hostels/earth-lodge.jpg";
}

export function MyBookings() {
  const { bookings, trip, setSubPage, setSelectedStop } = useTrip();

  // Get pending stops (need booking)
  const pendingStops = trip.stops.filter(s => s.bookingStatus !== "booked");

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <h1 className="text-xl font-bold">My Bookings</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Confirmed Bookings Section */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            Confirmed Bookings ({bookings.filter(b => b.status === "confirmed").length})
          </h2>
          
          <div className="space-y-3">
            {bookings.filter(b => b.status === "confirmed").map((booking) => (
              <div key={booking.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="flex">
                  {/* Image */}
                  <div className="w-28 h-28 relative flex-shrink-0">
                    <Image
                      src={getBookingImage(booking.location) || "/placeholder.svg"}
                      alt={booking.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{booking.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {booking.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {booking.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">${booking.price}</span>
                        <div className="flex items-center gap-1 text-xs mt-1 text-[#10B981]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent">
                        Modify
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Bookings Section */}
        {pendingStops.length > 0 && (
          <div className="p-4 pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              Needs Booking ({pendingStops.length} destinations)
            </h2>
            
            <div className="space-y-3">
              {pendingStops.slice(0, 5).map((stop) => (
                <div 
                  key={stop.id} 
                  className="bg-card rounded-2xl border border-[#F59E0B]/30 overflow-hidden"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-28 h-28 relative flex-shrink-0">
                      <Image
                        src={getBookingImage(stop.city) || "/placeholder.svg"}
                        alt={stop.city}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground">{stop.city}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {stop.country}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs">
                          {stop.nights} nights
                        </Badge>
                      </div>
                      
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedStop(stop);
                          setSubPage("hostelDetails");
                        }}
                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-white text-xs h-8"
                      >
                        <Bed className="w-3.5 h-3.5 mr-1" />
                        Browse Hostels
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingStops.length > 5 && (
                <button 
                  onClick={() => setSubPage(null)}
                  className="w-full py-3 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
                >
                  View all {pendingStops.length} pending destinations
                </button>
              )}
            </div>
          </div>
        )}

        {/* Transit Bookings */}
        <div className="p-4 pt-2">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Bus className="w-4 h-4 text-primary" />
            Transport Bookings
          </h2>
          
          <div className="space-y-3">
            {trip.transitLegs.filter(l => l.bookingStatus === "booked").slice(0, 3).map((leg) => {
              const fromStop = trip.stops.find(s => s.id === leg.fromStopId);
              const toStop = trip.stops.find(s => s.id === leg.toStopId);
              
              return (
                <div key={leg.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <Bus className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{fromStop?.city} to {toStop?.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {leg.operator} • {leg.departureTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#10B981]">${leg.price}</p>
                      <Badge className="bg-[#10B981]/10 text-[#10B981] text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Booked
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {trip.transitLegs.filter(l => l.bookingStatus !== "booked").length > 0 && (
              <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {trip.transitLegs.filter(l => l.bookingStatus !== "booked").length} routes need booking
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Book early for best prices
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSubPage(null)}
                    className="bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white text-xs"
                  >
                    View All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
