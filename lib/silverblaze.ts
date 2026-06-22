/**
 * SilverBlaze / Ameren API helpers
 * 
 * IMPORTANT: All requests to *.silverblazext.com MUST include a browser
 * User-Agent or Cloudflare will block them with a 403.
 */

export const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export function getBaseHeaders(extra: Record<string, string> = {}): HeadersInit {
  return {
    'User-Agent': BROWSER_UA,
    Accept: 'application/json',
    ...extra,
  };
}

export function buildAuthorizationUrl(state: string): string {
  const base = process.env.SILVERBLAZE_AUTH_URL!;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SILVERBLAZE_CLIENT_ID!,
    redirect_uri: process.env.CALLBACK_URL!,
    scope: process.env.SILVERBLAZE_SCOPE!,
    state,
  });
  return `${base}?${params.toString()}`;
}

export function buildBasicAuthHeader(): string {
  const credentials = Buffer.from(
    `${process.env.SILVERBLAZE_CLIENT_ID}:${process.env.SILVERBLAZE_CLIENT_SECRET}`
  ).toString('base64');
  return `Basic ${credentials}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.CALLBACK_URL!,
  });

  const res = await fetch(process.env.SILVERBLAZE_TOKEN_URL!, {
    method: 'POST',
    headers: {
      ...getBaseHeaders({
        Authorization: buildBasicAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${res.statusText} — ${text}`);
  }

  return res.json();
}

export async function fetchServiceStatus(): Promise<{ ok: boolean; status?: number; body?: unknown; error?: string }> {
  try {
    const url = `${process.env.SILVERBLAZE_API_BASE}/ReadServiceStatus`;
    const res = await fetch(url, {
      headers: getBaseHeaders({
        Authorization: `Bearer ${process.env.SILVERBLAZE_REGISTRATION_TOKEN}`,
      }),
      next: { revalidate: 0 },
    });
    let body: unknown;
    try { body = await res.json(); } catch { body = await res.text(); }
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function fetchUsageData(
  subscriptionId: string,
  accessToken: string
): Promise<{ ok: boolean; status?: number; body?: unknown; error?: string }> {
  try {
    const url = `${process.env.SILVERBLAZE_API_BASE}/Subscription/${subscriptionId}/UsagePoint`;
    const res = await fetch(url, {
      headers: getBaseHeaders({
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/atom+xml',
      }),
      next: { revalidate: 0 },
    });
    let body: unknown;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('json')) {
      try { body = await res.json(); } catch { body = await res.text(); }
    } else {
      body = await res.text();
    }
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
