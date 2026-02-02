"use client";

import { useTrip } from "@/lib/trip-context";
import { formatDateRange } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  Plane, 
  Bus, 
  Ship, 
  Train, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronRight,
  Bed,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function getTransportIcon(type: string) {
  switch (type) {
    case "flight": return Plane;
    case "boat": return Ship;
    case "train": return Train;
    case "shuttle": return Bus;
    default: return Bus;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "booked": return CheckCircle2;
    case "pending": return Clock;
    default: return Circle;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "booked": return "text-[#4ECDC4]";
    case "pending": return "text-[#FF9F43]";
    default: return "text-[#FC2869]";
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case "booked": return "bg-[#4ECDC4]/10 border-[#4ECDC4]/30";
    case "pending": return "bg-[#FF9F43]/10 border-[#FF9F43]/30";
    default: return "bg-[#FC2869]/10 border-[#FC2869]/30";
  }
}

export function TripTimeline() {
  const { trip, selectedStop, selectedLeg, setSelectedStop, setSelectedLeg } = useTrip();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 space-y-1">
        {trip.stops.map((stop, index) => {
          const transitLeg = index < trip.stops.length - 1 
            ? trip.transitLegs.find(l => l.fromStopId === stop.id)
            : null;
          
          const StatusIcon = getStatusIcon(stop.bookingStatus);
          const isSelected = selectedStop?.id === stop.id;
          
          return (
            <div key={stop.id}>
              {/* Stop Card */}
              <button
                onClick={() => setSelectedStop(stop)}
                className={cn(
                  "w-full text-left rounded-xl border p-3 transition-all",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                    : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      stop.bookingStatus === "booked" 
                        ? "bg-[#4ECDC4] text-[#1a1a2e]"
                        : stop.bookingStatus === "pending"
                        ? "bg-[#FF9F43] text-[#1a1a2e]"
                        : "bg-[#FC2869] text-white"
                    )}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-foreground truncate">{stop.city}</h3>
                      <StatusIcon className={cn("w-4 h-4 shrink-0", getStatusColor(stop.bookingStatus))} />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {stop.country} <span className="opacity-50">|</span> {formatDateRange(stop.startDate, stop.endDate)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {stop.nights} nights
                      </Badge>
                      
                      {stop.hostelName ? (
                        <Badge variant="outline" className={cn("text-xs", getStatusBg(stop.bookingStatus))}>
                          <Bed className="w-3 h-3 mr-1" />
                          {stop.hostelName}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-[#FC2869]/10 border-[#FC2869]/30 text-[#FC2869]">
                          <Bed className="w-3 h-3 mr-1" />
                          Book hostel
                        </Badge>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {stop.tags && stop.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {stop.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {stop.tags.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                            +{stop.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </button>
              
              {/* Transit Leg */}
              {transitLeg && (
                <button
                  onClick={() => setSelectedLeg(transitLeg)}
                  className={cn(
                    "w-full my-1 ml-4 mr-0 text-left rounded-lg border p-2 transition-all flex items-center gap-3",
                    selectedLeg?.id === transitLeg.id
                      ? "border-[#FF9F43] bg-[#FF9F43]/10"
                      : "border-dashed border-border/50 hover:border-[#FF9F43]/50 bg-transparent"
                  )}
                >
                  {/* Transport Icon */}
                  {(() => {
                    const Icon = getTransportIcon(transitLeg.type);
                    return (
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        transitLeg.bookingStatus === "booked"
                          ? "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                          : transitLeg.bookingStatus === "pending"
                          ? "bg-[#FF9F43]/20 text-[#FF9F43]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    );
                  })()}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-foreground capitalize">{transitLeg.type}</span>
                      <span className="text-muted-foreground">{transitLeg.duration}</span>
                      {transitLeg.price && (
                        <span className="text-muted-foreground">
                          ${transitLeg.price}
                        </span>
                      )}
                    </div>
                    {transitLeg.communityTip && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Info className="w-3 h-3 text-[#FF9F43]" />
                        <span className="text-[10px] text-[#FF9F43] truncate">
                          {transitLeg.communityTip}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <StatusIcon className={cn("w-4 h-4 shrink-0", getStatusColor(transitLeg.bookingStatus))} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
