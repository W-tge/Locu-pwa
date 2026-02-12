import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Travel app schema: UserProfile, Trip, Stop, Pod, PodMember.
 * - User ↔ Pod many-to-many through PodMember (owner on PodMember = user).
 * - Trip has many Stops.
 * - Owner-based auth on all models; authenticated users can read Pods they belong to (via PodMember).
 */
const schema = a.schema({
  UserProfile: a
    .model({
      displayName: a.string(),
      avatarUrl: a.string(),
      bio: a.string(),
      locale: a.string(),
      /** Pod membership is via PodMember records where owner = current user (no FK here). */
    })
    .authorization((allow) => [allow.owner()]),

  Trip: a
    .model({
      title: a.string().required(),
      startDate: a.date(),
      endDate: a.date(),
      status: a.string(),
      stops: a.hasMany("Stop", { targetName: "tripId" }),
    })
    .authorization((allow) => [allow.owner()]),

  Stop: a
    .model({
      tripId: a.id().required(),
      trip: a.belongsTo("Trip", { targetName: "tripId" }),
      city: a.string().required(),
      country: a.string(),
      countryCode: a.string(),
      startDate: a.date(),
      endDate: a.date(),
      nights: a.integer(),
      latitude: a.float(),
      longitude: a.float(),
      status: a.string(),
      note: a.string(),
      /** Optional link to user profile for "my stops" views. */
      userProfileId: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Pod: a
    .model({
      name: a.string().required(),
      description: a.string(),
      /** Creator/owner of the pod. */
      members: a.hasMany("PodMember", { targetName: "podId" }),
    })
    .authorization((allow) => [
      allow.owner(),
      /** Authenticated users can read Pods they belong to (via PodMember). App should only load Pods through PodMember to enforce membership. */
      allow.authenticated().to(["read"]),
    ]),

  PodMember: a
    .model({
      podId: a.id().required(),
      pod: a.belongsTo("Pod", { targetName: "podId" }),
      /** Links to UserProfile; owner of this record is the auth user (same as UserProfile owner). */
      userProfileId: a.string(),
      role: a.string(), // e.g. "admin" | "member"
    })
    .authorization((allow) => [allow.owner()]),

  /** Waze-style traveller insights: alerts and recommendations (proprietary local knowledge dataset). */
  TravellerAlert: a
    .model({
      type: a.string().required(), // urgent | info | assist | safety | weather | immigration
      title: a.string().required(),
      description: a.string().required(),
      action: a.string(),
      actionUrl: a.string(),
      region: a.string(),
      countryCode: a.string(),
      placeId: a.string(),
      stopId: a.string(),
      tripId: a.string(),
      source: a.string(), // system | community
      reportCount: a.integer(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(["read"])]),

  TravellerRecommendation: a
    .model({
      kind: a.string().required(), // tip | recommendation | warning
      title: a.string().required(),
      body: a.string().required(),
      placeId: a.string(),
      stopId: a.string(),
      city: a.string(),
      countryCode: a.string(),
      category: a.string(),
      upvotes: a.integer(),
      verifiedCount: a.integer(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(["read"])]),

  CommunityQuest: a
    .model({
      question: a.string().required(),
      description: a.string().required(),
      points: a.integer().required(),
      region: a.string(),
      stopId: a.string(),
      tripId: a.string(),
      expiresAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner(), allow.authenticated().to(["read"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
