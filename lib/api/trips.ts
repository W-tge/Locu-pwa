/**
 * Trips API: list/create/update trips and stops.
 * Can be backed by Amplify Data or a REST service; protocol is the same.
 */
import { isApiConfigured } from "./config";
import { apiGet, apiPost, apiPatch, apiDelete, ApiClientError } from "./client";
import type { TripDto, StopDto } from "./types";
import { apiConfig } from "./config";

const { tripsPath } = apiConfig;

export async function listTrips(): Promise<TripDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const res = await apiGet<{ data: TripDto[] }>(tripsPath);
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function getTrip(id: string): Promise<TripDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiGet<TripDto>(`${tripsPath}/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiClientError && (e.status === 404 || e.status === 0)) return null;
    throw e;
  }
}

export async function createTrip(input: {
  title: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<TripDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<TripDto>(tripsPath, input);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export async function updateTrip(
  id: string,
  input: Partial<Pick<TripDto, "title" | "startDate" | "endDate" | "status">>
): Promise<TripDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPatch<TripDto>(`${tripsPath}/${encodeURIComponent(id)}`, input);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export async function listStops(tripId: string): Promise<StopDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const res = await apiGet<{ data: StopDto[] }>(`${tripsPath}/${encodeURIComponent(tripId)}/stops`);
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function createStop(
  tripId: string,
  input: Omit<StopDto, "id" | "tripId"> & { tripId?: string }
): Promise<StopDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<StopDto>(`${tripsPath}/${encodeURIComponent(tripId)}/stops`, {
      ...input,
      tripId,
    });
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export async function updateStop(
  tripId: string,
  stopId: string,
  input: Partial<StopDto>
): Promise<StopDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPatch<StopDto>(
      `${tripsPath}/${encodeURIComponent(tripId)}/stops/${encodeURIComponent(stopId)}`,
      input
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export async function deleteStop(tripId: string, stopId: string): Promise<boolean> {
  if (!isApiConfigured()) return false;
  try {
    await apiDelete(`${tripsPath}/${encodeURIComponent(tripId)}/stops/${encodeURIComponent(stopId)}`);
    return true;
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return false;
    throw e;
  }
}
