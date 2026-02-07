import { GoogleAuth } from "google-auth-library";

export async function fetchWithCloudRunAuth(
  url: string,
  options: RequestInit
): Promise<Response> {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    return fetch(url, options);
  }
  const credentials = JSON.parse(key);
  const auth = new GoogleAuth({ credentials });
  const client = await auth.getIdTokenClient(url);
  const authHeaders = await client.getRequestHeaders();
  const headers = new Headers(options.headers);
  const token = authHeaders instanceof Headers ? authHeaders.get("Authorization") : (authHeaders as Record<string, string>).Authorization;
  if (token) headers.set("Authorization", token);
  return fetch(url, { ...options, headers });
}
