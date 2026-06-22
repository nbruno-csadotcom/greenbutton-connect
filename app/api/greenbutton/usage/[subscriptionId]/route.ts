import { NextRequest, NextResponse } from 'next/server';
import { fetchUsageData } from '@/lib/silverblaze';
import { getToken, getAllTokens } from '@/lib/tokenStore';

export const dynamic = 'force-dynamic';

/**
 * GET /api/greenbutton/usage/[subscriptionId]
 * Returns usage data for a subscription.
 * 
 * Query params:
 *   tokenKey — the key used when storing the token (default: uses first available)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  const { subscriptionId } = await params;
  const { searchParams } = new URL(request.url);
  const tokenKey = searchParams.get('tokenKey');

  // Look up the access token
  let accessToken: string | undefined;

  if (tokenKey) {
    const record = getToken(tokenKey);
    accessToken = record?.accessToken;
  } else {
    // Fall back to first token in the store
    const all = getAllTokens();
    const first = all.values().next().value;
    accessToken = first?.accessToken;
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: 'no_token', message: 'No access token found. Complete OAuth flow first.' },
      { status: 401 }
    );
  }

  const result = await fetchUsageData(subscriptionId, accessToken);

  return NextResponse.json(
    {
      subscriptionId,
      connected: result.ok,
      status: result.status ?? null,
      data: result.body ?? null,
      error: result.error ?? null,
      timestamp: new Date().toISOString(),
    },
    { status: result.ok ? 200 : 502 }
  );
}
