"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useTrip } from "@/lib/trip-context";
import { TripMap } from "./trip-map";
import { ItineraryPanel } from "./itinerary-panel";
import { cn } from "@/lib/utils";
import { Map, List, ChevronUp, ChevronDown } from "lucide-react";

export function JourneyView() {
  const { trip } = useTrip();
  const [mobileView, setMobileView] = useState<"map" | "itinerary" | "split">("split");
  const [mapHeight, setMapHeight] = useState(60); // Percentage of screen for map
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag to resize map on mobile
  const handleDragStart = () => setIsDragging(true);
  
  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const percentage = ((clientY - rect.top) / rect.height) * 100;
    setMapHeight(Math.min(80, Math.max(30, percentage)));
  };

  const handleDragEnd = () => setIsDragging(false);

  // Quick actions for mobile
  const expandMap = () => setMapHeight(80);
  const expandItinerary = () => setMapHeight(30);
  const resetSplit = () => setMapHeight(50);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background">
      {/* Desktop Layout: Left Itinerary + Right Map */}
      
      {/* Left Itinerary Panel - Desktop only */}
      <div className="hidden lg:flex w-[420px] shrink-0 border-r border-border">
        <ItineraryPanel />
      </div>

      {/* Right Map - Desktop */}
      <div className="hidden lg:block flex-1">
        <TripMap />
      </div>

      {/* Mobile Layout: Split view with draggable divider */}
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
          
          {/* Quick expand map button */}
          {mapHeight < 70 && (
            <button 
              onClick={expandMap}
              className="absolute bottom-2 right-2 z-[999] p-2 bg-card/95 backdrop-blur-md rounded-full shadow-lg border border-border/50"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Draggable Divider */}
        <div 
          className={cn(
            "h-6 shrink-0 flex items-center justify-center cursor-ns-resize bg-card border-y border-border touch-none select-none",
            isDragging && "bg-muted"
          )}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-1 rounded-full bg-border" />
            <span className="text-[10px] text-muted-foreground font-medium">Drag to resize</span>
          </div>
        </div>

        {/* Itinerary Section */}
        <div 
          className="flex-1 overflow-hidden relative"
          style={{ height: `${100 - mapHeight - 3}%` }}
        >
          <ItineraryPanel />
          
          {/* Quick expand itinerary button */}
          {mapHeight > 40 && (
            <button 
              onClick={expandItinerary}
              className="absolute top-2 right-2 z-[999] p-2 bg-card/95 backdrop-blur-md rounded-full shadow-lg border border-border/50"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
