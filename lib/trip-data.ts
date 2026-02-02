export type BookingStatus = "booked" | "pending" | "not-booked";
export type TransportType = "bus" | "flight" | "boat" | "train" | "shuttle";

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
  hostelName?: string;
  hostelPrice?: number;
  currency?: string;
  tags?: string[];
  communityTips?: string[];
}

export interface TransitLeg {
  id: string;
  fromStopId: string;
  toStopId: string;
  type: TransportType;
  duration: string;
  departureTime?: string;
  bookingStatus: BookingStatus;
  price?: number;
  currency?: string;
  operator?: string;
  communityTip?: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stops: Stop[];
  transitLegs: TransitLeg[];
}

// Demo trip: 3 months through Latin America
export const demoTrip: Trip = {
  id: "latam-adventure-2026",
  name: "Latin America Adventure",
  startDate: "2026-03-01",
  endDate: "2026-05-31",
  stops: [
    {
      id: "stop-1",
      city: "Mexico City",
      country: "Mexico",
      countryCode: "MX",
      startDate: "2026-03-01",
      endDate: "2026-03-05",
      nights: 4,
      latitude: 19.4326,
      longitude: -99.1332,
      bookingStatus: "booked",
      hostelName: "Casa Pepe Hostel",
      hostelPrice: 18,
      currency: "USD",
      tags: ["Rooftop Bar", "Walking Tours", "Social"],
      communityTips: ["Best tacos at the corner street vendor", "Free walking tour leaves at 10am daily"]
    },
    {
      id: "stop-2",
      city: "Oaxaca",
      country: "Mexico",
      countryCode: "MX",
      startDate: "2026-03-06",
      endDate: "2026-03-10",
      nights: 4,
      latitude: 17.0732,
      longitude: -96.7266,
      bookingStatus: "booked",
      hostelName: "Hostal Central Oaxaca",
      hostelPrice: 15,
      currency: "USD",
      tags: ["Cooking Class", "Mezcal Tasting"],
      communityTips: ["Monte Alban best visited early morning"]
    },
    {
      id: "stop-3",
      city: "San Cristobal",
      country: "Mexico",
      countryCode: "MX",
      startDate: "2026-03-11",
      endDate: "2026-03-14",
      nights: 3,
      latitude: 16.7370,
      longitude: -92.6376,
      bookingStatus: "pending",
      hostelName: "Puerta Vieja Hostel",
      hostelPrice: 12,
      currency: "USD",
      tags: ["Mountains", "Indigenous Culture"],
    },
    {
      id: "stop-4",
      city: "Flores",
      country: "Guatemala",
      countryCode: "GT",
      startDate: "2026-03-15",
      endDate: "2026-03-18",
      nights: 3,
      latitude: 16.9304,
      longitude: -89.8912,
      bookingStatus: "not-booked",
      tags: ["Lake Island", "Tikal Gateway"],
      communityTips: ["Sunrise tour to Tikal is unmissable"]
    },
    {
      id: "stop-5",
      city: "Antigua",
      country: "Guatemala",
      countryCode: "GT",
      startDate: "2026-03-19",
      endDate: "2026-03-24",
      nights: 5,
      latitude: 14.5586,
      longitude: -90.7295,
      bookingStatus: "not-booked",
      tags: ["Spanish School", "Volcanoes", "Colonial"],
    },
    {
      id: "stop-6",
      city: "Lake Atitlan",
      country: "Guatemala",
      countryCode: "GT",
      startDate: "2026-03-25",
      endDate: "2026-03-30",
      nights: 5,
      latitude: 14.6872,
      longitude: -91.2431,
      bookingStatus: "not-booked",
      tags: ["Lake Views", "Yoga Retreats", "Hippie Trail"],
    },
    {
      id: "stop-7",
      city: "Leon",
      country: "Nicaragua",
      countryCode: "NI",
      startDate: "2026-04-01",
      endDate: "2026-04-04",
      nights: 3,
      latitude: 12.4379,
      longitude: -86.8780,
      bookingStatus: "not-booked",
      tags: ["Volcano Boarding", "Colonial City"],
    },
    {
      id: "stop-8",
      city: "Granada",
      country: "Nicaragua",
      countryCode: "NI",
      startDate: "2026-04-05",
      endDate: "2026-04-08",
      nights: 3,
      latitude: 11.9344,
      longitude: -85.9560,
      bookingStatus: "not-booked",
      tags: ["Colonial Architecture", "Isletas Tour"],
    },
    {
      id: "stop-9",
      city: "San Juan del Sur",
      country: "Nicaragua",
      countryCode: "NI",
      startDate: "2026-04-09",
      endDate: "2026-04-13",
      nights: 4,
      latitude: 11.2537,
      longitude: -85.8700,
      bookingStatus: "not-booked",
      tags: ["Surfing", "Beach Party", "Sunday Funday"],
    },
    {
      id: "stop-10",
      city: "Monteverde",
      country: "Costa Rica",
      countryCode: "CR",
      startDate: "2026-04-15",
      endDate: "2026-04-18",
      nights: 3,
      latitude: 10.3027,
      longitude: -84.8245,
      bookingStatus: "not-booked",
      tags: ["Cloud Forest", "Zipline", "Wildlife"],
    },
    {
      id: "stop-11",
      city: "La Fortuna",
      country: "Costa Rica",
      countryCode: "CR",
      startDate: "2026-04-19",
      endDate: "2026-04-22",
      nights: 3,
      latitude: 10.4679,
      longitude: -84.6427,
      bookingStatus: "not-booked",
      tags: ["Arenal Volcano", "Hot Springs", "Adventure"],
    },
    {
      id: "stop-12",
      city: "Puerto Viejo",
      country: "Costa Rica",
      countryCode: "CR",
      startDate: "2026-04-23",
      endDate: "2026-04-28",
      nights: 5,
      latitude: 9.6558,
      longitude: -82.7539,
      bookingStatus: "not-booked",
      tags: ["Caribbean Vibes", "Reggae", "Beach"],
    },
    {
      id: "stop-13",
      city: "Bocas del Toro",
      country: "Panama",
      countryCode: "PA",
      startDate: "2026-04-29",
      endDate: "2026-05-04",
      nights: 5,
      latitude: 9.3404,
      longitude: -82.2408,
      bookingStatus: "not-booked",
      tags: ["Island Hopping", "Snorkeling", "Party"],
    },
    {
      id: "stop-14",
      city: "Boquete",
      country: "Panama",
      countryCode: "PA",
      startDate: "2026-05-05",
      endDate: "2026-05-08",
      nights: 3,
      latitude: 8.7795,
      longitude: -82.4411,
      bookingStatus: "not-booked",
      tags: ["Coffee Tours", "Hiking", "Cool Climate"],
    },
    {
      id: "stop-15",
      city: "Panama City",
      country: "Panama",
      countryCode: "PA",
      startDate: "2026-05-09",
      endDate: "2026-05-12",
      nights: 3,
      latitude: 8.9824,
      longitude: -79.5199,
      bookingStatus: "not-booked",
      tags: ["Casco Viejo", "Panama Canal", "City Life"],
    },
    {
      id: "stop-16",
      city: "Cartagena",
      country: "Colombia",
      countryCode: "CO",
      startDate: "2026-05-13",
      endDate: "2026-05-18",
      nights: 5,
      latitude: 10.3910,
      longitude: -75.4794,
      bookingStatus: "not-booked",
      tags: ["Old Town", "Beaches", "Salsa"],
    },
    {
      id: "stop-17",
      city: "Medellin",
      country: "Colombia",
      countryCode: "CO",
      startDate: "2026-05-19",
      endDate: "2026-05-26",
      nights: 7,
      latitude: 6.2442,
      longitude: -75.5812,
      bookingStatus: "not-booked",
      tags: ["Digital Nomad Hub", "Co-working", "Nightlife", "Spring Weather"],
    },
    {
      id: "stop-18",
      city: "Bogota",
      country: "Colombia",
      countryCode: "CO",
      startDate: "2026-05-27",
      endDate: "2026-05-31",
      nights: 4,
      latitude: 4.7110,
      longitude: -74.0721,
      bookingStatus: "not-booked",
      tags: ["Culture", "Museums", "Street Art"],
    },
  ],
  transitLegs: [
    {
      id: "leg-1",
      fromStopId: "stop-1",
      toStopId: "stop-2",
      type: "bus",
      duration: "7h",
      bookingStatus: "booked",
      price: 35,
      currency: "USD",
      operator: "ADO",
    },
    {
      id: "leg-2",
      fromStopId: "stop-2",
      toStopId: "stop-3",
      type: "bus",
      duration: "10h",
      bookingStatus: "booked",
      price: 28,
      currency: "USD",
      operator: "OCC",
      communityTip: "Night bus recommended - arrives early morning"
    },
    {
      id: "leg-3",
      fromStopId: "stop-3",
      toStopId: "stop-4",
      type: "shuttle",
      duration: "8h",
      bookingStatus: "pending",
      price: 45,
      currency: "USD",
      communityTip: "Border crossing can take 2+ hours"
    },
    {
      id: "leg-4",
      fromStopId: "stop-4",
      toStopId: "stop-5",
      type: "shuttle",
      duration: "9h",
      bookingStatus: "not-booked",
      price: 40,
      currency: "USD",
    },
    {
      id: "leg-5",
      fromStopId: "stop-5",
      toStopId: "stop-6",
      type: "shuttle",
      duration: "3h",
      bookingStatus: "not-booked",
      price: 15,
      currency: "USD",
    },
    {
      id: "leg-6",
      fromStopId: "stop-6",
      toStopId: "stop-7",
      type: "bus",
      duration: "14h",
      bookingStatus: "not-booked",
      communityTip: "This is usually 2-3 hours late. Pack snacks!"
    },
    {
      id: "leg-7",
      fromStopId: "stop-7",
      toStopId: "stop-8",
      type: "bus",
      duration: "2h",
      bookingStatus: "not-booked",
      price: 3,
      currency: "USD",
    },
    {
      id: "leg-8",
      fromStopId: "stop-8",
      toStopId: "stop-9",
      type: "shuttle",
      duration: "2h",
      bookingStatus: "not-booked",
      price: 20,
      currency: "USD",
    },
    {
      id: "leg-9",
      fromStopId: "stop-9",
      toStopId: "stop-10",
      type: "shuttle",
      duration: "8h",
      bookingStatus: "not-booked",
      communityTip: "Border at Penas Blancas - arrive early"
    },
    {
      id: "leg-10",
      fromStopId: "stop-10",
      toStopId: "stop-11",
      type: "bus",
      duration: "4h",
      bookingStatus: "not-booked",
    },
    {
      id: "leg-11",
      fromStopId: "stop-11",
      toStopId: "stop-12",
      type: "bus",
      duration: "5h",
      bookingStatus: "not-booked",
    },
    {
      id: "leg-12",
      fromStopId: "stop-12",
      toStopId: "stop-13",
      type: "boat",
      duration: "3h",
      bookingStatus: "not-booked",
      price: 35,
      currency: "USD",
      communityTip: "Water taxi from Sixaola border - scenic route!"
    },
    {
      id: "leg-13",
      fromStopId: "stop-13",
      toStopId: "stop-14",
      type: "bus",
      duration: "5h",
      bookingStatus: "not-booked",
    },
    {
      id: "leg-14",
      fromStopId: "stop-14",
      toStopId: "stop-15",
      type: "bus",
      duration: "7h",
      bookingStatus: "not-booked",
    },
    {
      id: "leg-15",
      fromStopId: "stop-15",
      toStopId: "stop-16",
      type: "flight",
      duration: "1h 15m",
      bookingStatus: "not-booked",
      price: 120,
      currency: "USD",
      operator: "Copa Airlines",
    },
    {
      id: "leg-16",
      fromStopId: "stop-16",
      toStopId: "stop-17",
      type: "flight",
      duration: "1h",
      bookingStatus: "not-booked",
      price: 80,
      currency: "USD",
    },
    {
      id: "leg-17",
      fromStopId: "stop-17",
      toStopId: "stop-18",
      type: "flight",
      duration: "1h",
      bookingStatus: "not-booked",
      price: 60,
      currency: "USD",
    },
  ],
};

export function getStopById(trip: Trip, stopId: string): Stop | undefined {
  return trip.stops.find(s => s.id === stopId);
}

export function getTransitLeg(trip: Trip, fromId: string, toId: string): TransitLeg | undefined {
  return trip.transitLegs.find(l => l.fromStopId === fromId && l.toStopId === toId);
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  
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
  const booked = trip.stops.filter(s => s.bookingStatus === 'booked').length;
  const pending = trip.stops.filter(s => s.bookingStatus === 'pending').length;
  const notBooked = trip.stops.filter(s => s.bookingStatus === 'not-booked').length;
  return { booked, pending, notBooked, total: trip.stops.length };
}
