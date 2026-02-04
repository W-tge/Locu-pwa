"use client";

import { useTrip } from "@/lib/trip-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MapPin,
  Bed,
  Bus,
  CreditCard,
  Download,
  Share2,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingConfirmationProps {
  type: "hostel" | "transport";
  bookingId: string;
}

export function BookingConfirmation({ type, bookingId }: BookingConfirmationProps) {
  const { setSubPage, trip } = useTrip();

  // Mock booking data based on type
  const bookingData = type === "hostel" 
    ? {
        title: "Hostel Booking Confirmed",
        name: "Earth Lodge",
        location: "Antigua, Guatemala",
        dates: "Feb 1 - Feb 7, 2026",
        details: "8-bed mixed dorm · 6 nights",
        price: "$72.00",
        reference: `HL-${bookingId}`,
        icon: Bed,
      }
    : {
        title: "Transport Booking Confirmed",
        name: "Pullman Bus",
        location: "Antigua → Lake Atitlan",
        dates: "Feb 7, 2026 · 07:00",
        details: "Semi-cama · 3h journey",
        price: "$25.00",
        reference: `TR-${bookingId}`,
        icon: Bus,
      };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setSubPage(null)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Booking Confirmation</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Success Animation */}
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{bookingData.title}</h2>
          <p className="text-muted-foreground mt-2">Reference: {bookingData.reference}</p>
        </div>

        {/* Booking Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mt-4">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center shrink-0">
                <bookingData.icon className="w-6 h-6 text-[#10B981]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground">{bookingData.name}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {bookingData.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Dates
                </div>
                <p className="font-semibold text-sm">{bookingData.dates}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Total
                </div>
                <p className="font-bold text-lg text-[#10B981]">{bookingData.price}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">{bookingData.details}</p>
          </div>

          {/* Actions */}
          <div className="border-t border-border p-4 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <h4 className="font-bold text-foreground mb-2">What happens next?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              Confirmation email sent to your inbox
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              Booking added to your travel wallet
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              Offline access available in your documents
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-card">
        <Button onClick={() => setSubPage(null)} className="w-full bg-primary hover:bg-primary/90">
          <Home className="w-4 h-4 mr-2" />
          Back to Journey
        </Button>
      </div>
    </div>
  );
}
