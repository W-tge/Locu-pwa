"use client";

import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
} from "lucide-react";

export function SavedPlaces() {
  const { savedPlaces, setSubPage } = useTrip();
  const { showToast } = useLocuToast();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (months > 0) return `Saved ${months} month${months > 1 ? "s" : ""} ago`;
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
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <h1 className="text-xl font-bold">Saved Places</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {savedPlaces.map((place) => (
          <div key={place.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex">
              {/* Image placeholder */}
              <div className="w-32 h-36 bg-muted flex-shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-border" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4 relative">
                <button className="absolute top-4 right-4 text-primary">
                  <Heart className="w-5 h-5 fill-current" />
                </button>
                
                <h3 className="font-bold text-lg text-foreground pr-8">{place.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {place.city}, {place.country}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {place.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#FBBF24] fill-[#FBBF24]" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">{formatDate(place.savedAt)}</p>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8" onClick={() => showToast("Added to your itinerary!", "success")}>
                    Add to Trip
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent" onClick={() => showToast("Opening place details...", "info")}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
