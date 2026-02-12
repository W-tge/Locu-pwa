/**
 * Shared API request/response types for the Locu OTA platform.
 * These define the contracts for hostels, transport, trips, bookings, and traveller insights.
 */

// ---- Hostels ----
export interface HostelSearchParams {
  city: string;
  countryCode?: string;
  checkIn: string; // ISO date
  checkOut: string;
  guests?: number;
  currency?: string;
}

export interface HostelOptionDto {
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
  currency?: string;
  description?: string;
  matchScore?: number;
  tripFit?: string;
  checkinNote?: string;
  podRooms?: string;
  wifiSpeed?: string;
  securityNote?: string;
  isRecommended?: boolean;
  recommendReason?: string;
}

export interface HostelBookingRequest {
  hostelId: string;
  stopId?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
  specialRequests?: string;
}

export interface HostelBookingDto {
  id: string;
  hostelId: string;
  hostelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
  totalPrice?: number;
  currency?: string;
}

// ---- Transport ----
export interface TransportSearchParams {
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  date: string; // ISO date
  passengers?: number;
}

export interface TransportOptionDto {
  id: string;
  operator: string;
  type: string;
  mode: "bus" | "train" | "ferry" | "shuttle" | "flight";
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  currency?: string;
  routeCode?: string;
  platform?: string;
  amenities: string[];
  seatsLeft?: number;
  verifiedCount?: number;
  isRecommended?: boolean;
  recommendReason?: string;
}

export interface TransportBookingRequest {
  optionId: string;
  legId?: string;
  date: string;
  passengers: number;
  fromStopId: string;
  toStopId: string;
}

export interface TransportBookingDto {
  id: string;
  optionId: string;
  operator: string;
  date: string;
  fromName: string;
  toName: string;
  status: "confirmed" | "pending" | "cancelled";
  totalPrice?: number;
  currency?: string;
}

// ---- Trips & Stops (align with Amplify / backend) ----
export interface TripDto {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  stops?: StopDto[];
}

export interface StopDto {
  id: string;
  tripId: string;
  city: string;
  country?: string;
  countryCode?: string;
  startDate?: string;
  endDate?: string;
  nights?: number;
  latitude?: number;
  longitude?: number;
  status?: string;
  note?: string;
  bookingStatus?: "booked" | "not-booked";
  hostelName?: string;
  hostelPrice?: number;
  hostelImage?: string;
}

// ---- Bookings (unified list) ----
export interface BookingDto {
  id: string;
  type: "hostel" | "transport" | "activity";
  name: string;
  location: string;
  date: string;
  price: number;
  currency?: string;
  status: "confirmed" | "pending" | "not-booked" | "cancelled";
  image?: string;
  referenceId?: string; // hostel or transport booking id
}

// ---- Traveller insights (Waze-style: alerts, recommendations, community) ----
export type TravellerAlertType = "urgent" | "info" | "assist" | "safety" | "weather" | "immigration";

export interface TravellerAlertDto {
  id: string;
  type: TravellerAlertType;
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
  region?: string;
  countryCode?: string;
  placeId?: string;
  stopId?: string;
  tripId?: string;
  createdAt: string;
  updatedAt?: string;
  source: "system" | "community";
  reportCount?: number;
}

export interface SubmitAlertRequest {
  type: TravellerAlertType;
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
  region?: string;
  countryCode?: string;
  placeId?: string;
  stopId?: string;
  tripId?: string;
}

export interface TravellerRecommendationDto {
  id: string;
  kind: "tip" | "recommendation" | "warning";
  title: string;
  body: string;
  placeId?: string;
  stopId?: string;
  city?: string;
  countryCode?: string;
  category?: string; // e.g. "transport", "hostel", "food", "safety"
  createdAt: string;
  authorId?: string;
  upvotes?: number;
  verifiedCount?: number;
}

export interface SubmitRecommendationRequest {
  kind: "tip" | "recommendation" | "warning";
  title: string;
  body: string;
  placeId?: string;
  stopId?: string;
  city?: string;
  countryCode?: string;
  category?: string;
}

export interface CommunityQuestDto {
  id: string;
  question: string;
  description: string;
  points: number;
  region?: string;
  stopId?: string;
  tripId?: string;
  expiresAt?: string;
}

export interface AnswerQuestRequest {
  questId: string;
  answerPayload?: Record<string, unknown>; // e.g. rating, text
}

export interface UserInsightStatsDto {
  karmaPoints: number;
  contributionsCount: number;
  alertsSubmitted: number;
  recommendationsSubmitted: number;
  questsAnswered: number;
}
