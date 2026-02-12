"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { getTripDuration, getBookingStats, Stop, TransitLeg, Insight } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  Truck,
  Anchor,
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
  Heart,
  CloudRain,
  Info,
} from "lucide-react";

/* ===== Helpers ===== */

const getTransportIcon = (type: string): React.ElementType => {
  const t = type?.toLowerCase() || "";
  if (t.includes("boat") || t.includes("ferry")) return Anchor;
  if (t.includes("train")) return Train;
  if (t.includes("flight") || t.includes("air") || t.includes("plane")) return Plane;
  if (t.includes("jeep")) return Truck;
  if (t.includes("bus") || t.includes("colectivo") || t.includes("shuttle")) return Bus;
  return Car;
};

const getInsightIcon = (icon: string): React.ElementType => {
  const map: Record<string, React.ElementType> = {
    dollar: DollarSign, document: FileText, weather: CloudRain, health: Heart, safety: Shield,
  };
  return map[icon] || Info;
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  return `${fmt.format(s)} - ${fmt.format(e)}`;
}

/* ===== Design Atoms ===== */

function HighlighterTag({ children, color = "yellow" }: { children: React.ReactNode; color?: "yellow" | "pink" | "green" | "blue" }) {
  const colors = {
    yellow: "bg-[#FDE68A]/70",
    pink: "bg-[#FBCFE8]/70",
    green: "bg-[#A7F3D0]/70",
    blue: "bg-[#BFDBFE]/70",
  };
  return (
    <span className="relative inline-block px-1.5 py-0.5">
      <span className={cn("absolute inset-0 rounded-sm", colors[color])} />
      <span className="relative text-[10px] font-semibold text-foreground uppercase tracking-wide">{children}</span>
    </span>
  );
}

function TrailPin({ booked, active }: { booked?: boolean; active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div className={cn(
        "w-4 h-4 rounded-full border-2 bg-card shadow-sm",
        booked ? "border-[#10B981]" : active ? "border-primary" : "border-muted-foreground/30"
      )}>
        <div className={cn(
          "absolute inset-[3px] rounded-full",
          booked ? "bg-[#10B981]" : active ? "bg-primary" : "bg-transparent"
        )} />
      </div>
      {active && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse border border-card" />}
    </div>
  );
}

function AnimatedExpand({ expanded, children }: { expanded: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [expanded, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: expanded ? height : 0, opacity: expanded ? 1 : 0 }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ===== Main Component ===== */

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
      {/* Trip Header - Scrapbook Title */}
      <div className="shrink-0 p-4 pb-3 border-b border-border paper-texture">
        <h2 className="font-serif text-2xl text-foreground text-balance">{trip.name}</h2>
        <p className="font-[var(--font-hand)] text-base text-muted-foreground mt-0.5">
          {trip.description} &bull; {duration} days
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <HighlighterTag color="blue">{stats.total} Stops</HighlighterTag>
          <HighlighterTag color="green">{stats.booked} Booked</HighlighterTag>
          {stats.notBooked > 0 && <HighlighterTag color="pink">{stats.notBooked} To Book</HighlighterTag>}
        </div>
      </div>

      {/* Scrollable Scrapbook Timeline */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative pl-8 pr-4 py-4 space-y-4">

          {/* Dashed trail spine */}
          <div className="absolute left-[21px] top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/20" />

          {timelineItems.map((item, i) => {

            /* ====== STOP CARD — Polaroid Scrapbook ====== */
            if (item.type === "stop") {
              const stop = item.data as Stop;
              const isBooked = stop.bookingStatus === "booked";

              return (
                <div key={`stop-${stop.id}`} className="relative">
                  {/* Trail pin node */}
                  <div className="absolute -left-[21px] top-4">
                    <TrailPin booked={isBooked} active={item.index <= 2} />
                  </div>

                  {/* Stop Card */}
                  <div
                    className={cn(
                      "relative bg-card rounded-lg overflow-hidden transition-all duration-200 group",
                      "shadow-[2px_3px_10px_rgba(140,130,115,0.12)]",
                      "hover:shadow-[3px_5px_16px_rgba(140,130,115,0.22)]",
                      isBooked ? "border-l-[3px] border-l-[#10B981] border border-border" : "border-l-[3px] border-l-primary border border-border",
                    )}
                  >
                    <div className="p-3 pb-4">
                      <button
                        onClick={() => { setSelectedStop(stop); setSubPage("hostelDetails"); }}
                        className="w-full text-left group/caption"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-[var(--font-hand)] text-xl leading-tight text-foreground group-hover/caption:text-primary transition-colors">
                              {stop.city}, {stop.country}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                              <span className="text-border">|</span>
                              <span>{stop.nights} Nights</span>
                            </div>
                          </div>
                          <div className="mt-1">
                            {isBooked ? (
                              <HighlighterTag color="green">Booked</HighlighterTag>
                            ) : (
                              <HighlighterTag color="pink">Needs Booking</HighlighterTag>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Booked hostel — stamped receipt */}
                      {isBooked && stop.hostelName && (
                        <div className="mt-3 border border-dashed border-border rounded-sm p-2.5 bg-muted/30">
                          <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-[var(--font-hand)] text-base text-foreground leading-tight truncate">{stop.hostelName}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{stop.nights} Nights</span>
                                <span className="font-mono text-sm font-semibold text-[#10B981]">${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => { setSelectedStop(stop); setSubPage("bookingDetails"); }}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors self-start shrink-0"
                            >
                              <Settings className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Not Booked CTA */}
                      {!isBooked && (
                        <Button
                          onClick={() => { setSelectedStop(stop); setSubPage("hostelDetails"); }}
                          className="w-full mt-3 gradient-vibrant text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                          size="sm"
                        >
                          Explore & Book Hostels
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            /* ====== TRANSIT CARD — Ticket Stub ====== */
            if (item.type === "transit") {
              const leg = item.data as TransitLeg;
              const isBooked = leg.bookingStatus === "booked";
              const fromStop = getStopById(leg.fromStopId);
              const toStop = getStopById(leg.toStopId);
              const isExpanded = expandedTransit === leg.id;
              const hasOptions = leg.transportOptions && leg.transportOptions.length > 0;
              const Icon = getTransportIcon(leg.type);

              return (
                <div key={`transit-${leg.id}`} className="relative">
                  {/* Trail connector - smaller node for transit */}
                  <div className="absolute -left-[21px] top-5">
                    <div className="w-3 h-3 rounded-full border-2 border-[#3B82F6]/40 bg-card shadow-sm flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#3B82F6]/60" />
                    </div>
                  </div>

                  {/* Ticket body with perforated edges */}
                  <div
                    className={cn(
                      "relative rounded-lg overflow-hidden transition-all duration-200",
                      isBooked ? "bg-[#ECFDF5] border border-dashed border-[#10B981]/30" : "bg-[#FEF9E7] border border-dashed border-[#D4A017]/30",
                    )}
                  >
                    {/* Punch-hole circles */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />

                    <button
                      onClick={() => setExpandedTransit(isExpanded ? null : leg.id)}
                      className="w-full text-left"
                    >
                      <div className="flex">
                        {/* Stub — departure info */}
                        <div className="shrink-0 w-20 p-3 border-r border-dashed border-border/40 flex flex-col items-center justify-center gap-1">
                          <Icon className={cn("w-5 h-5", isBooked ? "text-[#10B981]" : "text-[#D4A017]")} />
                          <span className="font-mono text-sm font-bold text-foreground leading-none">{leg.departureTime || "TBD"}</span>
                          <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">{leg.type}</span>
                        </div>

                        {/* Route details */}
                        <div className="flex-1 p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-foreground">{fromStop?.city || "?"}</span>
                            <span className="text-muted-foreground text-[10px]">&rarr;</span>
                            <span className="font-mono text-xs font-semibold text-foreground">{toStop?.city || "?"}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{leg.duration}</span>
                            {leg.operator && <span>{leg.operator}</span>}
                          </div>

                          {/* Price + status */}
                          <div className="flex items-center justify-between mt-2">
                            {leg.price ? (
                              <span className="font-mono text-sm font-bold text-foreground">${leg.price}</span>
                            ) : <span />}
                            {isBooked ? (
                              <HighlighterTag color="green">Booked</HighlighterTag>
                            ) : (
                              <HighlighterTag color="pink">Book</HighlighterTag>
                            )}
                          </div>

                          {/* Barcode visual */}
                          <div className="flex items-end gap-[1.5px] h-4 mt-2 opacity-20">
                            {Array.from({ length: 24 }).map((_, bi) => (
                              <div
                                key={bi}
                                className="bg-foreground rounded-[0.5px]"
                                style={{
                                  width: bi % 3 === 0 ? 2.5 : 1.2,
                                  height: `${45 + Math.sin(bi * 0.8) * 35}%`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expandable transport options */}
                    <AnimatedExpand expanded={isExpanded}>
                      <div className="border-t border-dashed border-border/30 px-3 pb-3 space-y-1.5 pt-2">
                        {hasOptions ? (
                          leg.transportOptions!.map((option, oi) => (
                            <button
                              key={option.id || oi}
                              onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                              className={cn(
                                "w-full flex items-center justify-between p-2 rounded-md bg-card/60 text-left font-mono border transition-all",
                                oi === 0 ? "border-primary/30 shadow-sm" : "border-border/30 hover:border-primary/20"
                              )}
                            >
                              <div>
                                <p className="font-semibold text-xs text-foreground">{option.operator}</p>
                                <p className="text-[10px] text-muted-foreground">{option.departureTime} - {option.arrivalTime} &bull; {option.duration}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary text-xs">${option.price}</p>
                                {option.seatsLeft && option.seatsLeft < 10 && <p className="text-[9px] text-[#FF6B9D]">{option.seatsLeft} Left</p>}
                              </div>
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                            className="w-full p-2 rounded-md bg-card/60 text-left font-mono border border-border/30 hover:border-primary/20 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-xs text-foreground">{leg.operator || "Local Transport"}</p>
                                <p className="text-[10px] text-muted-foreground">{leg.duration}</p>
                              </div>
                              {leg.price && <p className="font-bold text-primary text-xs">${leg.price}</p>}
                            </div>
                            {leg.communityTip && (
                              <p className="text-[9px] text-[#92710C] mt-1 flex items-center gap-1">
                                <Lightbulb className="w-2.5 h-2.5 text-[#FBBF24]" /> {leg.communityTip}
                              </p>
                            )}
                          </button>
                        )}

                        {!isBooked && (
                          <Button
                            onClick={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                            size="sm"
                            className="w-full gradient-vibrant text-white font-mono text-xs font-semibold uppercase tracking-wider mt-1"
                          >
                            View Transport Options
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        )}
                      </div>
                    </AnimatedExpand>

                    {/* Expand toggle */}
                    {!isExpanded && (
                      <button
                        onClick={() => setExpandedTransit(leg.id)}
                        className="w-full flex items-center justify-center gap-1 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-t border-dashed border-border/30"
                      >
                        {hasOptions ? `View ${leg.transportOptions!.length} Options` : "View Details"}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                    {isExpanded && (
                      <button
                        onClick={() => setExpandedTransit(null)}
                        className="w-full flex items-center justify-center gap-1 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-t border-dashed border-border/30"
                      >
                        Hide
                        <ChevronDown className="w-3 h-3 rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            /* ====== INSIGHT CARD — Scrapbook Note ====== */
            if (item.type === "insight") {
              const insight = item.data as Insight;
              const InsightIcon = getInsightIcon(insight.icon);
              const isAlert = insight.type === "alert";
              const isReminder = insight.type === "reminder";

              return (
                <div key={`insight-${insight.id}`} className="relative">
                  <div className="absolute -left-[21px] top-4">
                    <div className="w-3 h-3 rounded-full border-2 border-[#FBBF24]/40 bg-card shadow-sm flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#FBBF24]" />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "rounded-lg p-3 border transition-all duration-200",
                      isAlert
                        ? "bg-[#FFF1F2] border-[#FF6B9D]/30"
                        : isReminder
                        ? "bg-[#FFFBEB] border-[#FBBF24]/30"
                        : "bg-[#ECFDF5] border-[#10B981]/30"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        isAlert ? "bg-[#FF6B9D]/20 text-[#FF6B9D]" : isReminder ? "bg-[#FBBF24]/20 text-[#FBBF24]" : "bg-[#10B981]/20 text-[#10B981]"
                      )}>
                        <InsightIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-[var(--font-hand)] text-base leading-tight",
                          isAlert ? "text-[#FF6B9D]" : isReminder ? "text-[#B45309]" : "text-[#047857]"
                        )}>
                          {insight.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.body}</p>
                        {insight.action && (
                          <Button
                            onClick={() => {
                              if (insight.action?.toLowerCase().includes("cash")) {
                                showToast("Locu will remind you to take out cash ahead of time", "reminder");
                              } else if (insight.actionUrl) {
                                window.open(insight.actionUrl, "_blank");
                              } else {
                                showToast("Noted! We'll keep this in mind for your trip", "info");
                              }
                            }}
                            size="sm"
                            variant="outline"
                            className={cn(
                              "mt-2 h-7 text-[10px] font-mono uppercase tracking-wider bg-transparent",
                              isAlert ? "border-[#FF6B9D]/40 text-[#FF6B9D] hover:bg-[#FF6B9D]/10" : isReminder ? "border-[#FBBF24]/40 text-[#B45309] hover:bg-[#FBBF24]/10" : "border-[#10B981]/40 text-[#047857] hover:bg-[#10B981]/10"
                            )}
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

            /* ====== ALERT CARD ====== */
            if (item.type === "alert") {
              const alert = item.data;
              const isCritical = alert.style === "CRITICAL_INLINE_CARD";

              return (
                <div key={`alert-${i}`} className="relative">
                  <div className="absolute -left-[21px] top-4">
                    <div className={cn("w-3 h-3 rounded-full border-2 bg-card shadow-sm flex items-center justify-center", isCritical ? "border-[#FF6B9D]/50" : "border-[#10B981]/50")}>
                      <div className={cn("w-1 h-1 rounded-full", isCritical ? "bg-[#FF6B9D]" : "bg-[#10B981]")} />
                    </div>
                  </div>

                  <div className={cn(
                    "rounded-lg p-3 border-2",
                    isCritical ? "bg-[#FFF1F2] border-[#FF6B9D]/40" : "bg-[#ECFDF5] border-[#10B981]/40"
                  )}>
                    <div className="flex items-start gap-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        isCritical ? "bg-[#FF6B9D]/20" : "bg-[#10B981]/20"
                      )}>
                        {isCritical ? <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B9D]" /> : <Users className="w-3.5 h-3.5 text-[#10B981]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-[var(--font-hand)] text-base text-foreground">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.body}</p>
                        {(alert.action || alert.podAction) && (
                          <Button
                            size="sm"
                            className={cn("mt-2 h-7 text-[10px] font-mono uppercase tracking-wider text-white", isCritical ? "bg-[#FF6B9D] hover:bg-[#FF6B9D]/90" : "bg-[#10B981] hover:bg-[#10B981]/90")}
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
