"use client";

/**
 * React hooks for API-backed data with demo/mock fallback.
 * Use these in trip-context or components to load from API when configured.
 */
import { useState, useEffect, useCallback } from "react";
import * as hostelsApi from "./hostels";
import * as transportApi from "./transport";
import * as tripsApi from "./trips";
import * as bookingsApi from "./bookings";
import * as insightsApi from "./traveller-insights";
import type {
  HostelOptionDto,
  TransportOptionDto,
  TravellerAlertDto,
  CommunityQuestDto,
  BookingDto,
} from "./types";

// ---- Hostels ----
export function useHostelsForCity(
  city: string,
  checkIn: string,
  checkOut: string,
  fallback: HostelOptionDto[] = []
) {
  const [data, setData] = useState<HostelOptionDto[]>(fallback);
  const [loading, setLoading] = useState(!!city);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!city) {
      setData(fallback);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    hostelsApi
      .searchHostels({ city, checkIn, checkOut })
      .then((list) => {
        if (!cancelled) setData(list.length ? list : fallback);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e);
          setData(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city, checkIn, checkOut, JSON.stringify(fallback)]);

  return { hostels: data, loading, error };
}

// ---- Transport ----
export function useTransportOptions(
  originId: string,
  originName: string,
  destinationId: string,
  destinationName: string,
  date: string,
  fallback: TransportOptionDto[] = []
) {
  const [data, setData] = useState<TransportOptionDto[]>(fallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(() => {
    if (!originId || !destinationId || !date) {
      setData(fallback);
      return;
    }
    setLoading(true);
    setError(null);
    transportApi
      .searchTransport({
        originId,
        originName,
        destinationId,
        destinationName,
        date,
      })
      .then((list) => setData(list.length ? list : fallback))
      .catch((e) => {
        setError(e);
        setData(fallback);
      })
      .finally(() => setLoading(false));
  }, [originId, originName, destinationId, destinationName, date, JSON.stringify(fallback)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { options: data, loading, error, refetch: fetch };
}

// ---- Traveller insights (alerts) ----
export function useTravellerAlerts(
  params: { tripId?: string; stopId?: string; region?: string } = {},
  fallback: TravellerAlertDto[] = []
) {
  const [data, setData] = useState<TravellerAlertDto[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    insightsApi
      .listAlerts(params)
      .then((list) => {
        if (!cancelled) setData(list.length ? list : fallback);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e);
          setData(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.tripId, params.stopId, params.region, JSON.stringify(fallback)]);

  return { alerts: data, loading, error };
}

// ---- Community quests ----
export function useCommunityQuests(
  params: { tripId?: string; stopId?: string; region?: string } = {},
  fallback: CommunityQuestDto[] = []
) {
  const [data, setData] = useState<CommunityQuestDto[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    insightsApi
      .listCommunityQuests(params)
      .then((list) => {
        if (!cancelled) setData(list.length ? list : fallback);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e);
          setData(fallback);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.tripId, params.stopId, params.region, JSON.stringify(fallback)]);

  return { quests: data, loading, error };
}

// ---- Bookings ----
export function useBookings(
  params: { tripId?: string; status?: string } = {},
  fallback: BookingDto[] = []
) {
  const [data, setData] = useState<BookingDto[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    bookingsApi
      .listBookings(params)
      .then((list) => setData(list.length ? list : fallback))
      .catch((e) => {
        setError(e);
        setData(fallback);
      })
      .finally(() => setLoading(false));
  }, [params.tripId, params.status, JSON.stringify(fallback)]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bookings: data, loading, error, refetch };
}
