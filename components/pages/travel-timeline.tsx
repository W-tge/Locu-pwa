"use client";

import { useTrip } from "@/lib/trip-context";
import { ArrowLeft } from "lucide-react";
import { TripTimeline } from "@/components/trip-timeline";
import Image from "next/image";

export function TravelTimeline() {
  const { setSubPage } = useTrip();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Image src="/locu-logo.png" alt="Locu" width={60} height={24} className="h-6 w-auto" />
          <h1 className="text-xl font-bold font-serif">Travel Scrapbook</h1>
        </div>
      </header>

      {/* Scrapbook timeline body */}
      <div className="flex-1 overflow-hidden">
        <TripTimeline />
      </div>
    </div>
  );
}
