"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { getTripDuration, getBookingStats, Stop, TransitLeg, Insight } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Bus,
  Ship,
  Car,
  Train,
  Plane,
  AlertTriangle,
  Lightbulb,
  FileText,
  Users,
  Settings,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Umbrella,
  Clock,
  Shield,
  Zap,
  Star,
} from "lucide-react";

// Transport icon mapping
const getTransportIcon = (type: string): React.ElementType => {
  const t = type?.toLowerCase() || "";
  if (t.includes("bus") || t.includes("colectivo") || t.includes("shuttle")) return Bus;
  if (t.includes("train")) return Train;
  if (t.includes("ferry") || t.includes("boat")) return Ship;
  if (t.includes("flight") || t.includes("air") || t.includes("plane")) return Plane;
  return Car;
};

// Status colors
const statusColors = {
  booked: { badge: "bg-[#10B981] text-white", border: "border-l-[#10B981]", dot: "bg-[#10B981]", text: "text-[#10B981]" },
  pending: { badge: "bg-[#F59E0B] text-white", border: "border-l-[#F59E0B]", dot: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
  "not-booked": { badge: "bg-primary text-white", border: "border-l-primary", dot: "bg-primary", text: "text-primary" },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(s)} - ${fmt.format(e)}`;
}

export function ItineraryPanel() {
  const { trip, setSelectedStop, setSelectedLeg, setSubPage } = useTrip();
  const { showToast } = useLocuToast();
  const duration = getTripDuration(trip);
  const stats = getBookingStats(trip);
  const [expandedTransit, setExpandedTransit] = useState<string | null>(null);

  // Build chronological timeline
  type TimelineItem =
    | { type: "stop"; data: Stop; index: number }
    | { type: "transit"; data: TransitLeg }
    | { type: "insight"; data: Insight }
    | { type: "alert"; data: any; stopCity: string };

  const timelineItems: TimelineItem[] = [];

  trip.stops.forEach((stop, index) => {
    timelineItems.push({ type: "stop", data: stop, index: index + 1 });

    if (stop.bookingAlert) {
      timelineItems.push({ type: "alert", data: stop.bookingAlert, stopCity: stop.city });
    }

    const transitLeg = trip.transitLegs.find((leg) => leg.fromStopId === stop.id);
    if (transitLeg) {
      timelineItems.push({ type: "transit", data: transitLeg });
      if (transitLeg.alert) {
        timelineItems.push({ type: "alert", data: transitLeg.alert, stopCity: stop.city });
      }
    }
  });

  if (trip.insights) {
    trip.insights.forEach((insight) => {
      const insertIndex = timelineItems.findIndex(
        (item) => item.type === "stop" && (item.data as Stop).id === insight.relatedStopId
      );
      if (insertIndex > -1) {
        timelineItems.splice(insertIndex + 1, 0, { type: "insight", data: insight });
      }
    });
  }

  const getStopById = (id: string) => trip.stops.find((s) => s.id === id);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Trip Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">{trip.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {trip.description} &bull; {duration} days
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="text-xs">{stats.total} stops</Badge>
          <Badge className={cn("text-xs", statusColors.booked.badge)}>{stats.booked} booked</Badge>
          {stats.pending > 0 && <Badge className={cn("text-xs", statusColors.pending.badge)}>{stats.pending} pending</Badge>}
          {stats.notBooked > 0 && <Badge className={cn("text-xs", statusColors["not-booked"].badge)}>{stats.notBooked} to book</Badge>}
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {timelineItems.map((item, i) => {
          // ====== STOP CARD ======
          if (item.type === "stop") {
            const stop = item.data as Stop;
            const status = stop.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];

            return (
              <div
                key={`stop-${stop.id}`}
                className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden border-l-4", colors.border)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0", colors.dot)}>
                        {item.index}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{stop.city}, {stop.country}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                          <span>&bull;</span>
                          <span>{stop.nights} days</span>
                        </div>
                      </div>
                    </div>
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
                          <Image src={stop.hostelImage || "/placeholder.svg"} alt={stop.hostelName} width={80} height={60} className="w-20 h-15 rounded-md object-cover" />
                        ) : (
                          <div className="w-20 h-15 rounded-md bg-muted flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{stop.hostelName}</p>
                          <p className="text-xs text-muted-foreground">{stop.nights} nights</p>
                          <p className="text-sm font-semibold text-[#10B981] mt-1">
                            ${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}
                          </p>
                          <button
                            onClick={() => { setSelectedStop(stop); setSubPage("hostelDetails"); }}
                            className="text-xs text-primary hover:underline mt-1"
                          >
                            Click to view details
                          </button>
                        </div>
                        <button
                          onClick={() => showToast("Booking settings opened", "info")}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors self-start"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Not Booked CTA */}
                  {status !== "booked" && (
                    <Button
                      onClick={() => { setSelectedStop(stop); setSubPage("hostelDetails"); }}
                      className="w-full mt-3 bg-primary hover:bg-primary/90 text-white"
                    >
                      Explore & Book Hostels
                    </Button>
                  )}
                </div>
              </div>
            );
          }

          // ====== TRANSIT CARD - matches reference image ======
          if (item.type === "transit") {
            const leg = item.data as TransitLeg;
            const status = leg.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];
            const fromStop = getStopById(leg.fromStopId);
            const toStop = getStopById(leg.toStopId);
            const isExpanded = expandedTransit === leg.id;
            const hasOptions = leg.transportOptions && leg.transportOptions.length > 0;

            // Determine cheapest & fastest for smart tags
            const cheapestPrice = hasOptions ? Math.min(...leg.transportOptions!.map((o) => o.price)) : leg.price || 0;
            const fastestDuration = hasOptions
              ? leg.transportOptions!.reduce((min, o) => {
                  const d = parseInt(o.duration);
                  return d < min ? d : min;
                }, Infinity)
              : parseInt(leg.duration) || 999;

            return (
              <div
                key={`transit-${leg.id}`}
                className="bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  {/* Header - matches reference: chevrons + route name */}
                  <button
                    onClick={() => setExpandedTransit(isExpanded ? null : leg.id)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <div className="flex items-center gap-0.5 text-[#3B82F6]">
                      <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
                      <ChevronRight className={cn("w-4 h-4 -ml-2 transition-transform", isExpanded && "rotate-90")} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">
                        {fromStop?.city || "Unknown"} to {toStop?.city || "Unknown"}
                      </h3>
                      {/* Status badge */}
                      {status === "booked" ? (
                        <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Transport Booked
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground mt-0.5">Available Options:</span>
                      )}
                    </div>
                    <Badge className={cn("text-xs shrink-0", colors.badge)}>
                      {status === "booked" ? "Booked" : status === "pending" ? "Pending" : "Book"}
                    </Badge>
                  </button>

                  {/* Transport Options - always show at least the primary one */}
                  <div className={cn("mt-3 space-y-2", !isExpanded && hasOptions && "max-h-0 overflow-hidden", isExpanded && "max-h-[1000px]", !hasOptions && "mt-3")}>
                    {hasOptions ? (
                      leg.transportOptions!.map((option, oi) => {
                        const isCheapest = option.price === cheapestPrice;
                        const optDuration = parseInt(option.duration);
                        const isFastest = optDuration === fastestDuration;
                        const hasInsight = option.verifiedCount && option.verifiedCount > 15;
                        const Icon = getTransportIcon(option.type || leg.type);

                        return (
                          <button
                            key={option.id || oi}
                            onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                            className={cn(
                              "w-full p-3 bg-card rounded-xl border transition-all text-left",
                              oi === 0 ? "border-primary/40 shadow-sm" : "border-border hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <Icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  <p className="font-semibold text-foreground text-sm">{option.operator}</p>
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    <span>{option.duration}</span>
                                    {option.departureTime && (
                                      <span className="text-muted-foreground/60">departs {option.departureTime}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-[#3B82F6] shrink-0">${option.price}</span>
                            </div>

                            {/* Insight badge + smart tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {oi === 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                                  <Star className="w-2.5 h-2.5" /> Locu Pick
                                </span>
                              )}
                              {isCheapest && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-semibold">
                                  <DollarSign className="w-2.5 h-2.5" /> Cheapest
                                </span>
                              )}
                              {isFastest && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-semibold">
                                  <Zap className="w-2.5 h-2.5" /> Fastest
                                </span>
                              )}
                              {hasInsight && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FBBF24]/10 text-[#92710C] text-[10px] font-medium">
                                  <Lightbulb className="w-2.5 h-2.5 text-[#FBBF24]" />
                                  Insight from {option.verifiedCount} travellers
                                </span>
                              )}
                              {option.seatsLeft && option.seatsLeft < 10 && (
                                <span className="text-[10px] text-[#F59E0B] font-medium">{option.seatsLeft} seats left</span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      /* Single option fallback */
                      <button
                        onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                        className="w-full p-3 bg-card rounded-xl border border-border text-left hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {(() => { const Icon = getTransportIcon(leg.type); return <Icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />; })()}
                            <div>
                              <p className="font-semibold text-foreground text-sm">{leg.operator || leg.mode || "Local Transport"}</p>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <Clock className="w-3 h-3" />
                                <span>{leg.duration}</span>
                              </div>
                            </div>
                          </div>
                          {leg.price && <span className="text-lg font-bold text-[#3B82F6] shrink-0">${leg.price}</span>}
                        </div>
                        {leg.communityTip && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FBBF24]/10 text-[#92710C] text-[10px] font-medium">
                              <Lightbulb className="w-2.5 h-2.5 text-[#FBBF24]" />
                              {leg.communityTip}
                            </span>
                          </div>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Show expand toggle if there are multiple options */}
                  {hasOptions && !isExpanded && (
                    <button
                      onClick={() => setExpandedTransit(leg.id)}
                      className="flex items-center justify-center w-full mt-2 py-1.5 text-xs text-[#3B82F6] font-medium hover:bg-[#3B82F6]/5 rounded-lg transition-colors"
                    >
                      View {leg.transportOptions!.length} transport options
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // ====== INSIGHT CARD ======
          if (item.type === "insight") {
            const insight = item.data as Insight;
            const iconMap: Record<string, React.ElementType> = {
              dollar: DollarSign, document: FileText, weather: Umbrella, health: AlertTriangle, safety: AlertTriangle,
            };
            const InsightIcon = iconMap[insight.icon] || Lightbulb;

            return (
              <div key={`insight-${insight.id}`} className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                    <InsightIcon className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.body}</p>
                    {insight.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 mt-2 text-xs text-[#FBBF24] hover:bg-[#FBBF24]/10"
                        onClick={() => {
                          if (insight.action?.toLowerCase().includes("cash")) {
                            showToast("Locu will remind you to take out cash ahead of time", "reminder");
                          } else if (insight.actionUrl) {
                            window.open(insight.actionUrl, "_blank");
                          } else {
                            showToast("Noted! We'll keep this in mind for your trip", "info");
                          }
                        }}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // ====== ALERT CARD ======
          if (item.type === "alert") {
            const alert = item.data;
            const isUrgent = alert.style === "CRITICAL_INLINE_CARD";
            return (
              <div
                key={`alert-${i}`}
                className={cn("p-3 rounded-xl border", isUrgent ? "bg-destructive/10 border-destructive/30" : "bg-primary/10 border-primary/30")}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", isUrgent ? "bg-destructive/20" : "bg-primary/20")}>
                    {isUrgent ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Users className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.body}</p>
                    {(alert.action || alert.podAction) && (
                      <Button
                        size="sm"
                        className={cn("h-7 mt-2 text-xs text-white", isUrgent ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90")}
                        onClick={() => {
                          const action = alert.action || alert.podAction || "";
                          if (action.toLowerCase().includes("book")) {
                            setSubPage("transportBooking");
                          } else if (action.toLowerCase().includes("pod")) {
                            setSubPage("social");
                          } else {
                            showToast(`Action: ${action}`, "info");
                          }
                        }}
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
          className="w-full h-12 text-base font-medium bg-transparent"
        >
          <Users className="w-5 h-5 mr-2" />
          Open Travel Pod
        </Button>
      </div>
    </div>
  );
}
