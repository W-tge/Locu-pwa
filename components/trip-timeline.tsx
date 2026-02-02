"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { formatDateRange, getStopIndex, type Stop, type TransitLeg, type Insight } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Bus,
  Ship,
  Train,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Bed,
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
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry":
      return Anchor;
    case "train":
      return Train;
    case "jeep":
      return Truck;
    case "colectivo":
    case "shuttle":
    case "bus":
    default:
      return Bus;
  }
}

function getInsightIcon(icon: string) {
  switch (icon) {
    case "dollar": return DollarSign;
    case "document": return FileText;
    case "weather": return CloudRain;
    case "health": return Heart;
    case "safety": return Shield;
    default: return Info;
  }
}

// Destination Card Component
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
  const isPending = stop.bookingStatus === "pending";
  const isActive = stop.status === "ACTIVE";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card overflow-hidden transition-all",
        isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-border hover:border-primary/50"
      )}
    >
      <button onClick={onSelect} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          {/* Stop number circle */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 relative",
            isBooked ? "bg-[#7C3AED]" : isPending ? "bg-[#FF6B9D]" : "bg-primary"
          )}>
            {stopIndex}
            {isActive && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-card" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">{stop.city}, {stop.country}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>{stop.nights} days</span>
                </div>
              </div>
              
              {/* Status badge */}
              <Badge className={cn(
                "shrink-0 font-semibold",
                isBooked ? "bg-[#7C3AED] text-white" :
                isPending ? "bg-[#FF6B9D] text-white" :
                "bg-primary/10 text-primary border border-primary/30"
              )}>
                {isBooked ? "Hostel Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>

            {stop.highlight && (
              <p className="text-sm text-[#7C3AED] font-medium mt-2">{stop.highlight}</p>
            )}
          </div>
        </div>
      </button>

      {/* Booked hostel card */}
      {isBooked && stop.hostelName && (
        <div className="px-4 pb-4">
          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3 border border-border/50">
            {stop.hostelImage && (
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative bg-muted">
                <Image src={stop.hostelImage || "/placeholder.svg"} alt={stop.hostelName} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{stop.hostelName}</p>
              <p className="text-xs text-muted-foreground">{stop.nights} nights</p>
              <p className="text-sm font-bold text-[#7C3AED] mt-1">${stop.hostelPrice ? stop.hostelPrice * stop.nights : 0}</p>
              <button className="text-xs text-primary hover:underline mt-1">Click to view details</button>
            </div>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Book hostel button */}
      {!isBooked && (
        <div className="px-4 pb-4">
          <Button
            onClick={(e) => { e.stopPropagation(); onBookHostel(); }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Explore & Book Hostels
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Transit Leg Card Component
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
  const isPending = leg.bookingStatus === "pending";
  const Icon = getTransportIcon(leg.type);

  return (
    <div className={cn(
      "rounded-xl border bg-card overflow-hidden transition-all ml-5",
      isSelected ? "border-[#FF6B9D] shadow-md" : "border-dashed border-border/70 hover:border-[#FF6B9D]/50"
    )}>
      <button onClick={onSelect} className="w-full text-left p-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            isBooked ? "bg-[#7C3AED]/20 text-[#7C3AED]" :
            isPending ? "bg-[#FF6B9D]/20 text-[#FF6B9D]" :
            "bg-primary/10 text-primary"
          )}>
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{fromCity} → {toCity}</span>
              <Badge className={cn(
                "text-[10px] font-semibold",
                isBooked ? "bg-[#7C3AED] text-white" :
                isPending ? "bg-[#FF6B9D] text-white" :
                "bg-primary text-white"
              )}>
                {isBooked ? "Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="capitalize">{leg.mode || leg.type}</span>
              <span>{leg.duration}</span>
              {leg.price && <span className="font-semibold text-foreground">${leg.price}</span>}
            </div>
          </div>

          {leg.transportOptions && leg.transportOptions.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View Options ({leg.transportOptions.length})
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
            </button>
          )}
        </div>
      </button>

      {/* Transport options */}
      {expanded && leg.transportOptions && (
        <div className="px-3 pb-3 space-y-2 border-t border-border/50 pt-3">
          {leg.transportOptions.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
              <div>
                <p className="font-medium">{option.operator}</p>
                <p className="text-xs text-muted-foreground">{option.departureTime} - {option.arrivalTime}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">${option.price}</p>
                {option.seatsLeft && (
                  <p className="text-[10px] text-[#FF6B9D]">{option.seatsLeft} seats left</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book button for unbooked */}
      {!isBooked && (
        <div className="px-3 pb-3 border-t border-border/50 pt-3">
          <Button
            onClick={(e) => { e.stopPropagation(); onBookTransport(); }}
            size="sm"
            variant="outline"
            className="w-full border-primary/50 text-primary hover:bg-primary/10 font-semibold"
          >
            View Transport Options
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Insight Card Component
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

  return (
    <div className={cn(
      "rounded-xl p-4 border ml-5",
      isAlert ? "bg-[#FF6B9D]/5 border-[#FF6B9D]/30" :
      isReminder ? "bg-[#FBBF24]/5 border-[#FBBF24]/30" :
      "bg-[#7C3AED]/5 border-[#7C3AED]/30"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isAlert ? "bg-[#FF6B9D]/20 text-[#FF6B9D]" :
          isReminder ? "bg-[#FBBF24]/20 text-[#FBBF24]" :
          "bg-[#7C3AED]/20 text-[#7C3AED]"
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-bold text-sm",
            isAlert ? "text-[#FF6B9D]" :
            isReminder ? "text-[#FBBF24]" :
            "text-[#7C3AED]"
          )}>{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{insight.body}</p>
          {insight.action && (
            <Button
              onClick={onAction}
              size="sm"
              className={cn(
                "mt-3 h-8 font-semibold",
                isAlert ? "bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white" :
                isReminder ? "bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-foreground" :
                "bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white"
              )}
            >
              {insight.action}
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Critical Alert Card
function CriticalAlertCard({
  alert,
  onAction,
}: {
  alert: { style: string; title: string; body: string; action?: string; podAction?: string };
  onAction: () => void;
}) {
  const isCritical = alert.style === "CRITICAL_INLINE_CARD";

  return (
    <div className={cn(
      "rounded-xl p-4 border ml-5",
      isCritical
        ? "bg-gradient-to-r from-[#FF6B9D]/10 to-primary/10 border-[#FF6B9D]/40"
        : "bg-gradient-to-r from-[#7C3AED]/10 to-primary/10 border-[#7C3AED]/40"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isCritical ? "bg-[#FF6B9D]/20" : "bg-[#7C3AED]/20"
        )}>
          {isCritical ? (
            <AlertTriangle className="w-4 h-4 text-[#FF6B9D]" />
          ) : (
            <Users className="w-4 h-4 text-[#7C3AED]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground">{alert.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{alert.body}</p>
          {(alert.action || alert.podAction) && (
            <Button
              onClick={onAction}
              size="sm"
              className={cn(
                "mt-3 h-8 font-semibold",
                isCritical ? "bg-[#FF6B9D] hover:bg-[#FF6B9D]/90" : "bg-[#7C3AED] hover:bg-[#7C3AED]/90"
              )}
            >
              {alert.action || alert.podAction}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TripTimeline({ compact = false }: { compact?: boolean }) {
  const { trip, selectedStop, selectedLeg, setSelectedStop, setSelectedLeg, setSubPage } = useTrip();

  // Build chronological timeline items
  const timelineItems: Array<{
    type: "stop" | "transit" | "insight" | "alert";
    date: string;
    data: Stop | TransitLeg | Insight | any;
    stopIndex?: number;
  }> = [];

  trip.stops.forEach((stop, index) => {
    // Add stop
    timelineItems.push({ type: "stop", date: stop.startDate, data: stop, stopIndex: index + 1 });

    // Add insight if related to this stop
    const relatedInsight = trip.insights.find(i => i.relatedStopId === stop.id);
    if (relatedInsight) {
      timelineItems.push({ type: "insight", date: stop.startDate, data: relatedInsight });
    }

    // Add pod/booking alert if present
    if (stop.bookingAlert) {
      timelineItems.push({ type: "alert", date: stop.startDate, data: stop.bookingAlert });
    }

    // Add transit leg
    const transitLeg = trip.transitLegs.find(l => l.fromStopId === stop.id);
    if (transitLeg) {
      // Add critical alert before transit if present
      if (transitLeg.alert) {
        timelineItems.push({ type: "alert", date: transitLeg.departureDate || stop.endDate, data: transitLeg.alert });
      }
      timelineItems.push({ type: "transit", date: transitLeg.departureDate || stop.endDate, data: transitLeg });
    }
  });

  return (
    <div className={cn("h-full overflow-y-auto scrollbar-hide", compact ? "pb-4" : "pb-24")}>
      {/* Trip header */}
      <div className="p-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold text-foreground">{trip.name}</h2>
        <p className="text-sm text-muted-foreground">{trip.description} | {trip.stops.length} stops</p>
      </div>

      <div className={cn("space-y-3", compact ? "p-2" : "p-4")}>
        {timelineItems.map((item, i) => {
          if (item.type === "stop") {
            const stop = item.data as Stop;
            return (
              <DestinationCard
                key={`stop-${stop.id}`}
                stop={stop}
                stopIndex={item.stopIndex!}
                isSelected={selectedStop?.id === stop.id}
                onSelect={() => setSelectedStop(stop)}
                onBookHostel={() => setSelectedStop(stop)}
              />
            );
          }

          if (item.type === "transit") {
            const leg = item.data as TransitLeg;
            const fromStop = trip.stops.find(s => s.id === leg.fromStopId);
            const toStop = trip.stops.find(s => s.id === leg.toStopId);
            if (!fromStop || !toStop) return null;

            return (
              <TransitLegCard
                key={`transit-${leg.id}`}
                leg={leg}
                fromCity={fromStop.city}
                toCity={toStop.city}
                isSelected={selectedLeg?.id === leg.id}
                onSelect={() => setSelectedLeg(leg)}
                onBookTransport={() => setSelectedLeg(leg)}
              />
            );
          }

          if (item.type === "insight") {
            const insight = item.data as Insight;
            return (
              <InsightCard
                key={`insight-${insight.id}`}
                insight={insight}
                onAction={() => {
                  if (insight.actionUrl) window.open(insight.actionUrl, "_blank");
                }}
              />
            );
          }

          if (item.type === "alert") {
            return (
              <CriticalAlertCard
                key={`alert-${i}`}
                alert={item.data}
                onAction={() => {}}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
