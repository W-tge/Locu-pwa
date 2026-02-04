"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { getTripDuration, getBookingStats, Stop, TransitLeg, Insight } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Bus,
  Ship,
  Car,
  Train,
  AlertTriangle,
  Lightbulb,
  FileText,
  Users,
  Settings,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Umbrella,
} from "lucide-react";

// Transport icon mapping
const transportIcons: Record<string, React.ElementType> = {
  bus: Bus,
  ferry: Ship,
  boat: Ship,
  jeep: Car,
  shuttle: Car,
  train: Train,
  colectivo: Bus,
};

// Status colors - vibrant palette without purple
const statusColors = {
  booked: {
    badge: "bg-[#10B981] text-white",
    border: "border-l-[#10B981]",
    dot: "bg-[#10B981]",
    text: "text-[#10B981]",
  },
  pending: {
    badge: "bg-[#F59E0B] text-white",
    border: "border-l-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    text: "text-[#F59E0B]",
  },
  "not-booked": {
    badge: "bg-primary text-white",
    border: "border-l-primary",
    dot: "bg-primary",
    text: "text-primary",
  },
};

// Format date range
function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export function ItineraryPanel() {
  const { trip, setSelectedStop, setSelectedLeg, setSubPage } = useTrip();
  const duration = getTripDuration(trip);
  const stats = getBookingStats(trip);
  const [expandedTransit, setExpandedTransit] = useState<string | null>(null);

  // Build chronological timeline items
  type TimelineItem = 
    | { type: "stop"; data: Stop; index: number }
    | { type: "transit"; data: TransitLeg }
    | { type: "insight"; data: Insight }
    | { type: "alert"; data: any; stopCity: string };

  const timelineItems: TimelineItem[] = [];
  
  trip.stops.forEach((stop, index) => {
    // Add stop card
    timelineItems.push({
      type: "stop",
      data: stop,
      index: index + 1,
    });

    // Add booking alert if exists
    if (stop.bookingAlert) {
      timelineItems.push({
        type: "alert",
        data: stop.bookingAlert,
        stopCity: stop.city,
      });
    }

    // Add transit leg after stop (if exists)
    const transitLeg = trip.transitLegs.find(
      (leg) => leg.fromStopId === stop.id
    );
    if (transitLeg) {
      timelineItems.push({
        type: "transit",
        data: transitLeg,
      });

      // Add transit alerts
      if (transitLeg.alert) {
        timelineItems.push({
          type: "alert",
          data: transitLeg.alert,
          stopCity: stop.city,
        });
      }
    }
  });

  // Add trip-level insights
  if (trip.insights) {
    trip.insights.forEach((insight) => {
      // Find position based on related stop
      const insertIndex = timelineItems.findIndex(
        (item) => item.type === "stop" && (item.data as Stop).id === insight.relatedStopId
      );
      if (insertIndex > -1) {
        timelineItems.splice(insertIndex + 1, 0, { type: "insight", data: insight });
      }
    });
  }

  // Get stop details from ID
  const getStopById = (id: string) => trip.stops.find((s) => s.id === id);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Trip Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">{trip.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {trip.description} &bull; {duration} days
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {stats.total} stops
          </Badge>
          <Badge className={cn("text-xs", statusColors.booked.badge)}>
            {stats.booked} booked
          </Badge>
          {stats.pending > 0 && (
            <Badge className={cn("text-xs", statusColors.pending.badge)}>
              {stats.pending} pending
            </Badge>
          )}
          {stats.notBooked > 0 && (
            <Badge className={cn("text-xs", statusColors["not-booked"].badge)}>
              {stats.notBooked} to book
            </Badge>
          )}
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {timelineItems.map((item, i) => {
          if (item.type === "stop") {
            const stop = item.data as Stop;
            const status = stop.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];

            return (
              <div
                key={`stop-${stop.id}`}
                className={cn(
                  "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
                  "border-l-4",
                  colors.border
                )}
              >
                <div className="p-4">
                  {/* Stop Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Stop Number */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0",
                          colors.dot
                        )}
                      >
                        {item.index}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {stop.city}, {stop.country}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                          <span>&bull;</span>
                          <span>{stop.nights} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge className={cn("text-xs shrink-0", colors.badge)}>
                      {status === "booked" && <><CheckCircle2 className="w-3 h-3 mr-1" /> Hostel Booked</>}
                      {status === "pending" && "Pending"}
                      {status === "not-booked" && "Needs Booking"}
                    </Badge>
                  </div>

                  {/* Booked Hostel Card */}
                  {status === "booked" && stop.hostelName && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex gap-3">
                        {stop.hostelImage ? (
                          <Image
                            src={stop.hostelImage || "/placeholder.svg"}
                            alt={stop.hostelName}
                            width={80}
                            height={60}
                            className="w-20 h-15 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-20 h-15 rounded-md bg-muted flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {stop.hostelName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stop.nights} nights
                          </p>
                          <p className="text-sm font-semibold text-[#10B981] mt-1">
                            ${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}
                          </p>
                          <button
                            onClick={() => setSelectedStop(stop)}
                            className="text-xs text-primary hover:underline mt-1"
                          >
                            Click to view details
                          </button>
                        </div>
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors self-start">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Not Booked CTA */}
                  {status !== "booked" && (
                    <Button
                      onClick={() => setSelectedStop(stop)}
                      className="w-full mt-3 bg-primary hover:bg-primary/90"
                    >
                      Explore & Book Hostels
                    </Button>
                  )}
                </div>
              </div>
            );
          }

          if (item.type === "transit") {
            const leg = item.data as TransitLeg;
            const status = leg.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];
            const Icon = transportIcons[leg.type] || Bus;
            const isExpanded = expandedTransit === leg.id;
            const fromStop = getStopById(leg.fromStopId);
            const toStop = getStopById(leg.toStopId);

            return (
              <div
                key={`transit-${leg.id}`}
                className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", `${colors.dot}/20`)}>
                        <Icon className={cn("w-4 h-4", colors.text)} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {fromStop?.city || "Unknown"} to {toStop?.city || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {leg.duration} {leg.departureTime && `• Departs ${leg.departureTime}`}
                        </p>
                      </div>
                    </div>

                    <Badge className={cn("text-xs", colors.badge)}>
                      {status === "booked" ? "Booked" : status === "pending" ? "Pending" : "Needs Booking"}
                    </Badge>
                  </div>

                  {/* Expandable Transport Options */}
                  <button
                    onClick={() => setExpandedTransit(isExpanded ? null : leg.id)}
                    className="flex items-center justify-between w-full mt-3 px-3 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <span>View Transport Options ({leg.transportOptions?.length || 1})</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && leg.transportOptions && (
                    <div className="mt-3 space-y-2">
                      {leg.transportOptions.map((option, oi) => {
                        // Determine smart tags
                        const isCheapest = option.price === Math.min(...leg.transportOptions!.map(o => o.price));
                        const isFastest = option.duration === leg.transportOptions!.reduce((min, o) => 
                          !min || (parseInt(o.duration) < parseInt(min)) ? o.duration : min, "");
                        const isRecommended = oi === 0;
                        
                        return (
                          <div
                            key={oi}
                            className={cn(
                              "p-3 border rounded-lg transition-colors cursor-pointer",
                              isRecommended 
                                ? "border-primary/50 bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => {
                              setSelectedLeg(leg);
                              setSubPage("transportBooking");
                            }}
                          >
                            {/* Smart Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {isRecommended && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                                  Locu Pick
                                </span>
                              )}
                              {isCheapest && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-semibold">
                                  Cheapest
                                </span>
                              )}
                              {isFastest && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-semibold">
                                  Fastest
                                </span>
                              )}
                              {option.verifiedCount && option.verifiedCount > 20 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-semibold">
                                  Top Rated
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{option.operator}</p>
                                <p className="text-xs text-muted-foreground">
                                  {option.departureTime} &bull; {option.duration}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary">${option.price}</p>
                                {option.seatsLeft && option.seatsLeft < 10 && (
                                  <p className="text-[10px] text-[#F59E0B]">{option.seatsLeft} seats left</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isExpanded && !leg.transportOptions && (
                    <div className="mt-3 p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{leg.operator || "Local Operator"}</p>
                          <p className="text-xs text-muted-foreground">
                            {leg.departureTime || "Various times"} &bull; {leg.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          {leg.price && <p className="font-semibold text-primary">${leg.price}</p>}
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedLeg(leg)}
                        size="sm"
                        className="w-full mt-2 bg-primary hover:bg-primary/90"
                      >
                        Book This Route
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (item.type === "insight") {
            const insight = item.data as Insight;
            const iconMap: Record<string, React.ElementType> = {
              dollar: DollarSign,
              document: FileText,
              weather: Umbrella,
              health: AlertTriangle,
              safety: AlertTriangle,
            };
            const InsightIcon = iconMap[insight.icon] || Lightbulb;

            return (
              <div
                key={`insight-${insight.id}`}
                className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                    <InsightIcon className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {insight.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {insight.body}
                    </p>
                    {insight.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 mt-2 text-xs text-[#FBBF24] hover:bg-[#FBBF24]/10"
                        onClick={() => insight.actionUrl && window.open(insight.actionUrl, "_blank")}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === "alert") {
            const alert = item.data;
            const isUrgent = alert.style === "CRITICAL_INLINE_CARD";
            return (
              <div
                key={`alert-${i}`}
                className={cn(
                  "p-3 rounded-xl border",
                  isUrgent
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-primary/10 border-primary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isUrgent ? "bg-destructive/20" : "bg-primary/20"
                    )}
                  >
                    {isUrgent ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <Users className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.body}
                    </p>
                    {(alert.action || alert.podAction) && (
                      <Button
                        size="sm"
                        className={cn(
                          "h-7 mt-2 text-xs",
                          isUrgent
                            ? "bg-destructive hover:bg-destructive/90"
                            : "bg-primary hover:bg-primary/90"
                        )}
                      >
                        {alert.action || alert.podAction}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 p-4 border-t border-border bg-card">
        <Button
          onClick={() => setSubPage("social")}
          variant="outline"
          className="w-full h-12 text-base font-medium"
        >
          <Users className="w-5 h-5 mr-2" />
          Open Travel Pod
        </Button>
      </div>
    </div>
  );
}
