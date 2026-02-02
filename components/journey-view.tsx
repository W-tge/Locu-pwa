"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { getBookingStats, getTripDuration } from "@/lib/trip-data";
import { TripMap } from "./trip-map";
import { TripTimeline } from "./trip-timeline";
import { cn } from "@/lib/utils";
import { Map, List, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function JourneyView() {
  const { trip } = useTrip();
  const [viewMode, setViewMode] = useState<"split" | "map" | "timeline">(
    "split"
  );

  const stats = getBookingStats(trip);
  const duration = getTripDuration(trip);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Compact Header */}
      <div className="shrink-0 px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {trip.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {trip.userStatus}
              </span>
              <span className="opacity-50">|</span>
              <span>Day {trip.currentDay}</span>
            </div>
          </div>

          {/* View toggles */}
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "map"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              aria-label="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === "split"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              aria-label="Split view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <Badge variant="secondary" className="font-normal">
            {duration} days
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {stats.total} stops
          </Badge>
          <Badge
            variant="outline"
            className="font-normal bg-success/10 border-success/30 text-success"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {stats.booked}/{stats.total} booked
          </Badge>
        </div>
      </div>

      {/* Content - Map is the HERO */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "split" && (
          <div className="h-full flex flex-col">
            {/* Map Section - HERO (65% on mobile, larger on desktop) */}
            <div className="h-[60%] lg:h-[65%] min-h-[300px]">
              <TripMap />
            </div>
            {/* Timeline Section - Compact scrollable list */}
            <div className="flex-1 border-t border-border overflow-hidden">
              <TripTimeline compact />
            </div>
          </div>
        )}

        {viewMode === "map" && (
          <div className="h-full">
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
