"use client";

import React from "react";
import { useState, useRef } from "react";
import { useTrip } from "@/lib/trip-context";
import { TripMap } from "./trip-map";
import { ItineraryPanel } from "./itinerary-panel";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

export function JourneyView() {
  const { trip } = useTrip();
  const [mapHeight, setMapHeight] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => setIsDragging(true);

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const percentage = ((clientY - rect.top) / rect.height) * 100;
    setMapHeight(Math.min(80, Math.max(30, percentage)));
  };

  const handleDragEnd = () => setIsDragging(false);
  const expandMap = () => setMapHeight(80);
  const expandItinerary = () => setMapHeight(30);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background paper-texture">
      {/* Desktop: Left Itinerary + Right Map */}
      <div className="hidden lg:flex w-[420px] shrink-0 border-r border-black/5">
        <ItineraryPanel />
      </div>
      <div className="hidden lg:block flex-1 relative">
        <TripMap />
      </div>

      {/* Mobile: Split view with draggable divider */}
      <div
        ref={containerRef}
        className="lg:hidden flex-1 flex flex-col h-full overflow-hidden"
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDrag}
        onTouchEnd={handleDragEnd}
      >
        {/* Map Section */}
        <div
          className="shrink-0 relative transition-all duration-200"
          style={{ height: `${mapHeight}%` }}
        >
          <TripMap />

          {mapHeight < 70 && (
            <button
              onClick={expandMap}
              className="absolute bottom-2 right-2 z-20 p-2 glass-panel rounded-full paper-shadow"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Draggable Divider */}
        <div
          className={cn(
            "h-6 shrink-0 flex items-center justify-center cursor-ns-resize glass-panel border-y border-black/5 touch-none select-none",
            isDragging && "bg-[#F0EDE4]/90"
          )}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-1 rounded-full bg-border" />
            <span className="text-[10px] text-muted-foreground font-medium">
              Drag to resize
            </span>
          </div>
        </div>

        {/* Itinerary Section */}
        <div
          className="flex-1 overflow-hidden relative"
          style={{ height: `${100 - mapHeight - 3}%` }}
        >
          <ItineraryPanel />

          {mapHeight > 40 && (
            <button
              onClick={expandItinerary}
              className="absolute top-2 right-2 z-20 p-2 glass-panel rounded-full paper-shadow"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
