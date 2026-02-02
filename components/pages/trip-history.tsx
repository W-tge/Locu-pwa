"use client";

import { useTrip } from "@/lib/trip-context";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Route,
} from "lucide-react";

// Demo past trips
const pastTrips = [
  {
    id: "1",
    name: "Southeast Asia Explorer",
    startDate: "Nov 2023",
    endDate: "Jan 2024",
    countries: ["Thailand", "Vietnam", "Cambodia", "Laos"],
    totalDays: 68,
    status: "completed" as const,
  },
  {
    id: "2", 
    name: "Central America Loop",
    startDate: "Jun 2023",
    endDate: "Aug 2023",
    countries: ["Mexico", "Guatemala", "Belize"],
    totalDays: 45,
    status: "completed" as const,
  },
];

export function TripHistory() {
  const { setSubPage } = useTrip();

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
          <h1 className="text-xl font-bold">Trip History</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current trip indicator */}
        <div className="bg-gradient-to-r from-primary/10 to-[#FF6B9D]/10 rounded-2xl border border-primary/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-white">Active</Badge>
            <h3 className="font-bold text-foreground">Andes Overland Circuit</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Mar 2024 - Present
            </div>
            <div className="flex items-center gap-1">
              <Route className="w-3.5 h-3.5" />
              Day 45 of 90
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm">Peru, Bolivia, Chile, Argentina</span>
          </div>
        </div>

        {/* Past trips */}
        <h2 className="font-semibold text-foreground pt-2">Past Adventures</h2>
        {pastTrips.map((trip) => (
          <div key={trip.id} className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{trip.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {trip.startDate} - {trip.endDate}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {trip.totalDays} days
              </Badge>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {trip.countries.map((country, i) => (
                  <span key={country} className="text-sm text-muted-foreground">
                    {country}{i < trip.countries.length - 1 && ","}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-sm text-primary font-medium mt-3 hover:underline">
              View Trip Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
