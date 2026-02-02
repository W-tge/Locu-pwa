"use client";

import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MyBookings() {
  const { bookings, setSubPage } = useTrip();

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
          <h1 className="text-xl font-bold">My Bookings</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex">
              {/* Image placeholder */}
              <div className="w-28 h-28 bg-muted flex-shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-border" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{booking.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {booking.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">${booking.price}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs mt-1",
                      booking.status === "confirmed" ? "text-[#00D4AA]" : "text-[#FF6B9D]"
                    )}>
                      {booking.status === "confirmed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent">
                    Modify
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
