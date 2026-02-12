/**
 * API configuration for the Locu OTA platform.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local for production; omit for demo/mock fallback.
 */
const baseUrl = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "")
  : (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

export const apiConfig = {
  baseUrl: baseUrl.replace(/\/$/, ""),
  hostelsPath: "/api/hostels",
  transportPath: "/api/transport",
  tripsPath: "/api/trips",
  bookingsPath: "/api/bookings",
  travellerInsightsPath: "/api/traveller-insights",
} as const;

export function isApiConfigured(): boolean {
  return Boolean(apiConfig.baseUrl);
}
