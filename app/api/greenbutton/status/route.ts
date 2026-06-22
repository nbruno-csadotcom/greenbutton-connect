import { NextResponse } from 'next/server';
import { fetchServiceStatus } from '@/lib/silverblaze';

export const dynamic = 'force-dynamic';

/**
 * GET /api/greenbutton/status
 * Health check — pings SilverBlaze ReadServiceStatus endpoint.
 */
export async function GET() {
  const started = Date.now();

  const result = await fetchServiceStatus();

  return NextResponse.json(
    {
      service: 'greenbutton-connect',
      silverblaze: {
        connected: result.ok,
        status: result.status ?? null,
        body: result.body ?? null,
        error: result.error ?? null,
      },
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    },
    { status: result.ok ? 200 : 502 }
  );
}
