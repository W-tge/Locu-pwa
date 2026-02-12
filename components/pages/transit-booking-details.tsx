"use client";

import { useEffect } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Train,
  Truck,
  Anchor,
  Plane,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Edit3,
  Trash2,
  Compass,
  Users,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry": return Anchor;
    case "train": return Train;
    case "jeep": return Truck;
    case "flight": return Plane;
    default: return Bus;
  }
}

export function TransitBookingDetails() {
  const { trip, selectedLeg, setSelectedLeg, setSubPage, updateLegBooking } = useTrip();
  const { showToast } = useLocuToast();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!selectedLeg) setSubPage("bookings");
  }, [selectedLeg, setSubPage]);

  if (!selectedLeg) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm">Taking you back to bookings…</p>
        </div>
      </div>
    );
  }

  const fromStop = trip.stops.find(s => s.id === selectedLeg.fromStopId);
  const toStop = trip.stops.find(s => s.id === selectedLeg.toStopId);
  const TransportIcon = getTransportIcon(selectedLeg.type);

  const handleCancelBooking = () => {
    updateLegBooking(selectedLeg.id, "not-booked");
    showToast(`Transport booking cancelled: ${fromStop?.city} to ${toStop?.city}`, "info");
    setShowCancelConfirm(false);
    setSubPage(null);
    setSelectedLeg(null);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={() => { setSubPage("bookings"); setSelectedLeg(null); }}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-serif text-lg text-foreground">Transport Booking</h2>
          <p className="text-xs text-muted-foreground">Confirmation Details</p>
        </div>
        <Badge className="bg-[#10B981]/10 border-[#10B981] text-[#10B981] text-xs font-semibold" variant="outline">
          Confirmed
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Route Card */}
        <div className="bg-[#FFFEF9] paper-texture rounded-2xl paper-shadow p-5 border border-[#DDD8CC]">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <p className="micro-label">From</p>
              <p className="text-xl font-bold text-foreground">{fromStop?.city || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">{fromStop?.country}</p>
            </div>
            <div className="flex flex-col items-center gap-1 px-3">
              <div className="w-10 h-10 rounded-full gradient-vibrant flex items-center justify-center">
                <TransportIcon className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-center flex-1">
              <p className="micro-label">To</p>
              <p className="text-xl font-bold text-foreground">{toStop?.city || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">{toStop?.country}</p>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="border-t-2 border-dashed border-[#DDD8CC] my-4" />

          {/* Booking details grid */}
          <div className="grid grid-cols-2 gap-3">
            {selectedLeg.operator && (
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="micro-label">Operator</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{selectedLeg.operator}</p>
              </div>
            )}
            <div className="bg-muted/40 rounded-lg p-3">
              <p className="micro-label">Type</p>
              <p className="font-semibold text-foreground text-sm mt-0.5 capitalize">{selectedLeg.mode || selectedLeg.type}</p>
            </div>
            {selectedLeg.departureDate && (
              <div className="bg-muted/40 rounded-lg p-3">
                <div className="flex items-center gap-1 micro-label"><Calendar className="w-3 h-3" /> Date</div>
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            )}
            {selectedLeg.departureTime && (
              <div className="bg-muted/40 rounded-lg p-3">
                <div className="flex items-center gap-1 micro-label"><Clock className="w-3 h-3" /> Departure</div>
                <p className="font-semibold text-foreground text-sm mt-0.5">{selectedLeg.departureTime}</p>
              </div>
            )}
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center gap-1 micro-label"><Clock className="w-3 h-3" /> Duration</div>
              <p className="font-semibold text-foreground text-sm mt-0.5">{selectedLeg.duration}</p>
            </div>
            {selectedLeg.price && (
              <div className="bg-muted/40 rounded-lg p-3">
                <div className="flex items-center gap-1 micro-label"><DollarSign className="w-3 h-3" /> Total</div>
                <p className="font-bold text-[#10B981] text-lg mt-0.5">${selectedLeg.price}</p>
              </div>
            )}
          </div>

          {/* Barcode decoration */}
          <div className="flex items-end justify-center gap-[1px] h-8 mt-5 opacity-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="bg-foreground" style={{ width: 2, height: `${30 + Math.sin(i * 1.3) * 50}%` }} />
            ))}
          </div>
        </div>

        {/* Confirmed status card */}
        <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span className="font-semibold text-[#10B981]">Booking Confirmed</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your transport from {fromStop?.city} to {toStop?.city} is confirmed. Please arrive at the terminal 30 minutes before departure.
          </p>
        </div>

        {/* Community Tip */}
        {selectedLeg.communityTip && (
          <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/5 p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">{selectedLeg.communityTip}</p>
                {selectedLeg.verifiedCount && (
                  <p className="text-[10px] text-[#92710C] mt-1 font-medium">Verified by {selectedLeg.verifiedCount} travellers</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alert */}
        {selectedLeg.alert && (
          <div className="rounded-xl border border-[#FF6B9D]/40 bg-[#FF6B9D]/5 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF6B9D] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground text-sm">{selectedLeg.alert.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedLeg.alert.body}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancel confirmation */}
        {showCancelConfirm && (
          <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4">
            <p className="font-semibold text-foreground text-sm mb-1">Cancel this transport booking?</p>
            <p className="text-xs text-muted-foreground mb-3">This will release your seat and you will need to rebook.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" className="flex-1" onClick={handleCancelBooking}>
                Yes, Cancel
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCancelConfirm(false)}>
                Keep Booking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="shrink-0 p-4 border-t border-border space-y-2">
        <Button
          onClick={() => setSubPage("modifyBooking")}
          className="w-full gradient-vibrant text-white font-semibold shadow-lg"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Modify Booking
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/5 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => setSubPage("transportBooking")}
            className="flex-1 bg-transparent"
          >
            <Compass className="w-4 h-4 mr-1" />
            Other Options
          </Button>
        </div>
      </div>
    </div>
  );
}
