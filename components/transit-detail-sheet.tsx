"use client";

import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import { 
  X, 
  Bus, 
  Ship, 
  Train,
  Truck,
  Anchor,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  ArrowRight,
  Calendar,
  Users,
  Wifi,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function getTransportIcon(type: string) {
  switch (type) {
    case "boat":
    case "ferry": return Anchor;
    case "train": return Train;
    case "jeep": return Truck;
    default: return Bus;
  }
}

interface TransportOption {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  type: string;
  amenities: string[];
  seatsLeft?: number;
}

// Mock transport options for unbooked legs
const defaultTransportOptions: TransportOption[] = [
  { id: "1", operator: "Pullman", departureTime: "07:00", arrivalTime: "13:00", duration: "6h", price: 25, currency: "USD", type: "Semi-cama", amenities: ["AC", "WiFi", "Toilet"], seatsLeft: 12 },
  { id: "2", operator: "Cruz del Sur", departureTime: "22:00", arrivalTime: "04:00", duration: "6h", price: 32, currency: "USD", type: "Cama", amenities: ["AC", "WiFi", "Toilet", "Blanket"], seatsLeft: 4 },
  { id: "3", operator: "Local Bus", departureTime: "Any", arrivalTime: "-", duration: "7h", price: 12, currency: "USD", type: "Regular", amenities: ["Basic"] },
];

export function TransitDetailSheet() {
  const { trip, selectedLeg, setSelectedLeg, updateLegBooking, setSubPage } = useTrip();

  if (!selectedLeg) return null;

  const fromStop = trip.stops.find(s => s.id === selectedLeg.fromStopId);
  const toStop = trip.stops.find(s => s.id === selectedLeg.toStopId);
  
  if (!fromStop || !toStop) return null;

  const TransportIcon = getTransportIcon(selectedLeg.type);
  const isBooked = selectedLeg.bookingStatus === "booked";
  const isPending = selectedLeg.bookingStatus === "pending";
  
  // Use transport options from leg data or defaults
  const transportOptions = selectedLeg.transportOptions || defaultTransportOptions;

  const handleBookTransport = (option: TransportOption) => {
    updateLegBooking(selectedLeg.id, "booked");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-3 flex items-start justify-between border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isBooked ? "bg-[#7C3AED]/20 text-[#7C3AED]" : 
                isPending ? "bg-[#FF6B9D]/20 text-[#FF6B9D]" : 
                "bg-primary/20 text-primary"
              )}>
                <TransportIcon className="w-4 h-4" />
              </div>
              <span className="capitalize font-medium">{selectedLeg.mode || selectedLeg.type}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold",
                  isBooked && "bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED]",
                  isPending && "bg-[#FF6B9D]/10 border-[#FF6B9D] text-[#FF6B9D]",
                  !isBooked && !isPending && "bg-primary/10 border-primary text-primary"
                )}
              >
                {isBooked ? "Booked" : isPending ? "Pending" : "Needs Booking"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-foreground">{fromStop.city}</span>
              <ArrowRight className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{toStop.city}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedLeg(null)}
            className="shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {/* Journey Info */}
          <div className="grid grid-cols-3 gap-3">
            {selectedLeg.departureDate && (
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  Date
                </div>
                <p className="font-semibold text-foreground mt-1 text-sm">
                  {new Date(selectedLeg.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            )}
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3.5 h-3.5" />
                Duration
              </div>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {selectedLeg.duration}
              </p>
            </div>
            {selectedLeg.price && (
              <div className="rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <DollarSign className="w-3.5 h-3.5" />
                  From
                </div>
                <p className="font-bold text-primary mt-1 text-sm">
                  ${selectedLeg.price}
                </p>
              </div>
            )}
          </div>
          
          {/* Alert (Border Crossing etc) */}
          {selectedLeg.alert && (
            <div className="rounded-xl border border-[#FF6B9D]/40 bg-gradient-to-r from-[#FF6B9D]/10 to-primary/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-[#FF6B9D]" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{selectedLeg.alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{selectedLeg.alert.body}</p>
                  {(selectedLeg.alert.action || selectedLeg.alert.podAction) && (
                    <Button size="sm" className="mt-2 bg-[#FF6B9D] hover:bg-[#FF6B9D]/90 text-white h-8">
                      {selectedLeg.alert.action || selectedLeg.alert.podAction}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Community Tip */}
          {selectedLeg.communityTip && (
            <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-3">
              <div className="flex items-center gap-2 text-[#7C3AED] font-medium text-sm mb-1">
                <Info className="w-4 h-4" />
                Traveller Tip
              </div>
              <p className="text-sm text-foreground">{selectedLeg.communityTip}</p>
              {selectedLeg.verifiedCount && (
                <p className="text-xs text-[#7C3AED] mt-1 font-medium">Verified by {selectedLeg.verifiedCount} travelers</p>
              )}
            </div>
          )}
          
          {/* Current Booking */}
          {isBooked && selectedLeg.operator && (
            <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
                <span className="font-semibold text-foreground">Transport Booked</span>
              </div>
              <p className="text-foreground font-medium">{selectedLeg.operator}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                {selectedLeg.departureTime && <span>Departs: {selectedLeg.departureTime}</span>}
                <span>{selectedLeg.duration}</span>
              </div>
              {selectedLeg.price && (
                <p className="text-lg font-bold text-[#7C3AED] mt-2">${selectedLeg.price}</p>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-3 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 bg-transparent"
                onClick={() => setSubPage("bookings")}
              >
                View Booking Details
              </Button>
            </div>
          )}
          
          {/* Transport Options */}
          {!isBooked && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Available Options</p>
              {transportOptions.map((option) => (
                <div 
                  key={option.id}
                  className="rounded-xl border border-border bg-card p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{option.operator}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {option.departureTime} - {option.arrivalTime}
                        </span>
                        <span>{option.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{option.type}</Badge>
                        {option.amenities.slice(0, 2).map(a => (
                          <span key={a} className="text-[10px] text-muted-foreground">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">${option.price}</p>
                      {option.seatsLeft && option.seatsLeft < 10 && (
                        <p className="text-[10px] text-[#FF6B9D] font-medium">{option.seatsLeft} seats left</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-primary hover:bg-primary/90 text-white font-semibold" 
                    size="sm"
                    onClick={() => handleBookTransport(option)}
                  >
                    Book Ticket
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Footer */}
        <div className="p-4 border-t border-border bg-card">
          {!isBooked ? (
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
              <TransportIcon className="w-4 h-4 mr-2" />
              Search All Options
            </Button>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedLeg(null)}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
