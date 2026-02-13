/**
 * Maps API DTOs to in-memory Trip model.
 * Builds synthetic transit legs between consecutive stops when API does not provide legs.
 */
import type { TripDto, StopDto } from "./types";
import type { Trip, Stop, TransitLeg } from "@/lib/trip-data";
import { differenceInDays, parseISO } from "date-fns";

const STOP_STATUS_MAP: Record<string, Stop["status"]> = {
  ACTIVE: "ACTIVE",
  UPCOMING: "UPCOMING",
  PLANNED: "PLANNED",
  DRAFT: "DRAFT",
  FUTURE: "FUTURE",
  COMPLETED: "COMPLETED",
};

function mapStopDtoToStop(dto: StopDto): Stop {
  const start = dto.startDate ?? "";
  const end = dto.endDate ?? "";
  const nights =
    dto.nights ??
    (start && end ? Math.max(1, differenceInDays(parseISO(end), parseISO(start))) : 1);

  return {
    id: dto.id,
    city: dto.city,
    country: dto.country ?? "",
    countryCode: dto.countryCode ?? "",
    startDate: start,
    endDate: end,
    nights,
    latitude: dto.latitude ?? 0,
    longitude: dto.longitude ?? 0,
    bookingStatus: dto.bookingStatus ?? "not-booked",
    status: (dto.status && STOP_STATUS_MAP[dto.status]) ?? "PLANNED",
    hostelName: dto.hostelName,
    hostelPrice: dto.hostelPrice,
    hostelImage: dto.hostelImage,
    note: dto.note,
  };
}

function buildSyntheticLegs(stops: Stop[]): TransitLeg[] {
  const legs: TransitLeg[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    legs.push({
      id: `leg-${from.id}-${to.id}`,
      fromStopId: from.id,
      toStopId: to.id,
      type: "bus",
      mode: "Bus",
      route: `${from.city} → ${to.city}`,
      duration: "—",
      bookingStatus: "not-booked",
      departureDate: from.endDate,
    });
  }
  return legs;
}

export function mapTripDtoToTrip(dto: TripDto, stopDtos: StopDto[]): Trip {
  const stops = stopDtos.map(mapStopDtoToStop);
  const sortedStops = [...stops].sort(
    (a, b) => (a.startDate ? new Date(a.startDate).getTime() : 0) - (b.startDate ? new Date(b.startDate).getTime() : 0)
  );
  const first = sortedStops[0];
  const last = sortedStops[sortedStops.length - 1];

  return {
    id: dto.id,
    name: dto.title ?? "Untitled trip",
    description: dto.status ?? "",
    startDate: dto.startDate ?? first?.startDate ?? "",
    endDate: dto.endDate ?? last?.endDate ?? "",
    userStatus: "Solo",
    currentLocation: first?.city ?? "",
    currentDay: 1,
    stops: sortedStops,
    transitLegs: buildSyntheticLegs(sortedStops),
    insights: [],
  };
}
