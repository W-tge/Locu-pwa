"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { formatDateRange, type Stop, type TransitLeg } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import {
  Bus,
  Ship,
  Train,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Bed,
  Info,
  AlertTriangle,
  Users,
  Truck,
  Anchor,
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
    case "shuttle":
    case "bus":
    default:
      return Bus;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "booked":
      return "text-[#00D4AA]";
    case "pending":
      return "text-[#FF6B9D]";
    default:
      return "text-primary";
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case "booked":
      return "bg-[#00D4AA]/10 border-[#00D4AA]/30";
    case "pending":
      return "bg-[#FF6B9D]/10 border-[#FF6B9D]/30";
    default:
      return "bg-primary/10 border-primary/30";
  }
}

// Flywheel Verify Pill Component
function VerifyPill({
  text,
  isVerified,
  verifiedCount,
  onVerify,
}: {
  text: string;
  isVerified: boolean;
  verifiedCount?: number;
  onVerify: () => void;
}) {
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    if (!isVerified) {
      onVerify();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all",
          isVerified
            ? "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/30"
            : "bg-muted text-muted-foreground border border-border hover:border-primary hover:text-primary"
        )}
      >
        {isVerified ? (
          <>
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified by {verifiedCount} travelers</span>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">{text}</span>
            <span className="text-primary font-semibold">[Confirm]</span>
          </>
        )}
      </button>
      {/* Karma toast */}
      {showToast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#00D4AA] text-white px-3 py-1 rounded-full text-xs font-bold animate-in fade-in slide-in-from-bottom-2 z-50 whitespace-nowrap shadow-lg shadow-[#00D4AA]/40">
          +10 Karma Points
        </div>
      )}
    </div>
  );
}

// Pod Alert Inline Card Component
function PodAlertCard({
  alert,
  onAction,
}: {
  alert: {
    style: string;
    title: string;
    body: string;
    action?: string;
    podAction?: string;
  };
  onAction: () => void;
}) {
  const isCritical = alert.style === "CRITICAL_INLINE_CARD";

  return (
    <div
      className={cn(
        "mx-4 my-2 rounded-xl p-3 border",
        isCritical
          ? "bg-gradient-to-r from-[#FF6B9D]/15 to-primary/15 border-[#FF6B9D]/30"
          : "bg-gradient-to-r from-[#7C3AED]/15 to-primary/15 border-[#7C3AED]/30"
      )}
    >
      <div className="flex items-start gap-2">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
            isCritical ? "bg-[#FF6B9D]/20" : "bg-[#7C3AED]/20"
          )}
        >
          {isCritical ? (
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B9D]" />
          ) : (
            <Users className="w-3.5 h-3.5 text-[#7C3AED]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground">{alert.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{alert.body}</p>
          {(alert.action || alert.podAction) && (
            <Button
              onClick={onAction}
              size="sm"
              className={cn(
                "mt-2 h-7 text-xs font-semibold",
                isCritical
                  ? "bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white"
                  : "bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white"
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

// Flywheel Request Card (in-stop)
function FlywheelRequestCard({
  request,
  onVerify,
}: {
  request: { type: string; text: string; action: string };
  onVerify: () => void;
}) {
  const [verified, setVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    onVerify();
  };

  return (
    <div className="relative mt-2 p-2 rounded-lg bg-muted/50 border border-dashed border-border">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">{request.text}</p>
        <button
          onClick={handleVerify}
          disabled={verified}
          className={cn(
            "px-2 py-1 rounded-full text-[10px] font-semibold transition-all",
            verified
              ? "bg-[#00D4AA]/20 text-[#00D4AA]"
              : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {verified ? "Verified" : request.action}
        </button>
      </div>
      {showToast && (
        <div className="absolute -top-6 right-0 bg-[#00D4AA] text-white px-3 py-1 rounded-full text-xs font-bold animate-in fade-in slide-in-from-bottom-2 z-50 whitespace-nowrap shadow-lg shadow-[#00D4AA]/40">
          +10 Karma Points
        </div>
      )}
    </div>
  );
}

export function TripTimeline({ compact = false }: { compact?: boolean }) {
  const { trip, selectedStop, selectedLeg, setSelectedStop, setSelectedLeg } =
    useTrip();
  const [verifiedLegs, setVerifiedLegs] = useState<Set<string>>(new Set());

  const handleVerifyLeg = (legId: string) => {
    setVerifiedLegs((prev) => new Set(prev).add(legId));
  };

  return (
    <div
      className={cn(
        "h-full overflow-y-auto scrollbar-hide",
        compact ? "pb-4" : "pb-24"
      )}
    >
      <div className={cn("space-y-1", compact ? "p-2" : "p-4")}>
        {trip.stops.map((stop, index) => {
          const transitLeg =
            index < trip.stops.length - 1
              ? trip.transitLegs.find((l) => l.fromStopId === stop.id)
              : null;

          const isSelected = selectedStop?.id === stop.id;
          const isActive = stop.status === "ACTIVE";

          return (
            <div key={stop.id}>
              {/* Stop Card */}
              <button
                onClick={() => setSelectedStop(stop)}
                className={cn(
                  "w-full text-left rounded-xl border transition-all",
                  compact ? "p-2" : "p-3",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : isActive
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-2">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "rounded-full flex items-center justify-center text-xs font-bold relative shadow-lg",
                        compact ? "w-6 h-6" : "w-8 h-8",
                        stop.bookingStatus === "booked"
                          ? "bg-[#00D4AA] text-white shadow-[#00D4AA]/40"
                          : stop.bookingStatus === "pending"
                            ? "bg-[#FF6B9D] text-white shadow-[#FF6B9D]/40"
                            : "bg-primary text-white shadow-primary/40"
                      )}
                    >
                      {index + 1}
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse border-2 border-card" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-bold text-foreground truncate",
                            compact ? "text-sm" : "text-base"
                          )}
                        >
                          {stop.city}
                        </h3>
                        {isActive && (
                          <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">
                            NOW
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>

                    <p
                      className={cn(
                        "text-muted-foreground",
                        compact ? "text-[10px]" : "text-xs"
                      )}
                    >
                      {stop.country}{" "}
                      <span className="opacity-50 mx-1">|</span>
                      {formatDateRange(stop.startDate, stop.endDate)}
                    </p>

                    {stop.highlight && !compact && (
                      <p className="text-[11px] text-[#7C3AED] mt-1 font-medium">
                        {stop.highlight}
                      </p>
                    )}

                    <div
                      className={cn(
                        "flex items-center gap-2 flex-wrap",
                        compact ? "mt-1" : "mt-2"
                      )}
                    >
                      <Badge
                        variant="secondary"
                        className={cn("font-normal", compact && "text-[9px]")}
                      >
                        {stop.nights} nights
                      </Badge>

                      {stop.hostelName ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal",
                            getStatusBg(stop.bookingStatus),
                            compact && "text-[9px]"
                          )}
                        >
                          <Bed className="w-3 h-3 mr-1" />
                          {compact
                            ? stop.hostelName.split(" ")[0]
                            : stop.hostelName}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal bg-primary/10 border-primary/30 text-primary",
                            compact && "text-[9px]"
                          )}
                        >
                          <Bed className="w-3 h-3 mr-1" />
                          Book
                        </Badge>
                      )}
                    </div>

                    {/* Flywheel Request (if present) */}
                    {stop.alerts &&
                      stop.alerts.length > 0 &&
                      !compact &&
                      stop.alerts.map((alert, i) => (
                        <FlywheelRequestCard
                          key={i}
                          request={alert}
                          onVerify={() => {}}
                        />
                      ))}
                  </div>
                </div>
              </button>

              {/* Pod Booking Alert (interrupts timeline) */}
              {stop.bookingAlert && !compact && (
                <PodAlertCard
                  alert={stop.bookingAlert}
                  onAction={() => setSelectedStop(stop)}
                />
              )}

              {/* Transit Leg */}
              {transitLeg && (
                <>
                  {/* Critical Alert before transit (e.g., border crossing) */}
                  {transitLeg.alert && !compact && (
                    <PodAlertCard
                      alert={transitLeg.alert}
                      onAction={() => setSelectedLeg(transitLeg)}
                    />
                  )}

                  <button
                    onClick={() => setSelectedLeg(transitLeg)}
                    className={cn(
                      "w-full text-left rounded-lg border transition-all flex items-center gap-2",
                      compact ? "my-0.5 ml-3 p-1.5" : "my-1 ml-4 p-2",
                      selectedLeg?.id === transitLeg.id
                        ? "border-secondary bg-secondary/10"
                        : "border-dashed border-border/50 hover:border-secondary/50 bg-transparent"
                    )}
                  >
                    {/* Transport Icon */}
                    {(() => {
                      const Icon = getTransportIcon(transitLeg.type);
                      return (
                        <div
                          className={cn(
                            "rounded-full flex items-center justify-center",
                            compact ? "w-5 h-5" : "w-6 h-6",
                            transitLeg.bookingStatus === "booked"
                              ? "bg-[#00D4AA]/20 text-[#00D4AA]"
                              : transitLeg.bookingStatus === "pending"
                                ? "bg-[#FF6B9D]/20 text-[#FF6B9D]"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className={cn(compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
                        </div>
                      );
                    })()}

                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          compact ? "text-[10px]" : "text-xs"
                        )}
                      >
                        <span className="font-medium text-foreground capitalize">
                          {transitLeg.mode || transitLeg.type}
                        </span>
                        <span className="text-muted-foreground">
                          {transitLeg.duration}
                        </span>
                        {transitLeg.price && (
                          <span className="text-muted-foreground">
                            ${transitLeg.price}
                          </span>
                        )}
                      </div>

                      {/* Flywheel verified data */}
                      {transitLeg.flywheelData && !compact && (
                        <div className="mt-1">
                          <VerifyPill
                            text={transitLeg.flywheelData}
                            isVerified={
                              verifiedLegs.has(transitLeg.id) ||
                              (transitLeg.verifiedCount ?? 0) > 0
                            }
                            verifiedCount={transitLeg.verifiedCount}
                            onVerify={() => handleVerifyLeg(transitLeg.id)}
                          />
                        </div>
                      )}

                      {/* Community tip */}
                      {transitLeg.communityTip && !compact && (
                        <div className="flex items-start gap-1 mt-1">
                          <Info className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                          <span className="text-[10px] text-muted-foreground">
                            {transitLeg.communityTip}
                            {transitLeg.verifiedCount && (
                              <span className="text-[#00D4AA] ml-1 font-medium">
                                (Verified by {transitLeg.verifiedCount})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {(() => {
                      const StatusIcon =
                        transitLeg.bookingStatus === "booked"
                          ? CheckCircle2
                          : transitLeg.bookingStatus === "pending"
                            ? Clock
                            : Circle;
                      return (
                        <StatusIcon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            getStatusColor(transitLeg.bookingStatus)
                          )}
                        />
                      );
                    })()}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
