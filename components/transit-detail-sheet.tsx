"use client";

import { useTrip } from "@/lib/trip-context";
import { cn } from "@/lib/utils";
import { 
  X, 
  Plane, 
  Bus, 
  Ship, 
  Train,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function getTransportIcon(type: string) {
  switch (type) {
    case "flight": return Plane;
    case "boat": return Ship;
    case "train": return Train;
    default: return Bus;
  }
}

interface TransportOption {
  operator: string;
  departureTime: string;
  duration: string;
  price: number;
  currency: string;
  type: "direct" | "1-stop";
}

// Mock transport options
const mockTransportOptions: TransportOption[] = [
  { operator: "ADO Primera Plus", departureTime: "08:00", duration: "6h 30m", price: 45, currency: "USD", type: "direct" },
  { operator: "Pullman de Chiapas", departureTime: "10:30", duration: "7h", price: 35, currency: "USD", type: "direct" },
  { operator: "OCC", departureTime: "22:00", duration: "8h", price: 28, currency: "USD", type: "direct" },
];

export function TransitDetailSheet() {
  const { trip, selectedLeg, setSelectedLeg, updateLegBooking } = useTrip();

  if (!selectedLeg) return null;

  const fromStop = trip.stops.find(s => s.id === selectedLeg.fromStopId);
  const toStop = trip.stops.find(s => s.id === selectedLeg.toStopId);
  
  if (!fromStop || !toStop) return null;

  const TransportIcon = getTransportIcon(selectedLeg.type);
  const isBooked = selectedLeg.bookingStatus === "booked";
  const isPending = selectedLeg.bookingStatus === "pending";

  const handleBookTransport = (option: TransportOption) => {
    updateLegBooking(selectedLeg.id, "booked");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-3 flex items-start justify-between border-b border-border">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TransportIcon className="w-4 h-4" />
              <span className="capitalize">{selectedLeg.type}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  isBooked && "bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]",
                  isPending && "bg-[#FF9F43]/10 border-[#FF9F43] text-[#FF9F43]",
                  !isBooked && !isPending && "bg-[#FC2869]/10 border-[#FC2869] text-[#FC2869]"
                )}
              >
                {isBooked ? "Booked" : isPending ? "Pending" : "Not Booked"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-foreground">{fromStop.city}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold text-foreground">{toStop.city}</span>
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
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                Duration
              </div>
              <p className="font-semibold text-foreground mt-1">
                {selectedLeg.duration}
              </p>
            </div>
            {selectedLeg.price && (
              <div className="flex-1 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <DollarSign className="w-4 h-4" />
                  From
                </div>
                <p className="font-semibold text-foreground mt-1">
                  ${selectedLeg.price} {selectedLeg.currency}
                </p>
              </div>
            )}
          </div>
          
          {/* Community Tip */}
          {selectedLeg.communityTip && (
            <div className="rounded-xl border border-[#FF9F43]/30 bg-[#FF9F43]/5 p-3">
              <div className="flex items-center gap-2 text-[#FF9F43] font-medium text-sm mb-1">
                <AlertTriangle className="w-4 h-4" />
                Traveller Tip
              </div>
              <p className="text-sm text-foreground">{selectedLeg.communityTip}</p>
            </div>
          )}
          
          {/* Current Booking */}
          {isBooked && selectedLeg.operator && (
            <div className="rounded-xl border border-[#4ECDC4]/30 bg-[#4ECDC4]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#4ECDC4]" />
                <span className="font-semibold text-foreground">Booked</span>
              </div>
              <p className="text-foreground font-medium">{selectedLeg.operator}</p>
              {selectedLeg.departureTime && (
                <p className="text-sm text-muted-foreground">
                  Departure: {selectedLeg.departureTime}
                </p>
              )}
            </div>
          )}
          
          {/* Transport Options */}
          {!isBooked && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Available Options</p>
              {mockTransportOptions.map((option, i) => (
                <div 
                  key={i}
                  className="rounded-xl border border-border bg-card p-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{option.operator}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {option.departureTime}
                        </span>
                        <span>{option.duration}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {option.type === "direct" ? "Direct" : "1 Stop"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">${option.price}</p>
                      <p className="text-[10px] text-muted-foreground">{option.currency}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full mt-3 border-[#FF9F43] text-[#FF9F43] hover:bg-[#FF9F43] hover:text-white bg-transparent" 
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
            <Button className="w-full gradient-secondary text-white">
              <TransportIcon className="w-4 h-4 mr-2" />
              Search All {selectedLeg.type === "flight" ? "Flights" : "Buses"}
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
