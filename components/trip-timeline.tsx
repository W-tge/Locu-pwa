"use client";

import React from "react"

import { useState, useMemo } from "react";
import { useTrip } from "@/lib/trip-context";
import {
  formatDateRange,
  type Stop,
  type TransitLeg,
  type Insight,
  type PodAlert,
} from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Bus,
  Ship,
  Train,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  Users,
  Truck,
  Anchor,
  Calendar,
  DollarSign,
  FileText,
  CloudRain,
  Heart,
  Shield,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------- helpers ---------- */

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry":
      return Anchor;
    case "train":
      return Train;
    case "jeep":
      return Truck;
    default:
      return Bus;
  }
}

function getInsightIcon(icon: string) {
  switch (icon) {
    case "dollar":
      return DollarSign;
    case "document":
      return FileText;
    case "weather":
      return CloudRain;
    case "health":
      return Heart;
    case "safety":
      return Shield;
    default:
      return Info;
  }
}

/* seeded pseudo-random so rotations are stable across renders */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return ((h >>> 0) % 100) / 100;
}

function getCardRotation(id: string) {
  const r = seededRandom(id);
  return r * 4 - 2; // -2 to 2 degrees
}

function getTapeRotation(id: string) {
  const r = seededRandom(id + "tape");
  return r * 16 - 8; // -8 to 8 degrees
}

/* ---------- Scrapbook components ---------- */

// Highlighter badge
function HighlighterTag({ children, color = "yellow" }: { children: React.ReactNode; color?: "yellow" | "pink" | "green" | "blue" }) {
  const colors = {
    yellow: "bg-[#FDE68A]/70",
    pink: "bg-[#FBCFE8]/70",
    green: "bg-[#A7F3D0]/70",
    blue: "bg-[#BFDBFE]/70",
  };
  return (
    <span className="relative inline-block px-1.5">
      <span className={cn("absolute inset-0 -skew-y-1 rounded-sm", colors[color])} />
      <span className="relative text-xs font-semibold text-foreground">{children}</span>
    </span>
  );
}

// Scotch tape decoration
function TapeStrip({ rotation, position = "top-right" }: { rotation: number; position?: "top-right" | "top-left" }) {
  return (
    <div
      className={cn(
        "absolute w-14 h-5 rounded-sm z-10 pointer-events-none",
        "bg-gradient-to-r from-white/30 via-white/50 to-white/30",
        "border border-white/20 backdrop-blur-[1px]",
        "shadow-[inset_0_0_4px_rgba(255,255,255,0.3)]",
        position === "top-right" ? "-top-2 -right-1" : "-top-2 -left-1"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}

// Map pin node for the trail
function TrailPin({ active, booked }: { active?: boolean; booked?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 bg-card shadow-sm",
          booked ? "border-[#10B981]" : "border-muted-foreground/40",
          active && "border-primary"
        )}
      >
        <div
          className={cn(
            "absolute inset-[3px] rounded-full",
            booked ? "bg-[#10B981]" : active ? "bg-primary" : "bg-transparent"
          )}
        />
      </div>
      {active && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border border-card" />
      )}
    </div>
  );
}

/* ===== Destination Card — "Polaroid Memory" ===== */

function DestinationCard({
  stop,
  stopIndex,
  isSelected,
  onSelect,
  onBookHostel,
}: {
  stop: Stop;
  stopIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onBookHostel: () => void;
}) {
  const isBooked = stop.bookingStatus === "booked";
  const rotation = getCardRotation(stop.id);
  const tapeRot = getTapeRotation(stop.id);

  return (
    <div
      className={cn(
        "relative bg-card rounded-sm overflow-visible transition-all duration-200 group",
        "shadow-[2px_3px_12px_rgba(140,130,115,0.15)]",
        "hover:shadow-[3px_5px_18px_rgba(140,130,115,0.25)] hover:scale-[1.02] hover:!rotate-0",
        isSelected && "ring-2 ring-primary !rotate-0 scale-[1.02]"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape strip decoration */}
      <TapeStrip rotation={tapeRot} position={stopIndex % 2 === 0 ? "top-right" : "top-left"} />

      {/* Polaroid thick white border */}
      <div className="p-3 pb-5">
        {/* Image area */}
        {isBooked && stop.hostelImage ? (
          <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-muted mb-3">
            <Image src={stop.hostelImage || "/placeholder.svg"} alt={stop.city} fill className="object-cover" />
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-[11px] font-semibold text-white">Booked</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden bg-muted/60 border border-dashed border-border mb-3 flex flex-col items-center justify-center gap-1">
            <MapPin className="w-6 h-6 text-muted-foreground/40" />
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">Stop {stopIndex}</span>
          </div>
        )}

        {/* Caption area — handwriting font */}
        <button onClick={onSelect} className="w-full text-left">
          <h3 className="font-[var(--font-hand)] text-xl leading-tight text-foreground">
            {stop.city}, {stop.country}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-muted-foreground tracking-wide uppercase">
            <Calendar className="w-3 h-3" />
            <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
            <span className="text-border">|</span>
            <span>{stop.nights} nights</span>
          </div>
        </button>

        {/* Highlight as a highlighter pen effect */}
        {stop.highlight && (
          <div className="mt-2">
            <HighlighterTag color="green">{stop.highlight}</HighlighterTag>
          </div>
        )}

        {/* Tags */}
        {stop.tags && stop.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {stop.tags.map((tag) => (
              <HighlighterTag key={tag} color={tag.toLowerCase().includes("party") ? "pink" : tag.toLowerCase().includes("budget") ? "yellow" : "blue"}>
                {tag}
              </HighlighterTag>
            ))}
          </div>
        )}

        {/* Booked hostel — stamped receipt look */}
        {isBooked && stop.hostelName && (
          <div className="mt-3 border border-dashed border-border rounded-sm p-2.5 bg-muted/30">
            <p className="font-[var(--font-hand)] text-base text-foreground leading-tight">{stop.hostelName}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{stop.nights} nights</span>
              <span className="font-mono text-sm font-semibold text-[#10B981]">${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}</span>
            </div>
          </div>
        )}

        {/* Book hostel button */}
        {!isBooked && (
          <Button
            onClick={(e) => { e.stopPropagation(); onBookHostel(); }}
            className="w-full mt-3 gradient-vibrant text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
            size="sm"
          >
            Explore & Book Hostels
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ===== Transit Card — "Physical Ticket" with perforated edges ===== */

function TransitLegCard({
  leg,
  fromCity,
  toCity,
  isSelected,
  onSelect,
  onBookTransport,
}: {
  leg: TransitLeg;
  fromCity: string;
  toCity: string;
  isSelected: boolean;
  onSelect: () => void;
  onBookTransport: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isBooked = leg.bookingStatus === "booked";
  const Icon = getTransportIcon(leg.type);
  const rotation = getCardRotation(leg.id);

  return (
    <div
      className={cn(
        "relative ml-4 transition-all duration-200 group",
        "hover:scale-[1.01] hover:!rotate-0",
        isSelected && "!rotate-0 scale-[1.01]"
      )}
      style={{ transform: `rotate(${rotation * 0.5}deg)` }}
    >
      {/* Ticket body */}
      <div
        className={cn(
          "relative rounded-lg overflow-hidden",
          isBooked ? "bg-[#ECFDF5]" : "bg-[#FEF9E7]",
          "border border-dashed",
          isBooked ? "border-[#10B981]/40" : "border-[#D4A017]/40",
          isSelected && "ring-2 ring-primary"
        )}
      >
        {/* Perforated edge circles */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background" />

        <button onClick={onSelect} className="w-full text-left">
          <div className="flex">
            {/* Stub — departure info */}
            <div className="shrink-0 w-24 p-3 border-r border-dashed border-border/50 flex flex-col items-center justify-center gap-1">
              <Icon className={cn("w-5 h-5", isBooked ? "text-[#10B981]" : "text-[#D4A017]")} />
              <span className="font-mono text-lg font-bold text-foreground leading-none">{leg.departureTime || "TBD"}</span>
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">{leg.type}</span>
            </div>

            {/* Details */}
            <div className="flex-1 p-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-foreground">{fromCity}</span>
                <span className="text-muted-foreground text-xs">&rarr;</span>
                <span className="font-mono text-sm font-semibold text-foreground">{toCity}</span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{leg.duration}</span>
                {leg.operator && <span>{leg.operator}</span>}
                {leg.route && <span>RT {leg.route}</span>}
              </div>

              {/* Price + status */}
              <div className="flex items-center justify-between mt-2">
                {leg.price && (
                  <span className="font-mono text-base font-bold text-foreground">${leg.price}</span>
                )}
                {isBooked ? (
                  <HighlighterTag color="green">Booked</HighlighterTag>
                ) : (
                  <HighlighterTag color="pink">Needs Booking</HighlighterTag>
                )}
              </div>

              {/* Barcode visual */}
              <div className="flex items-end gap-[1.5px] h-5 mt-2 opacity-25">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-foreground rounded-[0.5px]"
                    style={{
                      width: i % 3 === 0 ? 2.5 : 1.2,
                      height: `${45 + Math.sin(i * 0.8) * 35}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* Expandable transport options */}
        {leg.transportOptions && leg.transportOptions.length > 0 && (
          <div className="border-t border-dashed border-border/50">
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? "Hide" : "View"} {leg.transportOptions.length} Options
              <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded && (
              <div className="px-3 pb-3 space-y-1.5">
                {leg.transportOptions.map((option) => (
                  <div key={option.id} className="flex items-center justify-between p-2 rounded-md bg-card/60 text-sm font-mono border border-border/30">
                    <div>
                      <p className="font-semibold text-xs">{option.operator}</p>
                      <p className="text-[10px] text-muted-foreground">{option.departureTime} - {option.arrivalTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-xs">${option.price}</p>
                      {option.seatsLeft && <p className="text-[9px] text-[#FF6B9D]">{option.seatsLeft} left</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Book button */}
        {!isBooked && (
          <div className="px-3 pb-3 border-t border-dashed border-border/50 pt-2">
            <Button
              onClick={(e) => { e.stopPropagation(); onBookTransport(); }}
              size="sm"
              className="w-full gradient-vibrant text-white font-mono text-xs font-semibold uppercase tracking-wider"
            >
              View Transport Options
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Insight Card — Scrapbook note ===== */

function InsightCard({
  insight,
  onAction,
}: {
  insight: Insight;
  onAction?: () => void;
}) {
  const Icon = getInsightIcon(insight.icon);
  const isAlert = insight.type === "alert";
  const isReminder = insight.type === "reminder";
  const rotation = getCardRotation(insight.id);

  return (
    <div
      className="relative ml-4"
      style={{ transform: `rotate(${rotation * 0.6}deg)` }}
    >
      <div
        className={cn(
          "rounded-sm p-3 border transition-all hover:rotate-0",
          isAlert
            ? "bg-[#FFF1F2] border-[#FF6B9D]/30"
            : isReminder
            ? "bg-[#FFFBEB] border-[#FBBF24]/30"
            : "bg-[#ECFDF5] border-[#10B981]/30"
        )}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
              isAlert ? "bg-[#FF6B9D]/20 text-[#FF6B9D]" : isReminder ? "bg-[#FBBF24]/20 text-[#FBBF24]" : "bg-[#10B981]/20 text-[#10B981]"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                "font-[var(--font-hand)] text-base leading-tight",
                isAlert ? "text-[#FF6B9D]" : isReminder ? "text-[#B45309]" : "text-[#047857]"
              )}
            >
              {insight.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.body}</p>
            {insight.action && (
              <Button
                onClick={onAction}
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

/* ===== Critical Alert ===== */

function CriticalAlertCard({
  alert,
  onAction,
}: {
  alert: PodAlert;
  onAction: () => void;
}) {
  const isCritical = alert.style === "CRITICAL_INLINE_CARD";

  return (
    <div className="relative ml-4">
      <div
        className={cn(
          "rounded-sm p-3 border-2",
          isCritical
            ? "bg-[#FFF1F2] border-[#FF6B9D]/50"
            : "bg-[#ECFDF5] border-[#10B981]/50"
        )}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
              isCritical ? "bg-[#FF6B9D]/20" : "bg-[#10B981]/20"
            )}
          >
            {isCritical ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B9D]" />
            ) : (
              <Users className="w-3.5 h-3.5 text-[#10B981]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-[var(--font-hand)] text-base text-foreground">{alert.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.body}</p>
            {(alert.action || alert.podAction) && (
              <Button
                onClick={onAction}
                size="sm"
                className={cn(
                  "mt-2 h-7 text-[10px] font-mono uppercase tracking-wider text-white",
                  isCritical ? "bg-[#FF6B9D] hover:bg-[#FF6B9D]/90" : "bg-[#10B981] hover:bg-[#10B981]/90"
                )}
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

/* ===== Main Timeline ===== */

export function TripTimeline({ compact = false }: { compact?: boolean }) {
  const { trip, selectedStop, selectedLeg, setSelectedStop, setSelectedLeg, setSubPage } = useTrip();

  // Build chronological timeline items
  const timelineItems = useMemo(() => {
    const items: Array<{
      type: "stop" | "transit" | "insight" | "alert";
      date: string;
      data: Stop | TransitLeg | Insight | PodAlert;
      stopIndex?: number;
    }> = [];

    trip.stops.forEach((stop, index) => {
      items.push({ type: "stop", date: stop.startDate, data: stop, stopIndex: index + 1 });

      const relatedInsight = trip.insights.find((i) => i.relatedStopId === stop.id);
      if (relatedInsight) {
        items.push({ type: "insight", date: stop.startDate, data: relatedInsight });
      }

      if (stop.bookingAlert) {
        items.push({ type: "alert", date: stop.startDate, data: stop.bookingAlert });
      }

      const transitLeg = trip.transitLegs.find((l) => l.fromStopId === stop.id);
      if (transitLeg) {
        if (transitLeg.alert) {
          items.push({ type: "alert", date: transitLeg.departureDate || stop.endDate, data: transitLeg.alert });
        }
        items.push({ type: "transit", date: transitLeg.departureDate || stop.endDate, data: transitLeg });
      }
    });

    return items;
  }, [trip]);

  return (
    <div className={cn("h-full overflow-y-auto scrollbar-hide bg-background", compact ? "pb-4" : "pb-24")}>
      {/* ---- Trip header ---- */}
      <div className="p-4 border-b border-dashed border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 paper-texture">
        <h2 className="font-serif text-2xl text-foreground">{trip.name}</h2>
        <p className="font-[var(--font-hand)] text-lg text-muted-foreground mt-0.5">
          {trip.description} &middot; {trip.stops.length} stops
        </p>
      </div>

      {/* ---- Timeline body ---- */}
      <div className="relative px-4 pt-4">
        {/* The "hiking trail" dashed line */}
        <div
          className="absolute left-[26px] top-4 bottom-4 w-px"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, var(--color-muted-foreground) 0px, var(--color-muted-foreground) 5px, transparent 5px, transparent 12px)",
            opacity: 0.3,
          }}
        />

        <div className={cn("space-y-5", compact && "space-y-3")}>
          {timelineItems.map((item, i) => {
            if (item.type === "stop") {
              const stop = item.data as Stop;
              return (
                <div key={`stop-${stop.id}`} className="relative flex gap-3">
                  {/* Trail pin */}
                  <div className="relative z-[2] mt-4 shrink-0">
                    <TrailPin active={stop.status === "ACTIVE"} booked={stop.bookingStatus === "booked"} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 min-w-0">
                    <DestinationCard
                      stop={stop}
                      stopIndex={item.stopIndex!}
                      isSelected={selectedStop?.id === stop.id}
                      onSelect={() => setSelectedStop(stop)}
                      onBookHostel={() => { setSelectedStop(stop); setSubPage("hostelDetails"); }}
                    />
                  </div>
                </div>
              );
            }

            if (item.type === "transit") {
              const leg = item.data as TransitLeg;
              const fromStop = trip.stops.find((s) => s.id === leg.fromStopId);
              const toStop = trip.stops.find((s) => s.id === leg.toStopId);
              if (!fromStop || !toStop) return null;

              return (
                <div key={`transit-${leg.id}`} className="relative flex gap-3">
                  <div className="relative z-[2] mt-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <TransitLegCard
                      leg={leg}
                      fromCity={fromStop.city}
                      toCity={toStop.city}
                      isSelected={selectedLeg?.id === leg.id}
                      onSelect={() => setSelectedLeg(leg)}
                      onBookTransport={() => { setSelectedLeg(leg); setSubPage("transportBooking"); }}
                    />
                  </div>
                </div>
              );
            }

            if (item.type === "insight") {
              const insight = item.data as Insight;
              return (
                <div key={`insight-${insight.id}`} className="relative flex gap-3">
                  <div className="relative z-[2] mt-3 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]/60" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <InsightCard
                      insight={insight}
                      onAction={() => {
                        if (insight.actionUrl) window.open(insight.actionUrl, "_blank");
                      }}
                    />
                  </div>
                </div>
              );
            }

            if (item.type === "alert") {
              return (
                <div key={`alert-${i}`} className="relative flex gap-3">
                  <div className="relative z-[2] mt-3 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B9D]/60" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CriticalAlertCard alert={item.data as PodAlert} onAction={() => {}} />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
