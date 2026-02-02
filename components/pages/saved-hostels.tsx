"use client";

import React from "react"

import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Wifi,
  Coffee,
  Beer,
  Home,
  Users,
} from "lucide-react";

const amenityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <Wifi className="w-3 h-3" />,
  Breakfast: <Coffee className="w-3 h-3" />,
  Bar: <Beer className="w-3 h-3" />,
  Rooftop: <Home className="w-3 h-3" />,
  Kitchen: <Home className="w-3 h-3" />,
  "Common Area": <Users className="w-3 h-3" />,
};

export function SavedHostels() {
  const { savedHostels, setSubPage } = useTrip();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    
    if (weeks > 0) return `Saved ${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `Saved ${days} day${days > 1 ? "s" : ""} ago`;
    return "Saved today";
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
          <span className="text-primary font-bold text-sm border border-primary rounded px-1.5">LOCU</span>
          <h1 className="text-xl font-bold">Saved Hostels</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Group by city */}
        {Array.from(new Set(savedHostels.map(h => h.city))).map((city) => (
          <div key={city}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">{city}, {savedHostels.find(h => h.city === city)?.country}</h2>
            </div>
            
            <div className="space-y-3">
              {savedHostels.filter(h => h.city === city).map((hostel) => (
                <div key={hostel.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="flex">
                    {/* Image placeholder */}
                    <div className="w-32 h-40 bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 flex items-center justify-center">
                      <Home className="w-8 h-8 text-muted-foreground" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground">{hostel.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                            <span className="font-semibold">{hostel.rating}</span>
                            <span className="text-sm text-muted-foreground">({hostel.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">${hostel.price}</span>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" />
                        {hostel.distance}
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {hostel.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-[10px] gap-1 py-0.5">
                            {amenityIcons[amenity]}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(hostel.savedAt)}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8">
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                          <Heart className="w-4 h-4 text-primary fill-primary" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
