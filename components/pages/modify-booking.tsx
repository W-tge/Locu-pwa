"use client";

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { formatDateRange } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Bed,
  Bus,
  Anchor,
  Train,
  Plane,
  Truck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  Star,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";

// --------------- helpers ---------------

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry":
      return Anchor;
    case "train":
      return Train;
    case "jeep":
      return Truck;
    case "flight":
      return Plane;
    default:
      return Bus;
  }
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function fmtShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// demo alternative date windows
function generateDateOptions(base: string, nights: number) {
  return [
    { label: "2 days earlier", start: addDays(base, -2), end: addDays(base, -2 + nights), delta: -2 },
    { label: "1 day earlier", start: addDays(base, -1), end: addDays(base, -1 + nights), delta: -1 },
    { label: "Current dates", start: base, end: addDays(base, nights), delta: 0 },
    { label: "1 day later", start: addDays(base, 1), end: addDays(base, 1 + nights), delta: 1 },
    { label: "2 days later", start: addDays(base, 2), end: addDays(base, 2 + nights), delta: 2 },
  ];
}

// demo alternative durations
const durationOptions = [
  { nights: -1, label: "1 fewer night", priceMult: -1 },
  { nights: 0, label: "Keep current", priceMult: 0 },
  { nights: 1, label: "1 extra night", priceMult: 1 },
  { nights: 2, label: "2 extra nights", priceMult: 2 },
];

// demo transport alternatives
function generateTransitAlternatives(operator: string | undefined, price: number) {
  const base = price || 12;
  return [
    { id: "alt-1", time: "06:00", operator: "Pullman", price: Math.round(base * 0.7), seats: 18, tag: "Budget" },
    { id: "alt-2", time: "09:30", operator: operator || "Cruz del Sur", price: base, seats: 6, tag: "Current" },
    { id: "alt-3", time: "14:00", operator: "Tica Bus", price: Math.round(base * 0.85), seats: 22, tag: "Afternoon" },
    { id: "alt-4", time: "21:00", operator: "Linea Dorada", price: Math.round(base * 1.4), seats: 8, tag: "Night / Cama" },
  ];
}

// --------------- component ---------------

export function ModifyBooking() {
  const {
    trip,
    selectedStop,
    selectedLeg,
    setSubPage,
    setSelectedStop,
    setSelectedLeg,
    updateStopBooking,
    updateStopDates,
    updateLegBooking,
  } = useTrip();
  const { showToast } = useLocuToast();

  const isTransit = !!selectedLeg;
  const isHostel = !!selectedStop && !selectedLeg;

  // ---- hostel state ----
  const [selectedDateIdx, setSelectedDateIdx] = useState(2); // default = current
  const [selectedDurIdx, setSelectedDurIdx] = useState(1); // default = keep
  const [showConfirm, setShowConfirm] = useState(false);

  const dateOptions = useMemo(
    () =>
      selectedStop
        ? generateDateOptions(selectedStop.startDate, selectedStop.nights)
        : [],
    [selectedStop],
  );

  const hostelPrice = selectedStop?.hostelPrice || 18;
  const currentNights = selectedStop?.nights || 3;
  const durDelta = durationOptions[selectedDurIdx]?.nights || 0;
  const newNights = Math.max(1, currentNights + durDelta);
  const newTotal = hostelPrice * newNights;
  const oldTotal = hostelPrice * currentNights;
  const priceDiff = newTotal - oldTotal;

  // ---- transit state ----
  const [selectedAltIdx, setSelectedAltIdx] = useState(1); // default = current
  const [showTransitConfirm, setShowTransitConfirm] = useState(false);

  const transitAlts = useMemo(
    () => generateTransitAlternatives(selectedLeg?.operator, selectedLeg?.price || 12),
    [selectedLeg],
  );

  const fromStop = selectedLeg
    ? trip.stops.find((s) => s.id === selectedLeg.fromStopId)
    : null;
  const toStop = selectedLeg
    ? trip.stops.find((s) => s.id === selectedLeg.toStopId)
    : null;

  // ---- no data guard ----
  if (!selectedStop && !selectedLeg) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No booking selected to modify.</p>
      </div>
    );
  }

  // ---- handlers ----
  const handleHostelConfirm = () => {
    if (selectedStop) {
      const opt = dateOptions[selectedDateIdx];
      if (opt) {
        updateStopDates(selectedStop.id, opt.start, opt.end);
      }
      showToast(`Booking updated: ${selectedStop.city} - ${newNights} nights`, "success");
      setSubPage("bookingDetails");
    }
  };

  const handleTransitConfirm = () => {
    if (selectedLeg) {
      showToast(
        `Transport updated: ${transitAlts[selectedAltIdx].operator} at ${transitAlts[selectedAltIdx].time}`,
        "success",
      );
      setSubPage("transitBookingDetails");
    }
  };

  const handleBack = () => {
    if (isTransit) setSubPage("transitBookingDetails");
    else setSubPage("bookingDetails");
  };

  // ================ TRANSIT MODIFY ================
  if (isTransit && selectedLeg) {
    const TransportIcon = getTransportIcon(selectedLeg.type);
    return (
      <div className="h-full flex flex-col bg-background">
        {/* header */}
        <div className="shrink-0 border-b border-black/5 glass-panel px-4 py-3 flex items-center gap-3">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-lg text-foreground">Modify Transport</h1>
            <p className="text-xs text-muted-foreground">
              {fromStop?.city} to {toStop?.city}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* current booking summary */}
          <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
              <TransportIcon className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {selectedLeg.operator || "Operator"} &middot; {selectedLeg.departureTime || "TBD"}
              </p>
              <p className="text-xs text-muted-foreground">{selectedLeg.duration} &middot; ${selectedLeg.price}</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-[#10B981] text-[#10B981]">
              Current
            </Badge>
          </div>

          {/* alternative options */}
          <div>
            <h3 className="micro-label mb-3">Available Alternatives</h3>
            <div className="space-y-2">
              {transitAlts.map((alt, idx) => {
                const isCurrent = alt.tag === "Current";
                const isSelected = idx === selectedAltIdx;
                return (
                  <button
                    key={alt.id}
                    onClick={() => setSelectedAltIdx(idx)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-4 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            isSelected ? "gradient-vibrant" : "bg-muted",
                          )}
                        >
                          <Clock
                            className={cn("w-5 h-5", isSelected ? "text-white" : "text-muted-foreground")}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{alt.time}</span>
                            <Badge
                              className={cn(
                                "text-[10px]",
                                isCurrent
                                  ? "bg-[#10B981]/10 text-[#10B981]"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {alt.tag}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alt.operator} &middot; {alt.seats} seats left
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-mono font-bold text-lg",
                            isSelected ? "text-primary" : "text-foreground",
                          )}
                        >
                          ${alt.price}
                        </p>
                        {!isCurrent && (
                          <p
                            className={cn(
                              "text-[10px] font-medium",
                              alt.price < (selectedLeg.price || 12) ? "text-[#10B981]" : "text-[#F59E0B]",
                            )}
                          >
                            {alt.price < (selectedLeg.price || 12)
                              ? `Save $${(selectedLeg.price || 12) - alt.price}`
                              : `+$${alt.price - (selectedLeg.price || 12)}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && !isCurrent && (
                      <div className="mt-3 pt-3 border-t border-dashed border-primary/20 flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          Switch to {alt.operator} departing at {alt.time}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* confirmation inline */}
          {showTransitConfirm && (
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
              <p className="font-semibold text-foreground text-sm mb-1">Confirm modification?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Switching to {transitAlts[selectedAltIdx].operator} at{" "}
                {transitAlts[selectedAltIdx].time} for ${transitAlts[selectedAltIdx].price}.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gradient-vibrant text-white" onClick={handleTransitConfirm}>
                  Confirm Change
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowTransitConfirm(false)}
                >
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
          <Button
            onClick={() => setShowTransitConfirm(true)}
            disabled={selectedAltIdx === 1}
            className="w-full gradient-vibrant text-white font-semibold shadow-lg disabled:opacity-50"
          >
            {selectedAltIdx === 1 ? "Select a Different Option" : `Apply Changes - $${transitAlts[selectedAltIdx].price}`}
          </Button>
        </div>
      </div>
    );
  }

  // ================ HOSTEL MODIFY ================
  return (
    <div className="h-full flex flex-col bg-background">
      {/* header */}
      <div className="shrink-0 border-b border-black/5 glass-panel px-4 py-3 flex items-center gap-3">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-serif text-lg text-foreground">Modify Booking</h1>
          <p className="text-xs text-muted-foreground">
            {selectedStop?.hostelName || selectedStop?.city}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* current booking summary */}
        <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="font-semibold text-[#10B981] text-sm">Current Booking</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/60 rounded-lg p-2">
              <p className="micro-label">Dates</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {selectedStop
                  ? formatDateRange(selectedStop.startDate, selectedStop.endDate)
                  : ""}
              </p>
            </div>
            <div className="bg-white/60 rounded-lg p-2">
              <p className="micro-label">Nights</p>
              <p className="text-sm font-mono font-bold text-foreground mt-0.5">{currentNights}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-2">
              <p className="micro-label">Total</p>
              <p className="text-sm font-mono font-bold text-foreground mt-0.5">${oldTotal}</p>
            </div>
          </div>
        </div>

        {/* --- date picker section --- */}
        <div>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            Change Check-in Date
          </h3>
          <div className="space-y-2">
            {dateOptions.map((opt, idx) => {
              const isCurrent = opt.delta === 0;
              const isSelected = idx === selectedDateIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIdx(idx)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl border-2 p-3.5 transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isSelected ? "gradient-vibrant" : "bg-muted",
                      )}
                    >
                      <Calendar
                        className={cn("w-4 h-4", isSelected ? "text-white" : "text-muted-foreground")}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{fmtShort(opt.start)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        to {fmtShort(opt.end)}
                        {isCurrent && " (current)"}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge variant="outline" className="text-[10px] border-[#10B981] text-[#10B981]">
                      Current
                    </Badge>
                  )}
                  {isSelected && !isCurrent && (
                    <div className="w-5 h-5 rounded-full gradient-vibrant flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- duration section --- */}
        <div>
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            Adjust Duration
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {durationOptions.map((opt, idx) => {
              const isSelected = idx === selectedDurIdx;
              const adjNights = Math.max(1, currentNights + opt.nights);
              const adjTotal = hostelPrice * adjNights;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDurIdx(idx)}
                  className={cn(
                    "rounded-xl border-2 p-3 text-center transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/30",
                  )}
                >
                  <p className="font-mono text-lg font-bold text-foreground">
                    {adjNights} <span className="text-xs font-normal text-muted-foreground">nights</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{opt.label}</p>
                  <p
                    className={cn(
                      "text-xs font-semibold mt-1",
                      opt.nights === 0
                        ? "text-muted-foreground"
                        : opt.nights < 0
                          ? "text-[#10B981]"
                          : "text-[#F59E0B]",
                    )}
                  >
                    ${adjTotal}
                    {opt.nights !== 0 && (
                      <span className="text-[10px]">
                        {" "}
                        ({opt.nights < 0 ? "-" : "+"}${Math.abs(hostelPrice * opt.nights)})
                      </span>
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- price summary --- */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3">Updated Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">New dates</span>
              <span className="font-medium text-foreground">
                {fmtShort(dateOptions[selectedDateIdx]?.start || "")} -{" "}
                {fmtShort(dateOptions[selectedDateIdx]?.end || "")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">{newNights} nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium text-foreground">${hostelPrice}/night</span>
            </div>
            <div className="border-t border-dashed border-border my-2" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">New Total</span>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-foreground">${newTotal}</span>
                {priceDiff !== 0 && (
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      priceDiff < 0 ? "text-[#10B981]" : "text-[#F59E0B]",
                    )}
                  >
                    {priceDiff < 0 ? `Save $${Math.abs(priceDiff)}` : `+$${priceDiff}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* optional warning */}
        {(selectedDateIdx !== 2 || selectedDurIdx !== 1) && (
          <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/5 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Modifying dates may affect availability. Changes are subject to hostel confirmation, typically within a few hours.
            </p>
          </div>
        )}

        {/* confirm inline */}
        {showConfirm && (
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
            <p className="font-semibold text-foreground text-sm mb-1">Confirm modification?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Your booking at {selectedStop?.hostelName} will be updated to {newNights} nights
              starting {fmtShort(dateOptions[selectedDateIdx]?.start || "")}.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 gradient-vibrant text-white" onClick={handleHostelConfirm}>
                Confirm Changes
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowConfirm(false)}
              >
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
        {!showConfirm ? (
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={selectedDateIdx === 2 && selectedDurIdx === 1}
            className="w-full gradient-vibrant text-white font-semibold shadow-lg disabled:opacity-50"
          >
            {selectedDateIdx === 2 && selectedDurIdx === 1
              ? "Make a Change Above"
              : `Apply Changes - $${newTotal}`}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
