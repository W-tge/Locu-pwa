/**
 * Traveller insights API (Waze-style): alerts, recommendations, community quests.
 * Powers the proprietary dataset of local knowledge: alerts and recommendations in the app.
 */
import { isApiConfigured } from "./config";
import { apiGet, apiPost, ApiClientError } from "./client";
import type {
  TravellerAlertDto,
  SubmitAlertRequest,
  TravellerRecommendationDto,
  SubmitRecommendationRequest,
  CommunityQuestDto,
  AnswerQuestRequest,
  UserInsightStatsDto,
} from "./types";
import { apiConfig } from "./config";

const { travellerInsightsPath } = apiConfig;

export interface ListAlertsParams {
  tripId?: string;
  stopId?: string;
  region?: string;
  countryCode?: string;
  types?: string[];
}

export async function listAlerts(params: ListAlertsParams = {}): Promise<TravellerAlertDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params.tripId) q.set("tripId", params.tripId);
    if (params.stopId) q.set("stopId", params.stopId);
    if (params.region) q.set("region", params.region);
    if (params.countryCode) q.set("countryCode", params.countryCode);
    if (params.types?.length) params.types.forEach((t) => q.append("type", t));
    const query = q.toString();
    const res = await apiGet<{ data: TravellerAlertDto[] }>(
      `${travellerInsightsPath}/alerts${query ? `?${query}` : ""}`
    );
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function submitAlert(request: SubmitAlertRequest): Promise<TravellerAlertDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<TravellerAlertDto>(`${travellerInsightsPath}/alerts`, request);
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export interface ListRecommendationsParams {
  stopId?: string;
  placeId?: string;
  city?: string;
  countryCode?: string;
  category?: string;
}

export async function listRecommendations(
  params: ListRecommendationsParams = {}
): Promise<TravellerRecommendationDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params.stopId) q.set("stopId", params.stopId);
    if (params.placeId) q.set("placeId", params.placeId);
    if (params.city) q.set("city", params.city);
    if (params.countryCode) q.set("countryCode", params.countryCode);
    if (params.category) q.set("category", params.category);
    const query = q.toString();
    const res = await apiGet<{ data: TravellerRecommendationDto[] }>(
      `${travellerInsightsPath}/recommendations${query ? `?${query}` : ""}`
    );
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function submitRecommendation(
  request: SubmitRecommendationRequest
): Promise<TravellerRecommendationDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<TravellerRecommendationDto>(
      `${travellerInsightsPath}/recommendations`,
      request
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export interface ListCommunityQuestsParams {
  tripId?: string;
  stopId?: string;
  region?: string;
}

export async function listCommunityQuests(
  params: ListCommunityQuestsParams = {}
): Promise<CommunityQuestDto[]> {
  if (!isApiConfigured()) return [];
  try {
    const q = new URLSearchParams();
    if (params.tripId) q.set("tripId", params.tripId);
    if (params.stopId) q.set("stopId", params.stopId);
    if (params.region) q.set("region", params.region);
    const query = q.toString();
    const res = await apiGet<{ data: CommunityQuestDto[] }>(
      `${travellerInsightsPath}/quests${query ? `?${query}` : ""}`
    );
    return res?.data ?? [];
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return [];
    throw e;
  }
}

export async function answerQuest(request: AnswerQuestRequest): Promise<{ pointsAwarded: number } | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiPost<{ pointsAwarded: number }>(
      `${travellerInsightsPath}/quests/answer`,
      request
    );
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 0) return null;
    throw e;
  }
}

export async function getUserInsightStats(): Promise<UserInsightStatsDto | null> {
  if (!isApiConfigured()) return null;
  try {
    return await apiGet<UserInsightStatsDto>(`${travellerInsightsPath}/me/stats`);
  } catch (e) {
    if (e instanceof ApiClientError && (e.status === 404 || e.status === 0)) return null;
    throw e;
  }
}
