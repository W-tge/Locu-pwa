# Locu OTA – API integration

This app is an **OTA for backpacking trips** (hostels, transport, planning). Where the demo used mock data, the UI is wired to **API protocols** so you can plug in real backends.

## Configuration

- **`NEXT_PUBLIC_API_BASE_URL`** (env): base URL of your API (e.g. `https://api.locu.com`). If unset, the app uses **demo/mock data** and no network calls are made for those features.

## API layer (`lib/api/`)

| Module | Purpose |
|--------|--------|
| **config** | `apiConfig`, `isApiConfigured()` |
| **client** | `apiGet`, `apiPost`, … plus `setAuthTokenProvider()` for Bearer auth |
| **types** | Request/response DTOs for all domains |
| **hostels** | `searchHostels`, `getHostel`, `createHostelBooking` |
| **transport** | `searchTransport`, `getTransportOption`, `createTransportBooking` |
| **trips** | `listTrips`, `getTrip`, `createTrip`, `updateTrip`, `listStops`, `createStop`, `updateStop`, `deleteStop` |
| **bookings** | `listBookings`, `getBooking` |
| **traveller-insights** | Alerts, recommendations, community quests (Waze-style) |
| **hooks** | `useHostelsForCity`, `useTransportOptions`, `useTravellerAlerts`, `useCommunityQuests`, `useBookings` |

All client functions return **empty or null** when `isApiConfigured()` is false, so the UI falls back to mock/demo data.

## Backend contracts (summary)

- **Hostels**  
  - `GET /api/hostels?city=&checkIn=&checkOut=&...` → `{ data: HostelOptionDto[] }`  
  - `GET /api/hostels/:id` → `HostelOptionDto`  
  - `POST /api/hostels/bookings` → `HostelBookingDto`

- **Transport**  
  - `GET /api/transport?originId=&originName=&destinationId=&destinationName=&date=&...` → `{ data: TransportOptionDto[] }`  
  - `GET /api/transport/options/:id` → `TransportOptionDto`  
  - `POST /api/transport/bookings` → `TransportBookingDto`

- **Trips**  
  - `GET /api/trips` → `{ data: TripDto[] }`  
  - `GET /api/trips/:id` → `TripDto`  
  - `POST /api/trips`, `PATCH /api/trips/:id`  
  - `GET /api/trips/:id/stops` → `{ data: StopDto[] }`  
  - `POST /api/trips/:id/stops`, `PATCH /api/trips/:id/stops/:stopId`, `DELETE /api/trips/:id/stops/:stopId`

- **Bookings**  
  - `GET /api/bookings?tripId=&status=` → `{ data: BookingDto[] }`

- **Traveller insights (Waze-style)**  
  - `GET /api/traveller-insights/alerts?tripId=&stopId=&region=&countryCode=&type=` → `{ data: TravellerAlertDto[] }`  
  - `POST /api/traveller-insights/alerts` → `TravellerAlertDto`  
  - `GET /api/traveller-insights/recommendations?stopId=&placeId=&city=&countryCode=&category=` → `{ data: TravellerRecommendationDto[] }`  
  - `POST /api/traveller-insights/recommendations` → `TravellerRecommendationDto`  
  - `GET /api/traveller-insights/quests?tripId=&stopId=&region=` → `{ data: CommunityQuestDto[] }`  
  - `POST /api/traveller-insights/quests/answer` → `{ pointsAwarded: number }`  
  - `GET /api/traveller-insights/me/stats` → `UserInsightStatsDto`

Exact shapes are in **`lib/api/types.ts`**.

## Auth

Call **`setAuthTokenProvider(() => getAmplifyAuthToken())`** (or your auth getter) so the API client sends `Authorization: Bearer <token>` on each request. If you use Amplify Auth, wire this once after login (e.g. in a root layout or provider).

## Traveller insights (proprietary dataset)

- **Alerts**: immigration, weather, safety, etc. (system or community).
- **Recommendations**: tips, warnings, local knowledge per place/stop.
- **Community quests**: answer questions to earn karma; answers feed the dataset.

Amplify schema includes **TravellerAlert**, **TravellerRecommendation**, and **CommunityQuest** so you can persist these in your backend or sync with Amplify Data.

## Where the UI uses the API

- **Trip context**: On load, if API is configured, fetches **alerts**, **community quests**, and **bookings** and merges them into context (demo data as fallback).
- **Stop detail sheet**: Hostel list for a stop comes from **`searchHostels(city, checkIn, checkOut)`** with mock fallback.
- **Hostel details page**: Same **hostels API** with mock fallback.
- **Transport booking page**: Options from **`searchTransport(origin, destination, date)`** with mock fallback.
- **Intel Hub**: **Community quest** “Answer & earn” calls **`answerQuest`** when API is configured; “Report alert or share a tip” is wired for future **submitAlert** / **submitRecommendation** forms.

To go live, implement the above endpoints (or proxy to third-party hostel/transport APIs) and set **`NEXT_PUBLIC_API_BASE_URL`**.
