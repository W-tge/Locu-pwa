/**
 * Locu OTA API layer: protocols and clients for hostels, transport, trips,
 * bookings, and traveller insights (Waze-style alerts & recommendations).
 *
 * Set NEXT_PUBLIC_API_BASE_URL to point at your backend; omit for demo/mock fallback.
 */
export { apiConfig, isApiConfigured } from "./config";
export {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  setAuthTokenProvider,
  ApiClientError,
} from "./client";
export type { ApiError, GetAuthToken } from "./client";
export * from "./types";
export * from "./hostels";
export * from "./transport";
export * from "./trips";
export * from "./bookings";
export * from "./traveller-insights";
export * from "./hooks";
