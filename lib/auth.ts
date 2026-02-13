/**
 * Auth token provider for the API client.
 * When Amplify (or another auth provider) is configured, implement getAuthToken
 * to return the current session's JWT. Until then, returns null so requests
 * run unauthenticated (e.g. for preview/demo or public endpoints).
 */
export async function getAuthToken(): Promise<string | null> {
  // Wire Amplify Auth when ready, e.g.:
  // const session = await getCurrentSession();
  // return session?.tokens?.idToken?.toString() ?? null;
  return null;
}
