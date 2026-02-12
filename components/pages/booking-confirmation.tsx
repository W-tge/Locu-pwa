"use client";

import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
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

interface BookingConfirmationProps {
  type: "hostel" | "transport";
  bookingId: string;
}

export function BookingConfirmation({ type, bookingId }: BookingConfirmationProps) {
  const { setSubPage } = useTrip();
  const { showToast } = useLocuToast();

  const isTransport = type === "transport";
  const bookingData = isTransport
    ? {
        title: "Transport Booked",
        name: "Pullman Bus",
        location: "Antigua \u2192 Lake Atitlan",
        dates: "Feb 7, 2026",
        depTime: "07:00",
        routeCode: "PLM-118",
        platform: "B4",
        seat: "22A",
        details: "Semi-cama \u00b7 3h journey",
        price: "$25.00",
        reference: `TR-${bookingId}`,
        icon: Bus,
      }
    : {
        title: "Hostel Booked",
        name: "Earth Lodge",
        location: "Antigua, Guatemala",
        dates: "Feb 1 \u2013 Feb 7, 2026",
        depTime: null,
        routeCode: null,
        platform: null,
        seat: null,
        details: "8-bed mixed dorm \u00b7 6 nights",
        price: "$72.00",
        reference: `HL-${bookingId}`,
        icon: Bed,
      };

  return (
    <div className="h-full flex flex-col bg-background paper-texture">
      {/* Header */}
      <header className="glass-panel border-b border-black/5 px-4 py-4 flex items-center gap-4">
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
        {/* Success */}
        <div className="flex flex-col items-center text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[#1B6B4A]/15 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-[#1B6B4A]" />
          </div>
          <h2 className="text-2xl font-serif text-foreground">{bookingData.title}</h2>
          <p className="font-mono text-sm text-muted-foreground mt-2">REF: {bookingData.reference}</p>
        </div>

        {/* Ticket-style Booking Card */}
        <div className="bg-card rounded-xl paper-shadow overflow-hidden mt-4">
          {/* Top section */}
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#1B6B4A]/10 flex items-center justify-center shrink-0">
                <bookingData.icon className="w-6 h-6 text-[#1B6B4A]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl text-foreground">{bookingData.name}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {bookingData.location}
                </div>
              </div>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative h-0 mx-4">
            <div className="absolute inset-x-0 border-t border-dashed border-border" />
            <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-background" />
            <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-background" />
          </div>

          {/* Data fields in monospace */}
          <div className="p-5">
            {isTransport ? (
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <p className="micro-label">DEP. TIME</p>
                  <p className="font-mono font-semibold text-lg">{bookingData.depTime}</p>
                </div>
                <div>
                  <p className="micro-label">ROUTE</p>
                  <p className="font-mono font-semibold text-lg">{bookingData.routeCode}</p>
                </div>
                <div>
                  <p className="micro-label">PLATFORM</p>
                  <p className="font-mono font-semibold text-lg">{bookingData.platform}</p>
                </div>
                <div>
                  <p className="micro-label">SEAT</p>
                  <p className="font-mono font-semibold text-lg">{bookingData.seat}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="micro-label flex items-center gap-1"><Calendar className="w-3 h-3" />DATES</p>
                  <p className="font-mono font-medium text-sm mt-1">{bookingData.dates}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="micro-label flex items-center gap-1"><CreditCard className="w-3 h-3" />TOTAL</p>
                  <p className="font-mono font-bold text-lg text-[#1B6B4A] mt-1">{bookingData.price}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4 text-center">{bookingData.details}</p>

            {/* Barcode */}
            <div className="flex justify-center mt-4">
              <div className="flex items-end gap-[2px] h-10 opacity-30">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="bg-foreground rounded-sm" style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${35 + Math.sin(i * 0.8) * 30}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-dashed border-border p-4 flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => showToast("Booking PDF saved to your wallet", "success")}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => showToast("Share link copied to clipboard!", "success")}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/15 paper-shadow">
          <h4 className="font-serif text-lg text-foreground mb-2">What happens next?</h4>
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
      <div className="p-4 border-t border-black/5 glass-panel">
        <Button onClick={() => setSubPage(null)} className="w-full bg-primary hover:bg-primary/90 text-white">
          <Home className="w-4 h-4 mr-2" />
          Back to Journey
        </Button>
      </div>
    </div>
  );
}
