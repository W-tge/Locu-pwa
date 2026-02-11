"use client";

import React from "react";
import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { TripMap } from "./trip-map";
import { ItineraryPanel } from "./itinerary-panel";
import { cn } from "@/lib/utils";
import { Map, List } from "lucide-react";

export function JourneyView() {
  const { trip } = useTrip();
  // Mobile: "map" shows map full-screen with small itinerary peek, "itinerary" shows itinerary over map
  const [mobileView, setMobileView] = useState<"map" | "itinerary">("map");

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background paper-texture">
      {/* Desktop: Left Itinerary + Right Map */}
      <div className="hidden lg:flex w-[420px] shrink-0 border-r border-black/5">
        <ItineraryPanel />
      </div>
      <div className="hidden lg:block flex-1 relative">
        <TripMap />
      </div>

      {/* Mobile: Tap-to-toggle between map and itinerary */}
      <div className="lg:hidden flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Map - always rendered, full height */}
        <div className="absolute inset-0">
          <TripMap />
        </div>

        {/* Itinerary overlay - slides up from bottom when active */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-30 transition-transform duration-300 ease-in-out",
            mobileView === "itinerary" ? "translate-y-0" : "translate-y-[calc(100%-56px)]"
          )}
          style={{ height: "85%" }}
        >
          {/* Tap bar - always visible at top of the overlay */}
          <button
            onClick={() => setMobileView(mobileView === "itinerary" ? "map" : "itinerary")}
            className="w-full h-14 glass-panel border-t border-black/5 rounded-t-2xl flex items-center justify-center gap-2 active:bg-muted/60 transition-colors"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-1 rounded-full bg-border mb-1.5" />
              <span className="text-xs font-semibold text-muted-foreground">
                {mobileView === "itinerary" ? "Tap to show map" : "Tap to show itinerary"}
              </span>
            </div>
          </button>

          {/* Itinerary content */}
          <div className="flex-1 h-[calc(100%-56px)] bg-background overflow-hidden">
            <ItineraryPanel />
          </div>
        </div>

        {/* Floating toggle button - visible when map is in focus */}
        {mobileView === "map" && (
          <button
            onClick={() => setMobileView("itinerary")}
            className="absolute bottom-20 left-4 z-20 glass-panel rounded-full px-4 py-2.5 paper-shadow flex items-center gap-2 active:scale-95 transition-transform"
          >
            <List className="w-4 h-4 text-foreground" />
            <span className="text-xs font-semibold text-foreground">Itinerary</span>
          </button>
        )}

        {/* Floating map button - visible when itinerary is in focus */}
        {mobileView === "itinerary" && (
          <button
            onClick={() => setMobileView("map")}
            className="absolute top-4 right-4 z-40 glass-panel rounded-full px-4 py-2.5 paper-shadow flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Map className="w-4 h-4 text-foreground" />
            <span className="text-xs font-semibold text-foreground">Map</span>
          </button>
        )}
      </div>
    </div>
  );
}
