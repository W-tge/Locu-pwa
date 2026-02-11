"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
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

// ── Shared card classes ──
const CARD_BASE = "bg-card rounded-xl border border-border shadow-sm overflow-hidden";
const CARD_INNER = "p-4";
const TAG_BASE = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide";

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
  "not-booked": { badge: "bg-primary text-white", border: "border-l-primary", dot: "bg-primary", text: "text-primary" },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(s)} - ${fmt.format(e)}`;
}

// ── Animated expand wrapper ──
function AnimatedExpand({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [open, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
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
          <Badge variant="outline" className="text-xs uppercase tracking-wide">{stats.total} Stops</Badge>
          <Badge className={cn("text-xs uppercase tracking-wide", statusColors.booked.badge)}>{stats.booked} Booked</Badge>
          {stats.notBooked > 0 && <Badge className={cn("text-xs uppercase tracking-wide", statusColors["not-booked"].badge)}>{stats.notBooked} To Book</Badge>}
        </div>
      </div>

      {/* Scrollable Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {timelineItems.map((item, i) => {
          // ════════ STOP CARD ════════
          if (item.type === "stop") {
            const stop = item.data as Stop;
            const status = stop.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];

            return (
              <div
                key={`stop-${stop.id}`}
                className={cn(CARD_BASE, "border-l-4", colors.border)}
              >
                <div className={CARD_INNER}>
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
                          <span>{stop.nights} Days</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("text-[10px] shrink-0 uppercase tracking-wide", colors.badge)}>
                      {status === "booked" && <><CheckCircle2 className="w-3 h-3 mr-1" /> Booked</>}
                      {status === "not-booked" && "Needs Booking"}
                    </Badge>
                  </div>

                  {/* Booked Hostel Card */}
                  {status === "booked" && stop.hostelName && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
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
                          <p className="text-xs text-muted-foreground">{stop.nights} Nights</p>
                          <p className="text-sm font-semibold text-[#10B981] mt-1">
                            ${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}
                          </p>
                          <button
                            onClick={() => { setSelectedStop(stop); setSubPage("bookingDetails"); }}
                            className="text-xs text-primary hover:underline mt-1 font-medium"
                          >
                            View Booking Details
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
                      className="w-full mt-3 gradient-vibrant text-white font-semibold shadow-sm hover:shadow-md transition-shadow"
                    >
                      Explore & Book Hostels
                    </Button>
                  )}
                </div>
              </div>
            );
          }

          // ════════ TRANSIT CARD ════════
          if (item.type === "transit") {
            const leg = item.data as TransitLeg;
            const status = leg.bookingStatus;
            const colors = statusColors[status] || statusColors["not-booked"];
            const fromStop = getStopById(leg.fromStopId);
            const toStop = getStopById(leg.toStopId);
            const isExpanded = expandedTransit === leg.id;
            const hasOptions = leg.transportOptions && leg.transportOptions.length > 0;
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
                className={cn(CARD_BASE, "border-l-4", status === "booked" ? "border-l-[#10B981]" : "border-l-[#3B82F6]")}
              >
                <div className={CARD_INNER}>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", status === "booked" ? "bg-[#10B981]" : "bg-[#3B82F6]")}>
                        {(() => { const Icon = getTransportIcon(leg.type); return <Icon className="w-4 h-4 text-white" />; })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{fromStop?.city || "Origin"} to {toStop?.city || "Destination"}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{leg.duration}</span>
                          {leg.price && <><span>&bull;</span><span className="font-semibold text-foreground">${leg.price}</span></>}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("text-[10px] shrink-0 uppercase tracking-wide", colors.badge)}>
                      {status === "booked" ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Booked</> : "To Book"}
                    </Badge>
                  </div>

                  {/* Booked state summary */}
                  {status === "booked" && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-foreground">{leg.operator || "Transport"}</p>
                          <p className="text-xs text-muted-foreground">{leg.mode || leg.type}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedLeg(leg); setSubPage("transitBookingDetails"); }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View Booking Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Unbooked: transport options with animated expand */}
                  {status !== "booked" && hasOptions && (
                    <>
                      <AnimatedExpand open={isExpanded}>
                        <div className="mt-3 space-y-2">
                          {leg.transportOptions!.map((option, oi) => {
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
                                  "w-full p-3 bg-muted/30 rounded-lg border transition-all text-left hover:bg-muted/60",
                                  oi === 0 ? "border-[#3B82F6]/40 shadow-sm" : "border-border"
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
                                          <span className="text-muted-foreground/60">Departs {option.departureTime}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-lg font-bold text-[#3B82F6] shrink-0">${option.price}</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  {oi === 0 && (
                                    <span className={cn(TAG_BASE, "bg-primary/10 text-primary")}>
                                      <Star className="w-2.5 h-2.5" /> Locu Pick
                                    </span>
                                  )}
                                  {isCheapest && (
                                    <span className={cn(TAG_BASE, "bg-[#10B981]/10 text-[#10B981]")}>
                                      <DollarSign className="w-2.5 h-2.5" /> Cheapest
                                    </span>
                                  )}
                                  {isFastest && (
                                    <span className={cn(TAG_BASE, "bg-[#3B82F6]/10 text-[#3B82F6]")}>
                                      <Zap className="w-2.5 h-2.5" /> Fastest
                                    </span>
                                  )}
                                  {hasInsight && (
                                    <span className={cn(TAG_BASE, "bg-[#FBBF24]/10 text-[#92710C] normal-case")}>
                                      <Lightbulb className="w-2.5 h-2.5 text-[#FBBF24]" />
                                      Insight From {option.verifiedCount} Travellers
                                    </span>
                                  )}
                                  {option.seatsLeft && option.seatsLeft < 10 && (
                                    <span className={cn(TAG_BASE, "bg-[#F59E0B]/10 text-[#F59E0B] normal-case")}>
                                      {option.seatsLeft} Seats Left
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </AnimatedExpand>

                      {/* Expand / collapse toggle */}
                      <button
                        onClick={() => setExpandedTransit(isExpanded ? null : leg.id)}
                        className={cn(
                          "flex items-center justify-center w-full mt-3 py-2.5 text-xs font-semibold rounded-lg transition-all",
                          isExpanded
                            ? "text-muted-foreground bg-muted/60 hover:bg-muted"
                            : "text-white gradient-vibrant shadow-sm hover:shadow-md"
                        )}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 mr-1.5 rotate-180" />
                            Collapse Options
                          </>
                        ) : (
                          <>
                            <Bus className="w-3.5 h-3.5 mr-1.5" />
                            View {leg.transportOptions!.length} Transport Options
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {/* Unbooked: single option fallback */}
                  {status !== "booked" && !hasOptions && (
                    <Button
                      onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                      className="w-full mt-3 gradient-vibrant text-white font-semibold shadow-sm hover:shadow-md transition-shadow"
                    >
                      Book Transport
                    </Button>
                  )}
                </div>
              </div>
            );
          }

          // ════════ INSIGHT CARD ════════
          if (item.type === "insight") {
            const insight = item.data as Insight;
            const iconMap: Record<string, React.ElementType> = {
              dollar: DollarSign, document: FileText, weather: Umbrella, health: AlertTriangle, safety: AlertTriangle,
            };
            const InsightIcon = iconMap[insight.icon] || Lightbulb;

            return (
              <div key={`insight-${insight.id}`} className={cn(CARD_BASE, "border-l-4 border-l-[#FBBF24]")}>
                <div className={CARD_INNER}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                      <InsightIcon className="w-4 h-4 text-[#FBBF24]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(TAG_BASE, "bg-[#FBBF24]/10 text-[#92710C]")}>
                          <Lightbulb className="w-2.5 h-2.5 text-[#FBBF24]" /> Traveller Tip
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-foreground mt-2">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{insight.body}</p>
                      {insight.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 mt-2 text-xs text-[#92710C] hover:bg-[#FBBF24]/10 font-semibold"
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
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // ════════ ALERT CARD ════════
          if (item.type === "alert") {
            const alert = item.data;
            const isUrgent = alert.style === "CRITICAL_INLINE_CARD";
            return (
              <div
                key={`alert-${i}`}
                className={cn(CARD_BASE, "border-l-4", isUrgent ? "border-l-destructive" : "border-l-primary")}
              >
                <div className={CARD_INNER}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", isUrgent ? "bg-destructive/20" : "bg-primary/20")}>
                      {isUrgent ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Users className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(TAG_BASE, isUrgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                          {isUrgent ? <><AlertTriangle className="w-2.5 h-2.5" /> Urgent</> : <><Users className="w-2.5 h-2.5" /> Pod Alert</>}
                        </span>
                      </div>
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
          className="w-full h-12 text-base font-semibold bg-[#0D9488] hover:bg-[#0D9488]/90 text-white shadow-lg"
        >
          <Users className="w-5 h-5 mr-2" />
          Open Travel Pod
        </Button>
      </div>
    </div>
  );
}
