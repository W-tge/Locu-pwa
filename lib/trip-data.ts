export type BookingStatus = "booked" | "pending" | "not-booked";
export type StopStatus = "ACTIVE" | "UPCOMING" | "PLANNED" | "DRAFT" | "FUTURE" | "COMPLETED";
export type TransportType = "bus" | "boat" | "train" | "shuttle" | "ferry" | "jeep" | "colectivo";

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

export interface Insight {
  id: string;
  type: "tip" | "reminder" | "alert";
  icon: "dollar" | "document" | "weather" | "health" | "safety";
  title: string;
  body: string;
  action?: string;
  actionUrl?: string;
  relatedStopId?: string;
}

export interface HostelOption {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  roomType: string;
  amenities: string[];
  distance: string;
  availability: "high" | "medium" | "low";
}

export interface TransportOption {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: string;
  amenities: string[];
  seatsLeft?: number;
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
  hostelImage?: string;
  currency?: string;
  tags?: string[];
  highlight?: string;
  note?: string;
  activity?: string;
  weather?: string;
  communityTips?: string[];
  alerts?: FlywheelRequest[];
  bookingAlert?: PodAlert;
  hostelOptions?: HostelOption[];
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
  departureDate?: string;
  bookingStatus: BookingStatus;
  price?: number;
  currency?: string;
  operator?: string;
  communityTip?: string;
  flywheelData?: string;
  verifiedCount?: number;
  alert?: PodAlert;
  note?: string;
  transportOptions?: TransportOption[];
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  userStatus: string;
  currentLocation: string;
  currentDay: number;
  stops: Stop[];
  transitLegs: TransitLeg[];
  insights: Insight[];
}

// Demo trip: Central America to Bolivia Backpacker Route (90+ days)
export const demoTrip: Trip = {
  id: "latam-2026",
  name: "Central to South America",
  description: "Classic Backpacking Route",
  startDate: "2026-02-01",
  endDate: "2026-05-15",
  userStatus: "Travelling with Pod (3 Pax)",
  currentLocation: "Antigua, Guatemala",
  currentDay: 12,
  stops: [
    {
      id: "stop-1",
      city: "Antigua",
      country: "Guatemala",
      countryCode: "GT",
      startDate: "2026-02-01",
      endDate: "2026-02-07",
      nights: 6,
      latitude: 14.5586,
      longitude: -90.7295,
      bookingStatus: "booked",
      status: "ACTIVE",
      hostelName: "Earth Lodge",
      hostelPrice: 12,
      hostelImage: "/hostels/earth-lodge.jpg",
      currency: "USD",
      highlight: "Spanish School Base",
      weather: "24°C",
      tags: ["Colonial", "Volcanoes", "Spanish Classes"],
      communityTips: ["Take the chicken bus to Lake Atitlan - only Q25!", "Cerro de la Cruz has amazing sunset views"],
    },
    {
      id: "stop-2",
      city: "Lake Atitlan",
      country: "Guatemala",
      countryCode: "GT",
      startDate: "2026-02-08",
      endDate: "2026-02-13",
      nights: 5,
      latitude: 14.6872,
      longitude: -91.2614,
      bookingStatus: "booked",
      status: "UPCOMING",
      hostelName: "Free Cerveza",
      hostelPrice: 10,
      hostelImage: "/hostels/free-cerveza.jpg",
      currency: "USD",
      highlight: "San Pedro village vibes",
      weather: "22°C",
      tags: ["Lake", "Hippie Villages", "Hiking"],
    },
    {
      id: "stop-3",
      city: "San Ignacio",
      country: "Belize",
      countryCode: "BZ",
      startDate: "2026-02-15",
      endDate: "2026-02-18",
      nights: 3,
      latitude: 17.1591,
      longitude: -89.0696,
      bookingStatus: "pending",
      status: "PLANNED",
      weather: "28°C",
      tags: ["Mayan Ruins", "Cave Tubing", "Jungle"],
      bookingAlert: {
        style: "POD_LOGISTICS_CARD",
        title: "Belize is pricey!",
        body: "Budget hostels fill up fast here. Book now to secure $25/night rate.",
        action: "Book for 3 Pax",
      },
    },
    {
      id: "stop-4",
      city: "Caye Caulker",
      country: "Belize",
      countryCode: "BZ",
      startDate: "2026-02-19",
      endDate: "2026-02-22",
      nights: 3,
      latitude: 17.7500,
      longitude: -88.0333,
      bookingStatus: "not-booked",
      status: "PLANNED",
      weather: "29°C",
      tags: ["Island", "Snorkeling", "Reggae"],
      highlight: "Go Slow island life",
    },
    {
      id: "stop-5",
      city: "Granada",
      country: "Nicaragua",
      countryCode: "NI",
      startDate: "2026-02-25",
      endDate: "2026-03-01",
      nights: 4,
      latitude: 11.9344,
      longitude: -85.9560,
      bookingStatus: "not-booked",
      status: "DRAFT",
      weather: "32°C",
      tags: ["Colonial", "Volcanoes", "Budget"],
      highlight: "Cheapest country in CA",
    },
    {
      id: "stop-6",
      city: "San Juan del Sur",
      country: "Nicaragua",
      countryCode: "NI",
      startDate: "2026-03-02",
      endDate: "2026-03-06",
      nights: 4,
      latitude: 11.2528,
      longitude: -85.8708,
      bookingStatus: "not-booked",
      status: "DRAFT",
      weather: "31°C",
      tags: ["Beach", "Surfing", "Party"],
    },
    {
      id: "stop-7",
      city: "Medellin",
      country: "Colombia",
      countryCode: "CO",
      startDate: "2026-03-10",
      endDate: "2026-03-17",
      nights: 7,
      latitude: 6.2442,
      longitude: -75.5812,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "26°C",
      tags: ["City of Eternal Spring", "Digital Nomads", "Nightlife"],
      highlight: "El Poblado base",
      hostelOptions: [
        { id: "h1", name: "Los Patios Hostel", image: "/hostels/los-patios.jpg", price: 18, rating: 4.6, reviews: 1240, roomType: "8-bed mixed dorm", amenities: ["Pool", "Coworking", "Rooftop"], distance: "0.3km from Parque Lleras", availability: "medium" },
        { id: "h2", name: "Selina Medellin", image: "/hostels/selina-medellin.jpg", price: 22, rating: 4.4, reviews: 890, roomType: "6-bed dorm", amenities: ["Pool", "Yoga", "Bar"], distance: "0.5km from Metro", availability: "high" },
      ],
    },
    {
      id: "stop-8",
      city: "Salento",
      country: "Colombia",
      countryCode: "CO",
      startDate: "2026-03-18",
      endDate: "2026-03-22",
      nights: 4,
      latitude: 4.6378,
      longitude: -75.5703,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "20°C",
      tags: ["Coffee Region", "Wax Palms", "Colonial"],
      highlight: "Valle de Cocora hike",
    },
    {
      id: "stop-9",
      city: "Quito",
      country: "Ecuador",
      countryCode: "EC",
      startDate: "2026-03-25",
      endDate: "2026-03-29",
      nights: 4,
      latitude: -0.1807,
      longitude: -78.4678,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "18°C",
      tags: ["Historic Center", "Equator", "Altitude"],
    },
    {
      id: "stop-10",
      city: "Banos",
      country: "Ecuador",
      countryCode: "EC",
      startDate: "2026-03-30",
      endDate: "2026-04-03",
      nights: 4,
      latitude: -1.3928,
      longitude: -78.4269,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "22°C",
      tags: ["Adventure Capital", "Hot Springs", "Swing"],
      highlight: "Casa del Arbol swing",
    },
    {
      id: "stop-11",
      city: "Mancora",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-04-06",
      endDate: "2026-04-10",
      nights: 4,
      latitude: -4.1039,
      longitude: -81.0453,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "28°C",
      tags: ["Beach", "Surfing", "Ceviche"],
    },
    {
      id: "stop-12",
      city: "Huaraz",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-04-12",
      endDate: "2026-04-17",
      nights: 5,
      latitude: -9.5300,
      longitude: -77.5280,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "15°C",
      tags: ["Cordillera Blanca", "Trekking", "Altitude"],
      highlight: "Santa Cruz Trek",
    },
    {
      id: "stop-13",
      city: "Lima",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-04-19",
      endDate: "2026-04-22",
      nights: 3,
      latitude: -12.0464,
      longitude: -77.0428,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "24°C",
      tags: ["Food Capital", "Miraflores", "Museums"],
    },
    {
      id: "stop-14",
      city: "Cusco",
      country: "Peru",
      countryCode: "PE",
      startDate: "2026-04-24",
      endDate: "2026-05-01",
      nights: 7,
      latitude: -13.5319,
      longitude: -71.9675,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "18°C",
      tags: ["Sacred Valley", "Machu Picchu", "Inca"],
      highlight: "Gateway to Machu Picchu",
    },
    {
      id: "stop-15",
      city: "La Paz",
      country: "Bolivia",
      countryCode: "BO",
      startDate: "2026-05-04",
      endDate: "2026-05-09",
      nights: 5,
      latitude: -16.5000,
      longitude: -68.1500,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "12°C",
      tags: ["Highest Capital", "Death Road", "Witches Market"],
      highlight: "World's highest city",
    },
    {
      id: "stop-16",
      city: "Uyuni",
      country: "Bolivia",
      countryCode: "BO",
      startDate: "2026-05-10",
      endDate: "2026-05-14",
      nights: 4,
      latitude: -20.4637,
      longitude: -66.8250,
      bookingStatus: "not-booked",
      status: "FUTURE",
      weather: "8°C",
      tags: ["Salt Flats", "Stargazing", "Surreal"],
      highlight: "Salar de Uyuni",
    },
  ],
  transitLegs: [
    {
      id: "leg-1",
      fromStopId: "stop-1",
      toStopId: "stop-2",
      type: "shuttle",
      mode: "Tourist Shuttle",
      route: "Antigua -> San Pedro",
      duration: "3h",
      departureTime: "8:00 AM",
      departureDate: "2026-02-08",
      operator: "Atitrans",
      bookingStatus: "booked",
      price: 15,
      currency: "USD",
      flywheelData: "Stops at 3 viewpoints",
      verifiedCount: 34,
    },
    {
      id: "leg-2",
      fromStopId: "stop-2",
      toStopId: "stop-3",
      type: "bus",
      mode: "Shuttle + Bus",
      route: "Lake Atitlan -> San Ignacio (via Flores)",
      duration: "10h",
      departureTime: "6:00 AM",
      departureDate: "2026-02-15",
      bookingStatus: "pending",
      price: 45,
      currency: "USD",
      alert: {
        style: "CRITICAL_INLINE_CARD",
        title: "Border Crossing: Guatemala -> Belize",
        body: "Have $20 USD ready for Belize entry fee. Exit tax $15 from Guatemala.",
        podAction: "Set cash reminder",
      },
    },
    {
      id: "leg-3",
      fromStopId: "stop-3",
      toStopId: "stop-4",
      type: "boat",
      mode: "Water Taxi",
      route: "Belize City -> Caye Caulker",
      duration: "45min",
      departureTime: "3:00 PM",
      departureDate: "2026-02-19",
      operator: "San Pedro Belize Express",
      bookingStatus: "not-booked",
      price: 25,
      currency: "USD",
    },
    {
      id: "leg-4",
      fromStopId: "stop-4",
      toStopId: "stop-5",
      type: "bus",
      mode: "Shuttle + Bus",
      route: "Caye Caulker -> Granada (via Managua)",
      duration: "Full day",
      departureTime: "5:00 AM",
      departureDate: "2026-02-25",
      bookingStatus: "not-booked",
      price: 65,
      currency: "USD",
      communityTip: "Book Tica Bus for most comfortable option",
      verifiedCount: 18,
    },
    {
      id: "leg-5",
      fromStopId: "stop-5",
      toStopId: "stop-6",
      type: "colectivo",
      mode: "Colectivo",
      route: "Granada -> San Juan del Sur",
      duration: "2h",
      departureTime: "Any time",
      departureDate: "2026-03-02",
      bookingStatus: "not-booked",
      price: 3,
      currency: "USD",
      flywheelData: "Leaves when full from market",
      verifiedCount: 52,
    },
    {
      id: "leg-6",
      fromStopId: "stop-6",
      toStopId: "stop-7",
      type: "bus",
      mode: "Bus (via Panama City)",
      route: "SJDS -> Medellin",
      duration: "2 days",
      departureTime: "6:00 AM",
      departureDate: "2026-03-10",
      bookingStatus: "not-booked",
      price: 120,
      currency: "USD",
      note: "No Darien Gap crossing - bus via Panama",
      communityTip: "Break journey in Panama City for a night",
    },
    {
      id: "leg-7",
      fromStopId: "stop-7",
      toStopId: "stop-8",
      type: "bus",
      mode: "Bus",
      route: "Medellin -> Salento",
      duration: "6h",
      departureTime: "7:00 AM",
      departureDate: "2026-03-18",
      operator: "Flota Occidental",
      bookingStatus: "not-booked",
      price: 12,
      currency: "USD",
      transportOptions: [
        { id: "t1", operator: "Flota Occidental", departureTime: "7:00 AM", arrivalTime: "1:00 PM", duration: "6h", price: 12, type: "Semi-cama", amenities: ["AC", "WiFi"], seatsLeft: 8 },
        { id: "t2", operator: "Expreso Palmira", departureTime: "9:30 AM", arrivalTime: "3:30 PM", duration: "6h", price: 10, type: "Regular", amenities: ["AC"] },
      ],
    },
    {
      id: "leg-8",
      fromStopId: "stop-8",
      toStopId: "stop-9",
      type: "bus",
      mode: "International Bus",
      route: "Salento -> Quito (via Ipiales)",
      duration: "18h",
      departureTime: "4:00 PM",
      departureDate: "2026-03-25",
      bookingStatus: "not-booked",
      price: 45,
      currency: "USD",
      alert: {
        style: "CRITICAL_INLINE_CARD",
        title: "Border Crossing: Colombia -> Ecuador",
        body: "Rumichaca border can be slow. Have your Ecuador entry form ready online.",
        action: "Complete Form",
      },
    },
    {
      id: "leg-9",
      fromStopId: "stop-9",
      toStopId: "stop-10",
      type: "bus",
      mode: "Bus",
      route: "Quito -> Banos",
      duration: "3.5h",
      departureTime: "9:00 AM",
      departureDate: "2026-03-30",
      operator: "Transportes Banos",
      bookingStatus: "not-booked",
      price: 5,
      currency: "USD",
    },
    {
      id: "leg-10",
      fromStopId: "stop-10",
      toStopId: "stop-11",
      type: "bus",
      mode: "Night Bus",
      route: "Banos -> Mancora (via Tumbes)",
      duration: "20h",
      departureTime: "6:00 PM",
      departureDate: "2026-04-05",
      bookingStatus: "not-booked",
      price: 35,
      currency: "USD",
      alert: {
        style: "CRITICAL_INLINE_CARD",
        title: "Border Crossing: Ecuador -> Peru",
        body: "Huaquillas/Tumbes border - keep valuables secure.",
        podAction: "Alert Pod",
      },
    },
    {
      id: "leg-11",
      fromStopId: "stop-11",
      toStopId: "stop-12",
      type: "bus",
      mode: "Bus",
      route: "Mancora -> Huaraz",
      duration: "14h",
      departureTime: "5:00 PM",
      departureDate: "2026-04-11",
      operator: "Movil Tours",
      bookingStatus: "not-booked",
      price: 25,
      currency: "USD",
    },
    {
      id: "leg-12",
      fromStopId: "stop-12",
      toStopId: "stop-13",
      type: "bus",
      mode: "Bus",
      route: "Huaraz -> Lima",
      duration: "8h",
      departureTime: "10:00 PM",
      departureDate: "2026-04-18",
      operator: "Cruz del Sur",
      bookingStatus: "not-booked",
      price: 20,
      currency: "USD",
    },
    {
      id: "leg-13",
      fromStopId: "stop-13",
      toStopId: "stop-14",
      type: "bus",
      mode: "Night Bus (Cama)",
      route: "Lima -> Cusco",
      duration: "22h",
      departureTime: "5:00 PM",
      departureDate: "2026-04-23",
      operator: "Cruz del Sur",
      bookingStatus: "not-booked",
      price: 45,
      currency: "USD",
      communityTip: "Worth the extra $10 for full cama - scenic route",
      verifiedCount: 89,
    },
    {
      id: "leg-14",
      fromStopId: "stop-14",
      toStopId: "stop-15",
      type: "bus",
      mode: "Tourist Bus",
      route: "Cusco -> Puno -> La Paz",
      duration: "12h total",
      departureTime: "7:00 AM",
      departureDate: "2026-05-03",
      operator: "Bolivia Hop",
      bookingStatus: "not-booked",
      price: 55,
      currency: "USD",
      alert: {
        style: "CRITICAL_INLINE_CARD",
        title: "Border Crossing: Peru -> Bolivia",
        body: "Desaguadero border - NO CARDS accepted. Need $30 USD cash per person.",
        podAction: "Withdraw cash together",
      },
      flywheelData: "Stops at Puno and Lake Titicaca",
      verifiedCount: 67,
    },
    {
      id: "leg-15",
      fromStopId: "stop-15",
      toStopId: "stop-16",
      type: "bus",
      mode: "Night Bus",
      route: "La Paz -> Uyuni",
      duration: "10h",
      departureTime: "8:00 PM",
      departureDate: "2026-05-09",
      operator: "Todo Turismo",
      bookingStatus: "not-booked",
      price: 18,
      currency: "USD",
      communityTip: "Bring layers - bus heating often broken",
      verifiedCount: 41,
    },
  ],
  insights: [
    {
      id: "insight-1",
      type: "tip",
      icon: "dollar",
      title: "Get Cash Before You Go",
      body: "ATM fees are higher in Belize and some rural areas have limited ATM access. Withdraw extra in Guatemala.",
      relatedStopId: "stop-3",
    },
    {
      id: "insight-2",
      type: "reminder",
      icon: "document",
      title: "Ecuador Entry Form Required",
      body: "Complete your Ecuador immigration form 72 hours before arrival to avoid delays.",
      action: "Complete Form",
      actionUrl: "https://example.com/ecuador-form",
      relatedStopId: "stop-9",
    },
    {
      id: "insight-3",
      type: "alert",
      icon: "health",
      title: "Altitude Warning: La Paz",
      body: "La Paz is at 3,640m. Take it easy on day 1, stay hydrated, and consider coca tea.",
      relatedStopId: "stop-15",
    },
    {
      id: "insight-4",
      type: "tip",
      icon: "dollar",
      title: "Nicaragua Budget Tip",
      body: "Nicaragua is the cheapest country in Central America. Stock up on souvenirs here!",
      relatedStopId: "stop-5",
    },
  ],
};

export function getStopById(trip: Trip, stopId: string): Stop | undefined {
  return trip.stops.find((s) => s.id === stopId);
}

export function getStopIndex(trip: Trip, stopId: string): number {
  return trip.stops.findIndex((s) => s.id === stopId) + 1;
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
    return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`;
  }
  return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getTripDuration(trip: Trip): number {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function getBookingStats(trip: Trip) {
  const booked = trip.stops.filter((s) => s.bookingStatus === "booked").length;
  const pending = trip.stops.filter((s) => s.bookingStatus === "pending").length;
  const notBooked = trip.stops.filter((s) => s.bookingStatus === "not-booked").length;
  return { booked, pending, notBooked, total: trip.stops.length };
}
