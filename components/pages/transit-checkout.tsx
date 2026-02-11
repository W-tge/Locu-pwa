"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ChevronRight,
  Bus,
  Train,
  Anchor,
  Plane,
  Truck,
  Clock,
  MapPin,
  CreditCard,
  Shield,
  Lock,
  CheckCircle2,
  Users,
  User,
  Mail,
  Phone,
  Home,
  Download,
  Share2,
  AlertTriangle,
  Armchair,
  Luggage,
} from "lucide-react";

type Step = "passengers" | "extras" | "payment" | "confirmation";

const STEPS: { key: Step; label: string }[] = [
  { key: "passengers", label: "Passengers" },
  { key: "extras", label: "Extras" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmed" },
];

function getTransportIcon(type: string) {
  switch (type) {
    case "boat": case "ferry": return Anchor;
    case "train": return Train;
    case "jeep": return Truck;
    case "flight": return Plane;
    default: return Bus;
  }
}

export function TransitCheckout() {
  const { trip, selectedLeg, pendingBooking, setSubPage, updateLegBooking, setPendingBooking, setSelectedLeg } = useTrip();
  const { showToast } = useLocuToast();

  const [step, setStep] = useState<Step>("passengers");
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex@locu.travel",
    phone: "+1 555-0123",
    passportId: "AB1234567",
  });
  const [seatPref, setSeatPref] = useState<"window" | "aisle" | "any">("any");
  const [addLuggage, setAddLuggage] = useState(false);
  const [podBooking, setPodBooking] = useState(false);
  const [podCount, setPodCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const option = pendingBooking;
  const leg = selectedLeg;
  const fromStop = leg ? trip.stops.find((s) => s.id === leg.fromStopId) : null;
  const toStop = leg ? trip.stops.find((s) => s.id === leg.toStopId) : null;

  if (!leg || !option) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
        <div>
          <p className="font-semibold text-foreground mb-2">No transit booking in progress</p>
          <Button onClick={() => setSubPage(null)} variant="outline" className="bg-transparent">Back to Journey</Button>
        </div>
      </div>
    );
  }

  const TransportIcon = getTransportIcon(leg.type);
  const basePrice = option.price || leg.price || 25;
  const luggageFee = addLuggage ? 8 : 0;
  const seatFee = seatPref !== "any" ? 3 : 0;
  const podTotal = podBooking ? basePrice * podCount : basePrice;
  const total = podTotal + luggageFee + seatFee;
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateLegBooking(leg.id, "booked");
      setIsProcessing(false);
      setShowAnimation(true);
    }, 2000);
  };

  // ---- STEP: Passengers ----
  const renderPassengers = () => (
    <div className="space-y-5">
      {/* Route summary card */}
      <div className="bg-card rounded-xl paper-shadow p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full gradient-vibrant flex items-center justify-center shrink-0">
            <TransportIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">{option.operator}</h3>
            <p className="text-xs text-muted-foreground">Route {option.routeCode} - {option.serviceClass}</p>
          </div>
          <span className="font-mono font-bold text-primary">${basePrice}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="text-center">
            <p className="font-mono font-bold text-foreground">{option.departure}</p>
            <p className="text-[10px] text-muted-foreground">{fromStop?.city}</p>
          </div>
          <div className="flex-1 relative px-3">
            <div className="border-t border-dashed border-border" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
              <span className="text-[10px] text-muted-foreground">{leg.duration}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-mono font-bold text-foreground">{option.arrival}</p>
            <p className="text-[10px] text-muted-foreground">{toStop?.city}</p>
          </div>
        </div>
      </div>

      {/* Passenger form */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Passenger Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="micro-label mb-1 block">First Name</label>
            <input type="text" value={passengerInfo.firstName} onChange={(e) => setPassengerInfo((p) => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
          <div>
            <label className="micro-label mb-1 block">Last Name</label>
            <input type="text" value={passengerInfo.lastName} onChange={(e) => setPassengerInfo((p) => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="micro-label mb-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="email" value={passengerInfo.email} onChange={(e) => setPassengerInfo((p) => ({ ...p, email: e.target.value }))} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
        </div>
        <div>
          <label className="micro-label mb-1 block">Passport / ID Number</label>
          <input type="text" value={passengerInfo.passportId} onChange={(e) => setPassengerInfo((p) => ({ ...p, passportId: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
        </div>
      </div>

      {/* Pod booking */}
      <div className="rounded-xl border-2 border-[#0D9488]/20 bg-[#0D9488]/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0D9488]" />
            <span className="font-semibold text-sm text-[#0D9488]">Book for Travel Pod?</span>
          </div>
          <button onClick={() => setPodBooking(!podBooking)} className={cn("w-10 h-6 rounded-full transition-all relative", podBooking ? "bg-[#0D9488]" : "bg-muted")}>
            <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all", podBooking ? "left-[18px]" : "left-0.5")} />
          </button>
        </div>
        {podBooking && (
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setPodCount(Math.max(1, podCount - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center font-bold">-</button>
            <span className="font-mono font-bold text-lg w-8 text-center">{podCount}</span>
            <button onClick={() => setPodCount(Math.min(8, podCount + 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center font-bold">+</button>
            <span className="text-xs text-muted-foreground">tickets x ${basePrice}</span>
          </div>
        )}
      </div>
    </div>
  );

  // ---- STEP: Extras ----
  const renderExtras = () => (
    <div className="space-y-5">
      <h3 className="font-semibold text-foreground text-sm">Add-ons & Preferences</h3>

      {/* Seat preference */}
      <div>
        <p className="micro-label mb-2">Seat Preference (+$3 for window/aisle)</p>
        <div className="grid grid-cols-3 gap-2">
          {(["any", "window", "aisle"] as const).map((pref) => (
            <button
              key={pref}
              onClick={() => setSeatPref(pref)}
              className={cn(
                "rounded-xl border-2 p-3 text-center transition-all capitalize",
                seatPref === pref ? "border-primary bg-primary/5" : "border-border bg-card"
              )}
            >
              <Armchair className={cn("w-5 h-5 mx-auto mb-1", seatPref === pref ? "text-primary" : "text-muted-foreground")} />
              <p className="text-xs font-semibold">{pref}</p>
              <p className="text-[10px] text-muted-foreground">{pref === "any" ? "Free" : "+$3"}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Extra luggage */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Luggage className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-semibold text-sm text-foreground">Extra Luggage</p>
            <p className="text-xs text-muted-foreground">+1 large bag (+$8)</p>
          </div>
        </div>
        <button onClick={() => setAddLuggage(!addLuggage)} className={cn("w-10 h-6 rounded-full transition-all relative", addLuggage ? "bg-primary" : "bg-muted")}>
          <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all", addLuggage ? "left-[18px]" : "left-0.5")} />
        </button>
      </div>

      {/* Price summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">Price Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{podBooking ? `${podCount} tickets` : "1 ticket"} x ${basePrice}</span>
            <span className="font-medium">${podTotal}</span>
          </div>
          {seatFee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seat preference ({seatPref})</span>
              <span className="font-medium">+${seatFee}</span>
            </div>
          )}
          {luggageFee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extra luggage</span>
              <span className="font-medium">+${luggageFee}</span>
            </div>
          )}
          <div className="border-t border-dashed border-border pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary font-mono text-lg">${total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ---- STEP: Payment ----
  const renderPayment = () => (
    <div className="space-y-5">
      {/* Payment methods */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Payment
        </h3>
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div>
            <label className="micro-label mb-1 block">Card Number</label>
            <input type="text" value="**** **** **** 4242" readOnly className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="micro-label mb-1 block">Expiry</label>
              <input type="text" value="09/28" readOnly className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium" />
            </div>
            <div>
              <label className="micro-label mb-1 block">CVC</label>
              <input type="text" value="***" readOnly className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Lock className="w-3.5 h-3.5" /> Secured with 256-bit SSL encryption (demo)
          </div>
        </div>
      </div>

      {/* Review summary */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="micro-label mb-3">Order Review</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <span className="font-medium">{fromStop?.city} to {toStop?.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operator</span>
            <span className="font-medium">{option.operator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Departure</span>
            <span className="font-medium">{option.departure}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Passenger</span>
            <span className="font-medium">{passengerInfo.firstName} {passengerInfo.lastName}</span>
          </div>
          {podBooking && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pod tickets</span>
              <span className="font-medium text-[#0D9488]">{podCount} seats</span>
            </div>
          )}
          <div className="border-t border-dashed border-border pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary font-mono text-lg">${total}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#92710C] shrink-0 mt-0.5" />
          <p className="text-xs text-[#92710C]">Tickets are non-refundable within 2 hours of departure. Changes may be made up to 6 hours before.</p>
        </div>
      </div>
    </div>
  );

  // ---- STEP: Confirmation ----
  const renderConfirmation = () => (
    <div className="space-y-5">
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-20 h-20 rounded-full bg-[#1B6B4A]/15 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <CheckCircle2 className="w-10 h-10 text-[#1B6B4A]" />
        </div>
        <h2 className="text-2xl font-serif text-foreground">Transport Booked</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">REF: TR-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
      </div>

      {/* Ticket stub */}
      <div className="bg-card rounded-xl paper-shadow overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full gradient-vibrant flex items-center justify-center shrink-0">
              <TransportIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl">{option.operator}</h3>
              <p className="text-xs text-muted-foreground">Route {option.routeCode} - {option.serviceClass}</p>
            </div>
          </div>
        </div>
        <div className="relative h-0 mx-4">
          <div className="absolute inset-x-0 border-t border-dashed border-border" />
          <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-background" />
          <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-background" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="micro-label">Depart</p>
              <p className="font-mono font-bold text-lg">{option.departure}</p>
              <p className="text-[10px] text-muted-foreground">{fromStop?.city}</p>
            </div>
            <div>
              <p className="micro-label">Duration</p>
              <p className="font-mono font-bold text-sm mt-1">{leg.duration}</p>
            </div>
            <div>
              <p className="micro-label">Arrive</p>
              <p className="font-mono font-bold text-lg">{option.arrival}</p>
              <p className="text-[10px] text-muted-foreground">{toStop?.city}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mt-3 pt-3 border-t border-dashed border-border">
            <div>
              <p className="micro-label">Seat</p>
              <p className="font-mono font-bold text-sm">{seatPref === "any" ? "Auto" : seatPref.charAt(0).toUpperCase() + seatPref.slice(1)}</p>
            </div>
            <div>
              <p className="micro-label">Passenger</p>
              <p className="font-mono font-bold text-sm">{passengerInfo.firstName.charAt(0)}. {passengerInfo.lastName}</p>
            </div>
            <div>
              <p className="micro-label">Total</p>
              <p className="font-mono font-bold text-lg text-[#1B6B4A]">${total}</p>
            </div>
          </div>
          {podBooking && (
            <div className="mt-3 p-2 rounded-lg bg-[#0D9488]/10 text-center">
              <p className="text-xs font-semibold text-[#0D9488]">{podCount} Pod tickets booked</p>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <div className="flex items-end gap-[2px] h-10 opacity-30">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="bg-foreground rounded-sm" style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${35 + Math.sin(i * 0.8) * 30}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-dashed border-border p-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" onClick={() => showToast("Ticket PDF saved", "success")}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" onClick={() => showToast("Share link copied!", "success")}>
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
          </Button>
        </div>
      </div>
    </div>
  );

  // ---- Booking success animation ----
  if (showAnimation) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Animated bus driving across */}
        <div className="relative w-full h-32 mb-6">
          {/* Road line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          <div className="absolute top-1/2 left-0 right-0 flex items-center gap-3 mt-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-6 h-0.5 bg-muted-foreground/20 shrink-0" />
            ))}
          </div>

          {/* Bus icon sliding across */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              animation: "busSlide 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            }}
          >
            <div className="w-16 h-16 rounded-2xl gradient-vibrant flex items-center justify-center shadow-xl">
              <TransportIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Destination pin */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Confirmation text - fades in after bus arrives */}
        <div
          className="text-center"
          style={{
            animation: "fadeInUp 0.5s ease-out 1.4s both",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-[#1B6B4A]/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#1B6B4A]" />
          </div>
          <h2 className="text-2xl font-serif text-foreground">Booking Confirmed!</h2>
          <p className="text-muted-foreground mt-1">{fromStop?.city} to {toStop?.city}</p>
        </div>

        {/* Auto-advance after animation */}
        <div
          style={{ animation: "fadeInUp 0.3s ease-out 2.8s both" }}
        >
          <Button
            onClick={() => { setShowAnimation(false); setStep("confirmation"); }}
            className="mt-6 gradient-vibrant text-white font-semibold shadow-lg"
          >
            View Your Ticket
          </Button>
        </div>

        {/* Keyframe styles */}
        <style>{`
          @keyframes busSlide {
            0% { left: -80px; }
            70% { left: calc(100% - 120px); }
            80% { left: calc(100% - 130px); }
            100% { left: calc(100% - 120px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case "passengers": return renderPassengers();
      case "extras": return renderExtras();
      case "payment": return renderPayment();
      case "confirmation": return renderConfirmation();
    }
  };

  const handleNext = () => {
    if (step === "passengers") setStep("extras");
    else if (step === "extras") setStep("payment");
    else if (step === "payment") handleConfirm();
  };

  const handleBack = () => {
    if (step === "extras") setStep("passengers");
    else if (step === "payment") setStep("extras");
    else if (step === "passengers") {
      setPendingBooking(null);
      setSubPage("transportBooking");
    }
  };

  const getFooterLabel = () => {
    switch (step) {
      case "passengers": return "Select Extras";
      case "extras": return `Continue to Payment - $${total}`;
      case "payment": return `Confirm & Pay $${total}`;
      default: return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-black/5 glass-panel px-4 py-3">
        <div className="flex items-center gap-3">
          {step !== "confirmation" && (
            <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-lg text-foreground">
              {step === "confirmation" ? "Booking Confirmed" : `Book ${fromStop?.city} to ${toStop?.city}`}
            </h1>
            {step !== "confirmation" && (
              <p className="text-xs text-muted-foreground">Step {stepIndex + 1} of 3 - {STEPS[stepIndex]?.label}</p>
            )}
          </div>
          {step !== "confirmation" && (
            <span className="text-sm font-mono font-bold text-primary">${total}</span>
          )}
        </div>
        {step !== "confirmation" && (
          <div className="flex gap-1.5 mt-3">
            {STEPS.slice(0, 3).map((s, i) => (
              <div key={s.key} className={cn("h-1 flex-1 rounded-full transition-all", i <= stepIndex ? "gradient-vibrant" : "bg-muted")} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderStepContent()}
      </div>

      {step !== "confirmation" ? (
        <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
          <Button
            onClick={handleNext}
            disabled={isProcessing}
            className="w-full h-12 gradient-vibrant text-white font-semibold shadow-lg text-base disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                {getFooterLabel()}
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </Button>
          {step === "payment" && (
            <p className="text-center text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure checkout - demo mode
            </p>
          )}
        </div>
      ) : (
        <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
          <Button
            onClick={() => { setPendingBooking(null); setSelectedLeg(null); setSubPage(null); }}
            className="w-full gradient-vibrant text-white font-semibold"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Journey
          </Button>
        </div>
      )}
    </div>
  );
}
