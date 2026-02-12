"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { useLocuToast } from "@/components/locu-toast";
import { formatDateRange } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  Bed,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Shield,
  CheckCircle2,
  Lock,
  Star,
  Clock,
  Wifi,
  Coffee,
  Home,
  Download,
  Share2,
  AlertTriangle,
  User,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { DateRangeCalendar } from "@/components/ui/date-range-calendar";

type Step = "guests" | "payment" | "review" | "confirmation";

const STEPS: { key: Step; label: string }[] = [
  { key: "guests", label: "Guest Info" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
  { key: "confirmation", label: "Confirmed" },
];

export function HostelCheckout() {
  const {
    trip,
    selectedStop,
    pendingBooking,
    setSubPage,
    setSelectedStop,
    updateStopBooking,
    setPendingBooking,
    updateStopDates,
  } = useTrip();
  const { showToast } = useLocuToast();

  const [step, setStep] = useState<Step>("guests");
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex@locu.travel",
    phone: "+1 555-0123",
    guestCount: 1,
    specialRequests: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "pay-at-hostel">("card");
  const [cardInfo, setCardInfo] = useState({ number: "**** **** **** 4242", expiry: "09/28", cvc: "***" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [podBooking, setPodBooking] = useState(pendingBooking?.podDefault === true);
  const [podCount, setPodCount] = useState(pendingBooking?.podDefault ? 3 : 1);

  // Derive from pending booking data
  const hostel = pendingBooking;
  const nights = selectedStop?.nights || 3;
  const pricePerNight = hostel?.price || 22;
  const subtotal = pricePerNight * nights;
  const podTotal = podBooking ? pricePerNight * nights * podCount : subtotal;
  const serviceFee = Math.round(podTotal * 0.05);
  const total = podTotal + serviceFee;

  if (!selectedStop || !hostel) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
        <div>
          <p className="font-semibold text-foreground mb-2">No booking in progress</p>
          <Button onClick={() => setSubPage(null)} variant="outline" className="bg-transparent">Back to Journey</Button>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const handleConfirmBooking = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateStopBooking(selectedStop.id, "booked");
      setIsProcessing(false);
      setStep("confirmation");
      showToast(`Booking confirmed at ${hostel.name}!`, "success");
    }, 2000);
  };

  const handleDateSelect = (start: Date, end: Date) => {
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    updateStopDates(selectedStop.id, startStr, endStr);
    setShowDateCalendar(false);
    showToast("Dates updated. Downstream stops have been adjusted.", "success");
  };

  const checkInLabel = selectedStop.startDate
    ? new Date(selectedStop.startDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Check-in";
  const checkOutLabel = selectedStop.endDate
    ? new Date(selectedStop.endDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Check-out";

  // ---- STEP: Guests ----
  const renderGuests = () => (
    <div className="space-y-5">
      {/* Booking summary header */}
      <div className="bg-card rounded-xl paper-shadow overflow-hidden">
        <div className="flex gap-3 p-3">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">{hostel.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {selectedStop.city}, {selectedStop.country}
            </p>
            {/* Editable dates: two clickable buttons + nights */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowDateCalendar(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-primary/40 text-xs font-medium text-foreground transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{checkInLabel}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              <span className="text-muted-foreground text-xs">→</span>
              <button
                type="button"
                onClick={() => setShowDateCalendar(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-primary/40 text-xs font-medium text-foreground transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{checkOutLabel}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              <span className="text-xs font-semibold text-foreground ml-0.5">
                {nights} night{nights !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-xs font-semibold">{hostel.rating}</span>
              <span className="text-xs text-muted-foreground">({hostel.reviews})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest info form */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Guest Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="micro-label mb-1 block">First Name</label>
            <input
              type="text"
              value={guestInfo.firstName}
              onChange={(e) => setGuestInfo((p) => ({ ...p, firstName: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="micro-label mb-1 block">Last Name</label>
            <input
              type="text"
              value={guestInfo.lastName}
              onChange={(e) => setGuestInfo((p) => ({ ...p, lastName: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="micro-label mb-1 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo((p) => ({ ...p, email: e.target.value }))}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="micro-label mb-1 block">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo((p) => ({ ...p, phone: e.target.value }))}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-card text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="micro-label mb-1 block">Special Requests (optional)</label>
          <textarea
            value={guestInfo.specialRequests}
            onChange={(e) => setGuestInfo((p) => ({ ...p, specialRequests: e.target.value }))}
            placeholder="Lower bunk preference, early check-in..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Pod booking option */}
      <div className="rounded-xl border-2 border-[#0D9488]/20 bg-[#0D9488]/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0D9488]" />
              <span className="font-semibold text-sm text-[#0D9488]">Book for your Travel Pod?</span>
            </div>
            <button
              onClick={() => setPodBooking(!podBooking)}
              className={cn(
                "w-10 h-6 rounded-full transition-all relative",
                podBooking ? "bg-[#0D9488]" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
                podBooking ? "left-[18px]" : "left-0.5"
              )} />
            </button>
          </div>
          {podBooking && (
            <div className="mt-3">
              <label className="micro-label mb-1 block">Number of Beds</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPodCount(Math.max(1, podCount - 1))}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center font-bold text-foreground"
                >
                  -
                </button>
                <span className="font-mono font-bold text-lg w-8 text-center">{podCount}</span>
                <button
                  onClick={() => setPodCount(Math.min(8, podCount + 1))}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center font-bold text-foreground"
                >
                  +
                </button>
                <span className="text-xs text-muted-foreground">beds x ${pricePerNight}/night x {nights} nights</span>
              </div>
              <p className="text-xs text-[#0D9488] mt-2 font-medium">Pod members will receive a booking invite notification</p>
            </div>
          )}
        </div>
    </div>
  );

  // ---- STEP: Payment ----
  const renderPayment = () => (
    <div className="space-y-5">
      {/* Price breakdown */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">Price Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {podBooking ? `${podCount} beds` : "1 bed"} x ${pricePerNight}/night x {nights} nights
            </span>
            <span className="font-medium">${podTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee (5%)</span>
            <span className="font-medium">${serviceFee}</span>
          </div>
          <div className="border-t border-dashed border-border pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary font-mono text-lg">${total}</span>
          </div>
        </div>
      </div>

      {/* Payment method selection */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" /> Payment Method
        </h3>
        <div className="space-y-2">
          {([
            { key: "card" as const, label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
            { key: "paypal" as const, label: "PayPal", desc: "Pay with your PayPal account", icon: Shield },
            { key: "pay-at-hostel" as const, label: "Pay at Hostel", desc: "Pay on arrival - reservation held 24h", icon: Home },
          ]).map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all",
                  paymentMethod === method.key
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  paymentMethod === method.key ? "gradient-vibrant" : "bg-muted"
                )}>
                  <Icon className={cn("w-5 h-5", paymentMethod === method.key ? "text-white" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
                {paymentMethod === method.key && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card form (if card selected) */}
      {paymentMethod === "card" && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div>
            <label className="micro-label mb-1 block">Card Number</label>
            <input
              type="text"
              value={cardInfo.number}
              readOnly
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="micro-label mb-1 block">Expiry</label>
              <input
                type="text"
                value={cardInfo.expiry}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium"
              />
            </div>
            <div>
              <label className="micro-label mb-1 block">CVC</label>
              <input
                type="text"
                value={cardInfo.cvc}
                readOnly
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm font-mono font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Secured with 256-bit SSL encryption (demo mode)</span>
          </div>
        </div>
      )}

      {/* Cancellation policy */}
      <div className="rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#92710C] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-xs text-[#92710C]">Free cancellation until 48h before check-in</p>
            <p className="text-xs text-[#92710C]/70 mt-0.5">After that, the first night is non-refundable</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ---- STEP: Review ----
  const renderReview = () => (
    <div className="space-y-4">
      {/* Hostel summary */}
      <div className="bg-card rounded-xl paper-shadow overflow-hidden">
        <div className="relative h-32">
          <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-serif text-lg text-white">{hostel.name}</h3>
            <p className="text-sm text-white/80 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {selectedStop.city}, {selectedStop.country}
            </p>
          </div>
        </div>
      </div>

      {/* Editable dates: same clickable buttons + nights in review */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="micro-label mb-3">Dates</h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDateCalendar(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-primary/40 text-sm font-medium text-foreground transition-colors"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>{checkInLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-muted-foreground text-sm">→</span>
          <button
            type="button"
            onClick={() => setShowDateCalendar(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted hover:border-primary/40 text-sm font-medium text-foreground transition-colors"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>{checkOutLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {nights} night{nights !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Booking details grid */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="micro-label mb-3">Booking Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5 border-b border-dashed border-border">
            <span className="text-muted-foreground">Guest</span>
            <span className="font-medium text-foreground">{guestInfo.firstName} {guestInfo.lastName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{guestInfo.email}</span>
          </div>
          {podBooking && (
            <div className="flex justify-between py-1.5 border-b border-dashed border-border">
              <span className="text-muted-foreground">Pod Beds</span>
              <span className="font-medium text-[#0D9488]">{podCount} beds reserved</span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-dashed border-border">
            <span className="text-muted-foreground">Payment</span>
            <span className="font-medium text-foreground capitalize">{paymentMethod === "pay-at-hostel" ? "Pay at hostel" : paymentMethod}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-border">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">${podTotal}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-dashed border-border">
            <span className="text-muted-foreground">Service fee</span>
            <span className="font-medium text-foreground">${serviceFee}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold">
            <span>Total</span>
            <span className="text-primary font-mono text-xl">${total}</span>
          </div>
        </div>
      </div>

      {guestInfo.specialRequests && (
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="micro-label mb-1">Special Requests</p>
          <p className="text-sm text-foreground">{guestInfo.specialRequests}</p>
        </div>
      )}

      <div className="rounded-xl bg-[#1B6B4A]/5 border border-[#1B6B4A]/20 p-3">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#1B6B4A] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1B6B4A]">By confirming, you agree to the hostel's terms. Free cancellation until 48h before check-in.</p>
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
        <h2 className="text-2xl font-serif text-foreground">Booking Confirmed</h2>
        <p className="text-muted-foreground mt-1 font-mono text-sm">REF: HL-{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
      </div>

      {/* Ticket card */}
      <div className="bg-card rounded-xl paper-shadow overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#1B6B4A]/10 flex items-center justify-center shrink-0">
              <Bed className="w-6 h-6 text-[#1B6B4A]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl text-foreground">{hostel.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {selectedStop.city}, {selectedStop.country}
              </p>
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
              <p className="micro-label">Check-in</p>
              <p className="font-mono font-bold text-sm">14:00</p>
              <p className="text-[10px] text-muted-foreground">{selectedStop.startDate ? new Date(selectedStop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</p>
            </div>
            <div>
              <p className="micro-label">Check-out</p>
              <p className="font-mono font-bold text-sm">11:00</p>
              <p className="text-[10px] text-muted-foreground">{selectedStop.endDate ? new Date(selectedStop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</p>
            </div>
            <div>
              <p className="micro-label">Total</p>
              <p className="font-mono font-bold text-lg text-[#1B6B4A]">${total}</p>
            </div>
          </div>
          {podBooking && (
            <div className="mt-3 p-2 rounded-lg bg-[#0D9488]/10 text-center">
              <p className="text-xs font-semibold text-[#0D9488]">{podCount} Pod beds reserved - invites sent</p>
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
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" onClick={() => showToast("Booking PDF saved to wallet", "success")}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent text-xs" onClick={() => showToast("Share link copied!", "success")}>
            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
          </Button>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
        <h4 className="font-serif text-base text-foreground mb-2">What happens next?</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Confirmation email sent to {guestInfo.email}</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Booking added to your travel wallet</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Offline access available in documents</li>
          {podBooking && <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" /> Pod members notified and beds reserved</li>}
        </ul>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case "guests": return renderGuests();
      case "payment": return renderPayment();
      case "review": return renderReview();
      case "confirmation": return renderConfirmation();
    }
  };

  const handleNext = () => {
    if (step === "guests") setStep("payment");
    else if (step === "payment") setStep("review");
    else if (step === "review") handleConfirmBooking();
  };

  const handleBack = () => {
    if (step === "payment") setStep("guests");
    else if (step === "review") setStep("payment");
    else if (step === "guests") {
      setPendingBooking(null);
      setSubPage("hostelDetails");
    }
  };

  const getFooterLabel = () => {
    switch (step) {
      case "guests": return "Continue to Payment";
      case "payment": return "Review Booking";
      case "review": return `Confirm & Pay $${total}`;
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
              {step === "confirmation" ? "Booking Confirmed" : "Book " + hostel.name}
            </h1>
            {step !== "confirmation" && (
              <p className="text-xs text-muted-foreground">Step {stepIndex + 1} of 3 - {STEPS[stepIndex]?.label}</p>
            )}
          </div>
          {step !== "confirmation" && (
            <span className="text-sm font-mono font-bold text-primary">${total}</span>
          )}
        </div>

        {/* Progress bar */}
        {step !== "confirmation" && (
          <div className="flex gap-1.5 mt-3">
            {STEPS.slice(0, 3).map((s, i) => (
              <div
                key={s.key}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  i <= stepIndex ? "gradient-vibrant" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {renderStepContent()}

        {/* Date picker overlay - available from Guests and Review */}
        {showDateCalendar && (
          <>
            <div
              className="absolute inset-0 bg-black/30 z-10 rounded-xl"
              onClick={() => setShowDateCalendar(false)}
              aria-hidden
            />
            <div className="absolute top-0 left-4 right-4 z-20 max-w-sm">
              <DateRangeCalendar
                selectedStart={new Date(selectedStop.startDate)}
                selectedEnd={new Date(selectedStop.endDate)}
                onSelect={handleDateSelect}
                onClose={() => setShowDateCalendar(false)}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
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
          {step === "review" && (
            <p className="text-center text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure checkout - demo mode
            </p>
          )}
        </div>
      ) : (
        <div className="shrink-0 p-4 border-t border-black/5 glass-panel">
          <Button
            onClick={() => { setPendingBooking(null); setSubPage(null); }}
            className="w-full gradient-vibrant text-white font-semibold"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Journey
          </Button>
        </div>
      )}
    </div>
  );
}
