"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { getBookingStats, getTripDuration } from "@/lib/trip-data";
import { TripMap } from "./trip-map";
import { TripTimeline } from "./trip-timeline";
import { cn } from "@/lib/utils";
import { Map, List, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function JourneyView() {
  const { trip } = useTrip();
  const [viewMode, setViewMode] = useState<"split" | "map" | "timeline">("split");
  
  const stats = getBookingStats(trip);
  const duration = getTripDuration(trip);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">{trip.name}</h1>
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "map" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "split" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "timeline" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="font-normal">
            {duration} days
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {stats.total} stops
          </Badge>
          <Badge variant="outline" className="font-normal bg-[#4ECDC4]/10 border-[#4ECDC4]/30 text-[#4ECDC4]">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {stats.booked}/{stats.total} booked
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "split" && (
          <div className="h-full flex flex-col lg:flex-row">
            {/* Map Section */}
            <div className="h-[40%] lg:h-full lg:w-1/2 p-2">
              <TripMap />
            </div>
            {/* Timeline Section */}
            <div className="h-[60%] lg:h-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-border">
              <TripTimeline />
            </div>
          </div>
        )}
        
        {viewMode === "map" && (
          <div className="h-full p-2">
            <TripMap />
          </div>
        )}
        
        {viewMode === "timeline" && (
          <div className="h-full">
            <TripTimeline />
          </div>
        )}
      </div>
    </div>
  );
}
