import { NextRequest, NextResponse } from 'next/server';

/**
 * SilverBlaze Notification Webhook
 * Receives push notifications when new energy data is available.
 * 
 * SilverBlaze sends both GET (ping/subscription verification) and
 * POST (data ready notification) to this endpoint.
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  console.log('[GreenButton Notification] GET ping received:', params);

  // Some providers send a challenge for subscription verification
  if (params.hub_challenge) {
    return new NextResponse(params.hub_challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ received: true, method: 'GET', params });
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (contentType.includes('xml') || contentType.includes('atom')) {
      payload = await request.text();
    } else {
      payload = await request.text();
    }
  } catch {
    payload = null;
  }

  console.log('[GreenButton Notification] POST received:', {
    contentType,
    headers: Object.fromEntries(request.headers.entries()),
    payload,
  });

  // TODO: Trigger data fetch for the relevant subscription
  // For now just acknowledge receipt
  return NextResponse.json({ received: true, method: 'POST' }, { status: 200 });
}
