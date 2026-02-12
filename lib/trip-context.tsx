"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { demoTrip, applyStopDateChangeWithCascade, type Trip, type Stop, type TransitLeg } from "./trip-data";
import { isApiConfigured } from "./api/config";
import * as travellerInsightsApi from "./api/traveller-insights";
import * as bookingsApi from "./api/bookings";

// User preferences type
export interface UserPreferences {
  dailyBudget: string;
  currency: string;
  accommodationTypes: string[];
  securityPriority: number;
  sustainabilityFocus: number;
  sociabilityLevel: number;
}

// User stats/gamification
export interface UserStats {
  countriesVisited: number;
  daysTraveled: number;
  totalSpent: number;
  journeysTaken: number;
  karmaPoints: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  color: "pink" | "purple" | "mint" | "coral";
  unlockedAt?: Date;
}

// Saved items
export interface SavedHostel {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  distance: string;
  amenities: string[];
  savedAt: Date;
  image?: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  rating: number;
  savedAt: Date;
  image?: string;
}

// Bookings
export interface Booking {
  id: string;
  type: "hostel" | "transport" | "activity";
  name: string;
  location: string;
  date: string;
  price: number;
  status: "confirmed" | "not-booked";
  image?: string;
}

// Intel Hub types
export interface Alert {
  id: string;
  type: "urgent" | "info" | "assist";
  title: string;
  description: string;
  action?: string;
}

export interface CommunityQuest {
  id: string;
  question: string;
  description: string;
  points: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  karmaPoints: number;
}

type TabType = "journey" | "guide" | "social" | "wallet" | "menu";
type SubPageType = null | "bookings" | "timeline" | "savedHostels" | "savedPlaces" | "stats" | "tripHistory" | "preferences" | "safety" | "intelHub" | "social" | "hostelDetails" | "transportBooking" | "bookingDetails" | "transitBookingDetails" | "modifyBooking" | "hostelCheckout" | "transitCheckout";

interface TripContextType {
  trip: Trip;
  selectedStop: Stop | null;
  selectedLeg: TransitLeg | null;
  activeTab: TabType;
  subPage: SubPageType;
  setSelectedStop: (stop: Stop | null) => void;
  setSelectedLeg: (leg: TransitLeg | null) => void;
  setActiveTab: (tab: TabType) => void;
  setSubPage: (page: SubPageType) => void;
  updateStopBooking: (stopId: string, status: "booked" | "not-booked") => void;
  updateLegBooking: (legId: string, status: "booked" | "not-booked") => void;
  updateStopDates: (stopId: string, startDate: string, endDate: string) => void;
  pendingBooking: any;
  setPendingBooking: (data: any) => void;
  // User data
  userPreferences: UserPreferences;
  setUserPreferences: (prefs: UserPreferences) => void;
  userStats: UserStats;
  addKarmaPoints: (points: number) => void;
  savedHostels: SavedHostel[];
  savedPlaces: SavedPlace[];
  bookings: Booking[];
  alerts: Alert[];
  communityQuests: CommunityQuest[];
  user: User;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// Demo data
const defaultPreferences: UserPreferences = {
  dailyBudget: "$30-50 per day",
  currency: "USD ($)",
  accommodationTypes: ["Hostels", "Shared Rooms"],
  securityPriority: 75,
  sustainabilityFocus: 60,
  sociabilityLevel: 85,
};

const defaultStats: UserStats = {
  countriesVisited: 4,
  daysTraveled: 45,
  totalSpent: 2840,
  journeysTaken: 12,
  karmaPoints: 2847,
  achievements: [
    {
      id: "1",
      title: "Andes Explorer",
      description: "Visited 3 Andean destinations",
      points: 150,
      icon: "mountain",
      color: "pink",
      unlockedAt: new Date("2024-03-15"),
    },
    {
      id: "2",
      title: "Bus Master",
      description: "Traveled 1000+ km by bus",
      points: 200,
      icon: "bus",
      color: "purple",
      unlockedAt: new Date("2024-03-20"),
    },
    {
      id: "3",
      title: "Hostel Hopper",
      description: "Stayed in 10+ hostels",
      points: 100,
      icon: "home",
      color: "mint",
      unlockedAt: new Date("2024-03-22"),
    },
    {
      id: "4",
      title: "Budget Guru",
      description: "Spent under $50/day for 2 weeks",
      points: 125,
      icon: "bus",
      color: "coral",
      unlockedAt: new Date("2024-03-25"),
    },
  ],
};

const defaultSavedHostels: SavedHostel[] = [
  {
    id: "1",
    name: "Wild Rover Cusco",
    city: "Cusco",
    country: "Peru",
    price: 18,
    rating: 4.2,
    reviews: 324,
    distance: "0.5km from Plaza de Armas",
    amenities: ["Free WiFi", "Breakfast", "Bar"],
    savedAt: new Date("2024-03-10"),
  },
  {
    id: "2",
    name: "Loki La Paz",
    city: "La Paz",
    country: "Bolivia",
    price: 15,
    rating: 4.5,
    reviews: 892,
    distance: "0.3km from Witches Market",
    amenities: ["Free WiFi", "Rooftop", "Kitchen"],
    savedAt: new Date("2024-03-12"),
  },
];

const defaultSavedPlaces: SavedPlace[] = [
  {
    id: "1",
    name: "Machu Picchu",
    city: "Cusco",
    country: "Peru",
    category: "Historical Site",
    rating: 4.9,
    savedAt: new Date("2024-03-05"),
  },
  {
    id: "2",
    name: "Salar de Uyuni",
    city: "Uyuni",
    country: "Bolivia",
    category: "Natural Wonder",
    rating: 4.8,
    savedAt: new Date("2024-03-08"),
  },
  {
    id: "3",
    name: "Valle de la Luna",
    city: "San Pedro de Atacama",
    country: "Chile",
    category: "Natural Wonder",
    rating: 4.7,
    savedAt: new Date("2024-03-14"),
  },
];

const defaultBookings: Booking[] = [
  {
    id: "1",
    type: "hostel",
    name: "Pariwana Hostel Cusco",
    location: "Cusco, Peru",
    date: "Mar 24-28, 2024",
    price: 72,
    status: "confirmed",
  },
  {
    id: "2",
    type: "transport",
    name: "Cruz del Sur Bus",
    location: "Cusco to Puno",
    date: "Mar 28, 2024",
    price: 35,
    status: "confirmed",
  },
  {
    id: "3",
    type: "activity",
    name: "Salkantay Trek",
    location: "Cusco, Peru",
    date: "Apr 1-5, 2024",
    price: 280,
    status: "not-booked",
  },
];

const defaultAlerts: Alert[] = [
  {
    id: "1",
    type: "urgent",
    title: "Immigration Forms Reminder",
    description: "Complete your Bolivia immigration forms now to avoid delays. Your border crossing is in 2 days.",
    action: "Complete Forms Now",
  },
  {
    id: "2",
    type: "urgent",
    title: "Weather Alert: Uyuni",
    description: "Heavy rain expected in Uyuni this weekend. Salt flats tours may be affected.",
  },
  {
    id: "3",
    type: "assist",
    title: "Booking Confirmed: Pariwana",
    description: "Your 4-night stay in Cusco is confirmed. Check-in is March 24th.",
  },
  {
    id: "4",
    type: "info",
    title: "New Travel Buddy Match",
    description: "Maya K. is also traveling from Cusco to La Paz on March 28th. Want to connect?",
  },
];

const defaultUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  karmaPoints: 2847,
};

const defaultQuests: CommunityQuest[] = [
  {
    id: "1",
    question: "How's the bus from Cusco to Puno?",
    description: "You recently took this route. Help other travelers by sharing if the bus ran on time.",
    points: 25,
  },
  {
    id: "2",
    question: "Rate Pariwana Hostel Cusco",
    description: "Share your experience to help the community and earn points for your next adventure.",
    points: 15,
  },
];

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>(demoTrip);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<TransitLeg | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("journey");
  const [subPage, setSubPage] = useState<SubPageType>(null);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [savedHostels] = useState<SavedHostel[]>(defaultSavedHostels);
  const [savedPlaces] = useState<SavedPlace[]>(defaultSavedPlaces);
  const [bookings, setBookings] = useState<Booking[]>(defaultBookings);
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [communityQuests, setCommunityQuests] = useState<CommunityQuest[]>(defaultQuests);

  // Integrate with APIs when configured: traveller insights (alerts, quests) and bookings
  useEffect(() => {
    if (!isApiConfigured()) return;
    travellerInsightsApi.listAlerts({}).then((list) => {
      if (list.length)
        setAlerts(
          list.map((dto) => ({
            id: dto.id,
            type: dto.type as Alert["type"],
            title: dto.title,
            description: dto.description,
            action: dto.action,
          }))
        );
    }).catch(() => {});
    travellerInsightsApi.listCommunityQuests({}).then((list) => {
      if (list.length)
        setCommunityQuests(
          list.map((dto) => ({
            id: dto.id,
            question: dto.question,
            description: dto.description,
            points: dto.points,
          }))
        );
    }).catch(() => {});
    bookingsApi.listBookings({}).then((list) => {
      if (list.length)
        setBookings(
          list.map((dto) => ({
            id: dto.id,
            type: dto.type,
            name: dto.name,
            location: dto.location,
            date: dto.date,
            price: dto.price,
            status: (dto.status === "cancelled" ? "confirmed" : dto.status) as Booking["status"],
            image: dto.image,
          }))
        );
    }).catch(() => {});
  }, []);

  const updateStopBooking = (stopId: string, status: "booked" | "not-booked") => {
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.id === stopId ? { ...s, bookingStatus: status } : s
      ),
    }));
  };

  const updateLegBooking = (legId: string, status: "booked" | "not-booked") => {
    setTrip(prev => ({
      ...prev,
      transitLegs: prev.transitLegs.map(l => 
        l.id === legId ? { ...l, bookingStatus: status } : l
      ),
    }));
  };

  const updateStopDates = (stopId: string, startDate: string, endDate: string) => {
    setTrip(prev => applyStopDateChangeWithCascade(prev, stopId, startDate, endDate));
  };

  const addKarmaPoints = (points: number) => {
    setUserStats(prev => ({
      ...prev,
      karmaPoints: prev.karmaPoints + points,
    }));
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        selectedStop,
        selectedLeg,
        activeTab,
        subPage,
        setSelectedStop,
        setSelectedLeg,
        setActiveTab,
        setSubPage,
        updateStopBooking,
        updateLegBooking,
        updateStopDates,
        pendingBooking,
        setPendingBooking,
        userPreferences,
        setUserPreferences,
        userStats,
        addKarmaPoints,
        savedHostels,
        savedPlaces,
        bookings,
        alerts,
        communityQuests,
        user: { ...defaultUser, karmaPoints: userStats.karmaPoints },
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
