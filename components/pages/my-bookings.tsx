"use client";

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { formatDateRange } from "@/lib/trip-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Bed,
  Bus,
  Anchor,
  Train,
  Plane,
  Truck,
  Edit3,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// --------------- helpers ---------------
const bookingImages: Record<string, string> = {
  Antigua: "/hostels/antigua-hostel.jpg",
  "San Pedro": "/hostels/free-cerveza.jpg",
  Flores: "/hostels/flores-hostel.jpg",
  Granada: "/hostels/granada-hostel.jpg",
  Medellin: "/hostels/selina-medellin.jpg",
  Salento: "/hostels/los-patios.jpg",
  Quito: "/hostels/quito-hostel.jpg",
  Cusco: "/hostels/cusco-hostel.jpg",
};

function getBookingImage(location: string): string {
  for (const [key, value] of Object.entries(bookingImages)) {
    if (location.includes(key)) return value;
  }
  return "/hostels/earth-lodge.jpg";
}

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry":
      return Anchor;
    case "train":
      return Train;
    case "jeep":
      return Truck;
    case "flight":
      return Plane;
    default:
      return Bus;
  }
}

type Tab = "all" | "hostels" | "transport";

// --------------- component ---------------
export function MyBookings() {
  const { trip, setSubPage, setSelectedStop, setSelectedLeg } = useTrip();
  const { showToast } = useLocuToast();
  const [tab, setTab] = useState<Tab>("all");

  // Derive live data from trip state
  const bookedStops = trip.stops.filter((s) => s.bookingStatus === "booked");
  const unbookedStops = trip.stops.filter((s) => s.bookingStatus !== "booked");
  const bookedLegs = trip.transitLegs.filter((l) => l.bookingStatus === "booked");
  const unbookedLegs = trip.transitLegs.filter((l) => l.bookingStatus !== "booked");

  const totalBookings = bookedStops.length + bookedLegs.length;
  const totalSpent =
    bookedStops.reduce((acc, s) => acc + (s.hostelPrice || 0) * s.nights, 0) +
    bookedLegs.reduce((acc, l) => acc + (l.price || 0), 0);

  // Tab filtering
  const showHostels = tab === "all" || tab === "hostels";
  const showTransport = tab === "all" || tab === "transport";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-black/5 glass-panel px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubPage(null)}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-lg text-foreground">My Bookings</h1>
            <p className="text-xs text-muted-foreground">
              {totalBookings} confirmed &middot; ${totalSpent} total
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mt-3">
          {(["all", "hostels", "transport"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize",
                tab === t
                  ? "gradient-vibrant text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {t === "all" ? `All (${totalBookings})` : t === "hostels" ? `Hostels (${bookedStops.length})` : `Transport (${bookedLegs.length})`}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* ---- Confirmed Hostel Bookings ---- */}
        {showHostels && bookedStops.length > 0 && (
          <section className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bed className="w-3.5 h-3.5 text-[#10B981]" />
              Hostel Bookings ({bookedStops.length})
            </h2>
            <div className="space-y-3">
              {bookedStops.map((stop) => (
                <div
                  key={stop.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-28 sm:w-36 relative shrink-0">
                      <Image
                        src={stop.hostelImage || getBookingImage(stop.city)}
                        alt={stop.hostelName || stop.city}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-[#10B981] text-white text-[10px] shadow-sm">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" />
                          Confirmed
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {stop.hostelName || "Accommodation"}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{stop.city}, {stop.country}</span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {formatDateRange(stop.startDate, stop.endDate)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-mono font-bold text-primary text-sm">
                            ${(stop.hostelPrice || 0) * stop.nights}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">
                            {stop.nights}n @ ${stop.hostelPrice}/n
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 text-[11px] px-2.5 gradient-vibrant text-white"
                            onClick={() => {
                              setSelectedStop(stop);
                              setSubPage("bookingDetails");
                            }}
                          >
                            Details
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] px-2.5 bg-transparent"
                            onClick={() => {
                              setSelectedStop(stop);
                              setSubPage("modifyBooking");
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---- Confirmed Transport Bookings ---- */}
        {showTransport && bookedLegs.length > 0 && (
          <section className="p-4 pt-0">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bus className="w-3.5 h-3.5 text-[#10B981]" />
              Transport Bookings ({bookedLegs.length})
            </h2>
            <div className="space-y-3">
              {bookedLegs.map((leg) => {
                const fromStop = trip.stops.find((s) => s.id === leg.fromStopId);
                const toStop = trip.stops.find((s) => s.id === leg.toStopId);
                const Icon = getTransportIcon(leg.type);
                return (
                  <div
                    key={leg.id}
                    className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {fromStop?.city} to {toStop?.city}
                          </h3>
                          <Badge className="bg-[#10B981] text-white text-[10px] shrink-0 ml-2">
                            Confirmed
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                          {leg.operator && (
                            <span className="flex items-center gap-1">
                              <Icon className="w-3 h-3" /> {leg.operator}
                            </span>
                          )}
                          {leg.departureTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {leg.departureTime}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {leg.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-border">
                      <span className="font-mono font-bold text-primary">${leg.price}</span>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 text-[11px] px-2.5 gradient-vibrant text-white"
                          onClick={() => {
                            setSelectedLeg(leg);
                            setSubPage("transitBookingDetails");
                          }}
                        >
                          Details
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2.5 bg-transparent"
                          onClick={() => {
                            setSelectedLeg(leg);
                            setSubPage("modifyBooking");
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---- Needs Booking Section ---- */}
        {showHostels && unbookedStops.length > 0 && (
          <section className="p-4 pt-0">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              Needs Booking ({unbookedStops.length} hostels, {unbookedLegs.length} transport)
            </h2>

            <div className="space-y-2">
              {unbookedStops.slice(0, 4).map((stop) => (
                <div
                  key={stop.id}
                  className="bg-card rounded-xl border border-[#F59E0B]/20 p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg relative shrink-0 overflow-hidden">
                    <Image
                      src={getBookingImage(stop.city) || "/placeholder.svg"}
                      alt={stop.city}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{stop.city}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDateRange(stop.startDate, stop.endDate)} &middot; {stop.nights}n
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 text-[11px] px-2.5 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white shrink-0"
                    onClick={() => {
                      setSelectedStop(stop);
                      setSubPage("hostelDetails");
                    }}
                  >
                    <Bed className="w-3 h-3 mr-1" />
                    Book
                  </Button>
                </div>
              ))}

              {unbookedStops.length > 4 && (
                <button
                  onClick={() => setSubPage(null)}
                  className="w-full py-2.5 text-xs text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors"
                >
                  View all {unbookedStops.length} destinations needing booking
                </button>
              )}
            </div>
          </section>
        )}

        {/* Empty state */}
        {totalBookings === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bed className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg text-foreground mb-1">No Bookings Yet</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Start exploring hostels and transport options to build your itinerary.
            </p>
            <Button
              onClick={() => setSubPage(null)}
              className="mt-4 gradient-vibrant text-white"
            >
              Explore Destinations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
