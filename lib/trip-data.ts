export type BookingStatus = "booked" | "pending" | "not-booked";
export type StopStatus = "ACTIVE" | "UPCOMING" | "PLANNED" | "DRAFT" | "FUTURE";
export type TransportType = "bus" | "boat" | "train" | "shuttle" | "ferry" | "jeep";

export interface FlywheelRequest {
  type: "flywheel_request";
  text: string;
  action: string;
}

export interface PodAlert {
  style: "POD_LOGISTICS_CARD" | "CRITICAL_INLINE_CARD";
  title: string;
  body: string;
  action?: string;
  podAction?: string;
}

export interface Stop {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  nights: number;
  latitude: number;
  longitude: number;
  bookingStatus: BookingStatus;
  status: StopStatus;
  hostelName?: string;
  hostelPrice?: number;
  currency?: string;
  tags?: string[];
  highlight?: string;
  note?: string;
  activity?: string;
  communityTips?: string[];
  alerts?: FlywheelRequest[];
  bookingAlert?: PodAlert;
}

export interface TransitLeg {
  id: string;
  fromStopId: string;
  toStopId: string;
  type: TransportType;
  mode?: string;
  route?: string;
  duration: string;
  departureTime?: string;
  bookingStatus: BookingStatus;
  price?: number;
  currency?: string;
  operator?: string;
  communityTip?: string;
  flywheelData?: string;
  verifiedCount?: number;
  alert?: PodAlert;
  note?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  userStatus: string;
  currentLocation: string;
  currentDay: number;
  stops: Stop[];
  transitLegs: TransitLeg[];
}

// Demo trip: Andes Overland Circuit (NO FLIGHTS - overland only)
export const demoTrip: Trip = {
  id: "andes-overland-2026",
  name: "Andes Overland Circuit",
  startDate: "2026-03-01",
  endDate: "2026-05-15",
  userStatus: "Travelling with Pod (3 Pax)",
  currentLocation: "Cusco, Peru",
  currentDay: 25,
  stops: [
    {
      id: "stop-1",
      city: "Cusco",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-03-20",
      endDate: "2026-03-25",
      nights: 5,
      latitude: -13.5319,
      longitude: -71.9675,
      bookingStatus: "booked",
      status: "ACTIVE",
      hostelName: "Pariwana Hostel",
      hostelPrice: 14,
      currency: "USD",
      highlight: "Machu Picchu Return",
      tags: ["Sacred Valley", "Inca Trail", "Altitude"],
      alerts: [
        {
          type: "flywheel_request",
          text: "Did you pay 70 Soles for the taxi from Poroy?",
          action: "Verify Price",
        },
      ],
    },
    {
      id: "stop-2",
      city: "Puno",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-03-26",
      endDate: "2026-03-27",
      nights: 1,
      latitude: -15.8402,
      longitude: -70.0219,
      bookingStatus: "pending",
      status: "UPCOMING",
      note: "Stopover for Lake Titicaca",
      tags: ["Lake Titicaca", "Floating Islands"],
    },
    {
      id: "stop-3",
      city: "La Paz",
      country: "Bolivia",
      countryCode: "BO",
      startDate: "2026-03-28",
      endDate: "2026-04-01",
      nights: 4,
      latitude: -16.5,
      longitude: -68.15,
      bookingStatus: "not-booked",
      status: "PLANNED",
      hostelName: "Wild Rover La Paz",
      tags: ["Death Road", "Witches Market", "Cable Cars"],
      bookingAlert: {
        style: "POD_LOGISTICS_CARD",
        title: "High Demand Alert",
        body: "For a Pod of 3, you must book 5 days in advance to get a private room. 85% booked.",
        action: "Book Now for 3 Pax",
      },
    },
    {
      id: "stop-4",
      city: "Uyuni",
      country: "Bolivia",
      countryCode: "BO",
      startDate: "2026-04-02",
      endDate: "2026-04-05",
      nights: 3,
      latitude: -20.4637,
      longitude: -66.825,
      bookingStatus: "not-booked",
      status: "DRAFT",
      activity: "4x4 Jeep Crossing into Chile",
      tags: ["Salt Flats", "Stargazing", "Photo Ops"],
    },
    {
      id: "stop-5",
      city: "San Pedro de Atacama",
      country: "Chile",
      countryCode: "CL",
      startDate: "2026-04-08",
      endDate: "2026-04-12",
      nights: 4,
      latitude: -22.9087,
      longitude: -68.1997,
      bookingStatus: "not-booked",
      status: "FUTURE",
      tags: ["Valle de la Luna", "Geysers", "Desert"],
    },
    {
      id: "stop-6",
      city: "Salta",
      country: "Argentina",
      countryCode: "AR",
      startDate: "2026-04-14",
      endDate: "2026-04-18",
      nights: 4,
      latitude: -24.7821,
      longitude: -65.4232,
      bookingStatus: "not-booked",
      status: "FUTURE",
      note: "Steak & Wine recovery",
      tags: ["Wine Region", "Colonial", "Empanadas"],
    },
  ],
  transitLegs: [
    {
      id: "leg-1",
      fromStopId: "stop-1",
      toStopId: "stop-2",
      type: "bus",
      mode: "Bus",
      route: "Cusco -> Puno",
      duration: "7h",
      operator: "Transzela",
      bookingStatus: "booked",
      price: 25,
      currency: "USD",
      flywheelData: "WiFi works",
      verifiedCount: 12,
    },
    {
      id: "leg-2",
      fromStopId: "stop-2",
      toStopId: "stop-3",
      type: "ferry",
      mode: "Ferry + Bus",
      route: "Puno -> Copacabana -> La Paz",
      duration: "4h + 3h",
      bookingStatus: "pending",
      price: 15,
      currency: "USD",
      alert: {
        style: "CRITICAL_INLINE_CARD",
        title: "Border Crossing: Peru -> Bolivia",
        body: "This border post does NOT accept cards. You need $30 USD in clean bills per person.",
        podAction: "Remind Pod to withdraw cash",
      },
    },
    {
      id: "leg-3",
      fromStopId: "stop-3",
      toStopId: "stop-4",
      type: "bus",
      mode: "Night Bus (Cama)",
      route: "La Paz -> Uyuni",
      duration: "9h",
      operator: "Todo Turismo",
      bookingStatus: "not-booked",
      price: 20,
      currency: "USD",
      communityTip: "Heating often broken - bring layers",
      verifiedCount: 47,
    },
    {
      id: "leg-4",
      fromStopId: "stop-4",
      toStopId: "stop-5",
      type: "jeep",
      mode: "Jeep Transfer",
      route: "Uyuni -> San Pedro de Atacama",
      duration: "3 Days (Off-road)",
      note: "Crossing the Andes",
      bookingStatus: "not-booked",
      price: 180,
      currency: "USD",
    },
    {
      id: "leg-5",
      fromStopId: "stop-5",
      toStopId: "stop-6",
      type: "bus",
      mode: "Bus",
      route: "San Pedro -> Salta",
      duration: "12h",
      bookingStatus: "not-booked",
      communityTip: "Incredible mountain scenery - sit on the left side",
      verifiedCount: 23,
    },
  ],
};

export function getStopById(trip: Trip, stopId: string): Stop | undefined {
  return trip.stops.find((s) => s.id === stopId);
}

export function getTransitLeg(
  trip: Trip,
  fromId: string,
  toId: string
): TransitLeg | undefined {
  return trip.transitLegs.find(
    (l) => l.fromStopId === fromId && l.toStopId === toId
  );
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}`;
  }
  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
}

export function getTripDuration(trip: Trip): number {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getBookingStats(trip: Trip) {
  const booked = trip.stops.filter((s) => s.bookingStatus === "booked").length;
  const pending = trip.stops.filter(
    (s) => s.bookingStatus === "pending"
  ).length;
  const notBooked = trip.stops.filter(
    (s) => s.bookingStatus === "not-booked"
  ).length;
  return { booked, pending, notBooked, total: trip.stops.length };
}
