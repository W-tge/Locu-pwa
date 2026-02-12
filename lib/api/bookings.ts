/**
 * Bookings API: unified list of hostel, transport, and activity bookings.
 */
import { isApiConfigured } from "./config";
import { apiGet, ApiClientError } from "./client";
import type { BookingDto } from "./types";
import { apiConfig } from "./config";

const { bookingsPath } = apiConfig;

export interface ListBookingsParams {
  tripId?: string;
  status?: string;
}

export async function listBookings(params: ListBookingsParams = {}): Promise<BookingDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params.tripId) q.set("tripId", params.tripId);
    if (params.status) q.set("status", params.status);
    const query = q.toString();
    const res = await apiGet<{ data: BookingDto[] }>(
      `${bookingsPath}${query ? `?${query}` : ""}`
    );
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function getBooking(id: string): Promise<BookingDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiGet<BookingDto>(`${bookingsPath}/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiClientError && (e.status === 404 || e.status === 0)) return null;
    throw e;
  }
}
