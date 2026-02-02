"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { demoTrip, type Trip, type Stop, type TransitLeg } from "./trip-data";

export type MenuPage = 
  | "none"
  | "menu"
  | "my-bookings"
  | "travel-timeline"
  | "saved-hostels"
  | "saved-places"
  | "my-stats"
  | "trip-history"
  | "my-preferences"
  | "safety-toolkit"
  | "intel-hub";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  karmaPoints: number;
  countriesVisited: number;
  daysTraveled: number;
  totalSpent: number;
  busesRidden: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  gradient: string;
  unlockedAt?: string;
}

export interface UserPreferences {
  dailyBudget: string;
  currency: string;
  accommodationTypes: string[];
  securityPriority: number;
  sustainabilityFocus: number;
  socialLevel: number;
}

export interface SavedPlace {
  id: string;
  name: string;
  location: string;
  country: string;
  category: string;
  rating: number;
  savedAt: string;
  image?: string;
}

export interface SavedHostel {
  id: string;
  name: string;
  city: string;
  country: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  distance: string;
  savedAt: string;
  image?: string;
}

export interface IntelAlert {
  id: string;
  type: "urgent" | "trip-assist" | "quest";
  title: string;
  description: string;
  action?: string;
  points?: number;
}

interface TripContextType {
  trip: Trip;
  selectedStop: Stop | null;
  selectedLeg: TransitLeg | null;
  activeTab: "journey" | "guide" | "social" | "wallet";
  menuPage: MenuPage;
  user: UserProfile;
  preferences: UserPreferences;
  savedPlaces: SavedPlace[];
  savedHostels: SavedHostel[];
  intelAlerts: IntelAlert[];
  setSelectedStop: (stop: Stop | null) => void;
  setSelectedLeg: (leg: TransitLeg | null) => void;
  setActiveTab: (tab: "journey" | "guide" | "social" | "wallet") => void;
  setMenuPage: (page: MenuPage) => void;
  updateStopBooking: (stopId: string, status: "booked" | "pending" | "not-booked") => void;
  updateLegBooking: (legId: string, status: "booked" | "pending" | "not-booked") => void;
  addKarmaPoints: (points: number) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const defaultUser: UserProfile = {
  name: "Alex Chen",
  email: "alex@example.com",
  karmaPoints: 2847,
  countriesVisited: 12,
  daysTraveled: 127,
  totalSpent: 3240,
  busesRidden: 18,
  achievements: [
    {
      id: "mountain",
      title: "Mountain Explorer",
      description: "Visited 5 mountain destinations",
      icon: "mountain",
      points: 150,
      gradient: "from-[#FF9F43] to-[#FC2869]",
      unlockedAt: "2024-02-15",
    },
    {
      id: "bus-master",
      title: "Bus Master",
      description: "Traveled 1000+ km by bus",
      icon: "bus",
      points: 200,
      gradient: "from-[#7C3AED] to-[#FC2869]",
      unlockedAt: "2024-02-20",
    },
    {
      id: "hostel-hopper",
      title: "Hostel Hopper",
      description: "Stayed in 15+ hostels",
      icon: "building",
      points: 100,
      gradient: "from-[#00D4AA] to-[#4ECDC4]",
      unlockedAt: "2024-03-01",
    },
  ],
};

const defaultPreferences: UserPreferences = {
  dailyBudget: "$30-50 per day",
  currency: "USD ($)",
  accommodationTypes: ["Hostels", "Shared Rooms"],
  securityPriority: 75,
  sustainabilityFocus: 50,
  socialLevel: 85,
};

const defaultSavedPlaces: SavedPlace[] = [
  { id: "1", name: "Machu Picchu", location: "Cusco", country: "Peru", category: "Historical Site", rating: 4.9, savedAt: "2 weeks ago" },
  { id: "2", name: "Salar de Uyuni", location: "Uyuni", country: "Bolivia", category: "Natural Wonder", rating: 4.8, savedAt: "1 month ago" },
  { id: "3", name: "Tayrona National Park", location: "Santa Marta", country: "Colombia", category: "Beach & Nature", rating: 4.7, savedAt: "3 weeks ago" },
];

const defaultSavedHostels: SavedHostel[] = [
  { id: "1", name: "Backpackers Inn Quito", city: "Quito", country: "Ecuador", pricePerNight: 18, rating: 4.2, reviewCount: 324, amenities: ["Free WiFi", "Breakfast", "Common Area"], distance: "0.5km from Old Town", savedAt: "2 days ago" },
  { id: "2", name: "Pariwana Backpackers", city: "Lima", country: "Peru", pricePerNight: 20, rating: 4.5, reviewCount: 1203, amenities: ["Free WiFi", "Bar", "Rooftop", "Breakfast"], distance: "0.1km from Miraflores", savedAt: "1 week ago" },
];

const defaultIntelAlerts: IntelAlert[] = [
  { id: "1", type: "urgent", title: "Immigration Forms Reminder", description: "Complete your Ecuador immigration forms now to avoid delays. Your border crossing is in 2 days.", action: "Complete Forms Now" },
  { id: "2", type: "urgent", title: "Weather Alert: Banos", description: "Heavy rain and potential for landslides expected this weekend. Consider adjusting your plans." },
  { id: "3", type: "trip-assist", title: "Booking Confirmed: Viajero Hostel", description: "Your 5-night stay in Medellin is confirmed. Check-in is March 15th." },
  { id: "4", type: "trip-assist", title: "New Travel Buddy Match", description: "Maya K. is also traveling from Salento to Quito on March 24th. Want to connect?" },
  { id: "5", type: "quest", title: "How's the bus from Salento to Quito?", description: "You recently took this route. Help other travelers by sharing if the bus ran on time.", action: "Answer & Earn", points: 25 },
  { id: "6", type: "quest", title: "Rate Viajero Hostel Medellin", description: "Share your experience to help the community and earn points for your next adventure.", action: "Answer & Earn", points: 15 },
];

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>(demoTrip);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<TransitLeg | null>(null);
  const [activeTab, setActiveTab] = useState<"journey" | "guide" | "social" | "wallet">("journey");
  const [menuPage, setMenuPage] = useState<MenuPage>("none");
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [savedPlaces] = useState<SavedPlace[]>(defaultSavedPlaces);
  const [savedHostels] = useState<SavedHostel[]>(defaultSavedHostels);
  const [intelAlerts] = useState<IntelAlert[]>(defaultIntelAlerts);

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

  const addKarmaPoints = (points: number) => {
    setUser(prev => ({ ...prev, karmaPoints: prev.karmaPoints + points }));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        selectedStop,
        selectedLeg,
        activeTab,
        menuPage,
        user,
        preferences,
        savedPlaces,
        savedHostels,
        intelAlerts,
        setSelectedStop,
        setSelectedLeg,
        setActiveTab,
        setMenuPage,
        updateStopBooking,
        updateLegBooking,
        addKarmaPoints,
        updatePreferences,
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
