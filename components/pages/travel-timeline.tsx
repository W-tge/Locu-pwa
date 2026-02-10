"use client";

import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bus,
  Anchor,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TravelTimeline() {
  const { trip, setSubPage } = useTrip();

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "ferry":
      case "boat":
        return <Anchor className="w-5 h-5" />;
      default:
        return <Bus className="w-5 h-5" />;
    }
  };

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
          <h1 className="text-xl font-bold">Travel Timeline</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {trip.transitLegs.map((leg) => {
          const fromStop = trip.stops.find(s => s.id === leg.fromStopId);
          const toStop = trip.stops.find(s => s.id === leg.toStopId);
          if (!fromStop || !toStop) return null;

          const isBooked = leg.bookingStatus === "booked";
          const isPending = leg.bookingStatus === "pending";

          // Calculate approximate date based on stop position
          const fromIndex = trip.stops.findIndex(s => s.id === leg.fromStopId);
          const baseDate = new Date("2024-03-24");
          let daysOffset = 0;
          for (let i = 0; i < fromIndex; i++) {
            daysOffset += trip.stops[i].nights;
          }
          const departureDate = new Date(baseDate);
          departureDate.setDate(departureDate.getDate() + daysOffset + fromStop.nights);

          return (
            <div key={leg.id} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start gap-4">
                {/* Transport icon */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isBooked ? "bg-[#00D4AA]/10 text-[#00D4AA]" : 
                  isPending ? "bg-[#FF6B9D]/10 text-[#FF6B9D]" : 
                  "bg-primary/10 text-primary"
                )}>
                  {getTransportIcon(leg.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">
                    {fromStop.city}, {fromStop.country} - {toStop.city}, {toStop.country}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {departureDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {leg.departureTime || "TBD"}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {leg.duration}
                  </p>
                </div>

                {/* Status */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-medium text-foreground">
                    {toStop.nights} days
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-xs mt-1 justify-end",
                    isBooked ? "text-[#00D4AA]" : isPending ? "text-[#FF6B9D]" : "text-primary"
                  )}>
                    {isBooked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span className={isBooked ? "" : "font-medium"}>
                      {isBooked ? "confirmed" : isPending ? "pending" : "book now"}
                    </span>
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
