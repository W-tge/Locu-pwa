/**
 * Hostels API: search, get by id, create booking.
 * Uses api client when configured; otherwise returns empty and callers can fall back to mock.
 */
import { apiConfig, isApiConfigured } from "./config";
import { apiGet, apiPost, ApiClientError } from "./client";
import type {
  HostelSearchParams,
  HostelOptionDto,
  HostelBookingRequest,
  HostelBookingDto,
} from "./types";

const { baseUrl, hostelsPath } = apiConfig;

export async function searchHostels(params: HostelSearchParams): Promise<HostelOptionDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams({
      city: params.city,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      ...(params.countryCode && { countryCode: params.countryCode }),
      ...(params.guests != null && { guests: String(params.guests) }),
      ...(params.currency && { currency: params.currency }),
    });
    const res = await apiGet<{ data: HostelOptionDto[] }>(`${hostelsPath}?${q}`);
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function getHostel(id: string): Promise<HostelOptionDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiGet<HostelOptionDto>(`${hostelsPath}/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiClientError && (e.status === 404 || e.status === 0)) return null;
    throw e;
  }
}

export async function createHostelBooking(
  request: HostelBookingRequest
): Promise<HostelBookingDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<HostelBookingDto>(`${hostelsPath}/bookings`, request);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}
