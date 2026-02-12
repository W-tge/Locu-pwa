/**
 * Transport API: search routes, get options, create booking.
 */
import { isApiConfigured } from "./config";
import { apiGet, apiPost, ApiClientError } from "./client";
import type {
  TransportSearchParams,
  TransportOptionDto,
  TransportBookingRequest,
  TransportBookingDto,
} from "./types";
import { apiConfig } from "./config";

const { transportPath } = apiConfig;

export async function searchTransport(
  params: TransportSearchParams
): Promise<TransportOptionDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams({
      originId: params.originId,
      originName: params.originName,
      destinationId: params.destinationId,
      destinationName: params.destinationName,
      date: params.date,
      ...(params.passengers != null && { passengers: String(params.passengers) }),
    });
    const res = await apiGet<{ data: TransportOptionDto[] }>(`${transportPath}?${q}`);
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function getTransportOption(id: string): Promise<TransportOptionDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiGet<TransportOptionDto>(`${transportPath}/options/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiClientError && (e.status === 404 || e.status === 0)) return null;
    throw e;
  }
}

export async function createTransportBooking(
  request: TransportBookingRequest
): Promise<TransportBookingDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<TransportBookingDto>(`${transportPath}/bookings`, request);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}
