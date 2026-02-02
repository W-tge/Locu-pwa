"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { demoTrip, type Trip, type Stop, type TransitLeg } from "./trip-data";

interface TripContextType {
  trip: Trip;
  selectedStop: Stop | null;
  selectedLeg: TransitLeg | null;
  activeTab: "journey" | "guide" | "social" | "wallet";
  setSelectedStop: (stop: Stop | null) => void;
  setSelectedLeg: (leg: TransitLeg | null) => void;
  setActiveTab: (tab: "journey" | "guide" | "social" | "wallet") => void;
  updateStopBooking: (stopId: string, status: "booked" | "pending" | "not-booked") => void;
  updateLegBooking: (legId: string, status: "booked" | "pending" | "not-booked") => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>(demoTrip);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<TransitLeg | null>(null);
  const [activeTab, setActiveTab] = useState<"journey" | "guide" | "social" | "wallet">("journey");

  const updateStopBooking = (stopId: string, status: "booked" | "pending" | "not-booked") => {
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.id === stopId ? { ...s, bookingStatus: status } : s
      ),
    }));
  };

  const updateLegBooking = (legId: string, status: "booked" | "pending" | "not-booked") => {
    setTrip(prev => ({
      ...prev,
      transitLegs: prev.transitLegs.map(l => 
        l.id === legId ? { ...l, bookingStatus: status } : l
      ),
    }));
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        selectedStop,
        selectedLeg,
        activeTab,
        setSelectedStop,
        setSelectedLeg,
        setActiveTab,
        updateStopBooking,
        updateLegBooking,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
