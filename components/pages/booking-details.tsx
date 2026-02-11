"use client";

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { formatDateRange, getStopIndex } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Star,
  CheckCircle2,
  Cloud,
  Wifi,
  Coffee,
  Users,
  Edit3,
  Trash2,
  Compass,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function BookingDetails() {
  const { trip, selectedStop, setSubPage, updateStopBooking, setSelectedStop } = useTrip();
  const { showToast } = useLocuToast();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!selectedStop) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No booking selected.</p>
      </div>
    );
  }

  const stopIndex = getStopIndex(trip, selectedStop.id);

  const handleCancelBooking = () => {
    updateStopBooking(selectedStop.id, "not-booked");
    showToast(`Booking cancelled for ${selectedStop.city}`, "info");
    setShowCancelConfirm(false);
    setSubPage(null);
    setSelectedStop(null);
  };

  const handleModifyBooking = () => {
    showToast("Opening modification options...", "info");
    setSubPage("hostelDetails");
  };

  const handleExploreOthers = () => {
    setSubPage("hostelDetails");
  };

  // Mock data for the booked hostel details
  const amenities = ["Free WiFi", "Breakfast", "Shared Kitchen", "Lockers", "Common Area", "Tours"];
  const checkInTime = "14:00";
  const checkOutTime = "11:00";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-black/5 glass-panel px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSubPage(null); setSelectedStop(null); }}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-lg text-foreground">Booking Details</h1>
            <p className="text-xs text-muted-foreground">{selectedStop.city}, {selectedStop.country}</p>
          </div>
          <Badge className="bg-[#10B981]/10 border-[#10B981] text-[#10B981] text-xs font-semibold" variant="outline">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hostel Hero Image */}
        {selectedStop.hostelImage && (
          <div className="relative h-44 w-full">
            <Image
              src={selectedStop.hostelImage || "/placeholder.svg"}
              alt={selectedStop.hostelName || "Hostel"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white bg-[#10B981]"
                )}>
                  {stopIndex}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white drop-shadow-md">{selectedStop.hostelName || "Hostel"}</h2>
                  <p className="text-sm text-white/80 drop-shadow-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedStop.city}, {selectedStop.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* If no image, show hostel name here */}
          {!selectedStop.hostelImage && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white bg-[#10B981]">
                {stopIndex}
              </div>
              <div>
                <h2 className="text-xl font-serif text-foreground">{selectedStop.hostelName || "Accommodation"}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {selectedStop.city}, {selectedStop.country}
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Card */}
          <div className="bg-[#10B981]/5 border-2 border-[#10B981]/30 rounded-xl p-4 paper-texture">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <span className="font-semibold text-[#10B981]">Accommodation Confirmed</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="micro-label">Check-in</p>
                <p className="font-mono font-bold text-foreground">{checkInTime}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedStop.startDate ? new Date(selectedStop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="micro-label">Check-out</p>
                <p className="font-mono font-bold text-foreground">{checkOutTime}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedStop.endDate ? new Date(selectedStop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="micro-label">Duration</p>
                <p className="font-mono font-bold text-foreground">{selectedStop.nights} {selectedStop.nights === 1 ? "night" : "nights"}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="micro-label">Price</p>
                <p className="font-mono font-bold text-primary">${selectedStop.hostelPrice}<span className="text-xs text-muted-foreground font-normal">/night</span></p>
              </div>
            </div>

            {/* Total */}
            <div className="mt-3 pt-3 border-t border-dashed border-[#10B981]/30 flex items-center justify-between">
              <span className="micro-label">Total Cost</span>
              <span className="font-mono font-bold text-lg text-foreground">
                ${(selectedStop.hostelPrice || 0) * selectedStop.nights}
              </span>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl bg-muted/40 p-3 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span className="micro-label">Dates</span>
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {formatDateRange(selectedStop.startDate, selectedStop.endDate)}
              </p>
            </div>
            {selectedStop.weather && (
              <div className="rounded-xl bg-muted/40 p-3 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Cloud className="w-3.5 h-3.5" />
                  <span className="micro-label">Weather</span>
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">{selectedStop.weather}</p>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <p className="micro-label mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map(a => (
                <span key={a} className="px-3 py-1.5 rounded-lg bg-[#1B6B4A]/10 text-[#1B6B4A] text-xs font-semibold border border-[#1B6B4A]/20">{a}</span>
              ))}
            </div>
          </div>

          {/* Check-in Info */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground text-sm mb-2">Check-in Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Check-in from {checkInTime}, Check-out by {checkOutTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>Mixed dormitory - bed assigned on arrival</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wifi className="w-4 h-4" />
                <span>Free WiFi available throughout</span>
              </div>
            </div>
          </div>

          {/* Cancel Confirmation */}
          {showCancelConfirm && (
            <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive mb-2">Cancel this booking?</p>
              <p className="text-xs text-muted-foreground mb-3">This action will release your reservation at {selectedStop.hostelName}.</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1 text-xs"
                  onClick={handleCancelBooking}
                >
                  Yes, Cancel Booking
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="shrink-0 p-4 border-t border-black/5 glass-panel space-y-2">
        <Button
          onClick={handleModifyBooking}
          className="w-full gradient-vibrant text-white font-semibold shadow-lg"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Modify Booking
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-xs font-semibold bg-transparent"
            onClick={() => setShowCancelConfirm(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Cancel Booking
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-xs font-semibold bg-transparent"
            onClick={handleExploreOthers}
          >
            <Compass className="w-3.5 h-3.5 mr-1" />
            Explore Other Hostels
          </Button>
        </div>
      </div>
    </div>
  );
}
