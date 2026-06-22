import { exchangeCodeForToken } from '@/lib/silverblaze';
import { saveToken } from '@/lib/tokenStore';
import CsaHeader from '@/components/CsaHeader';

export const dynamic = 'force-dynamic';

interface CallbackSearchParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<CallbackSearchParams>;
}) {
  const params = await searchParams;

  // Handle OAuth errors from Ameren
  if (params.error) {
    return <ErrorPage error={params.error} description={params.error_description} />;
  }

  if (!params.code) {
    return <ErrorPage error="missing_code" description="No authorization code received from Ameren." />;
  }

  try {
    const tokenData = await exchangeCodeForToken(params.code);

    // Store the token — key by state (or generate a UUID if no state)
    const key = params.state ?? crypto.randomUUID();
    saveToken(key, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
      storedAt: Date.now(),
    });

    return <SuccessPage />;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GreenButton Callback] Token exchange error:', message);
    return <ErrorPage error="token_exchange_failed" description={message} />;
  }
}

function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <CsaHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-10 text-center">
          {/* Big green checkmark */}
          <div
            className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full"
            style={{ backgroundColor: '#e8f5e9' }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: '#3A7D44' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            ✅ Authorization Successful!
          </h1>
          <p className="text-gray-600 text-base mb-6">
            Community Solar Authority has been authorized to access your energy data.
          </p>

          <div
            className="rounded-xl p-4 text-sm text-left space-y-2"
            style={{ backgroundColor: '#f0faf0', color: '#2e7d32' }}
          >
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Energy usage data access enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Historical data will be retrieved shortly</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>Daily usage updates scheduled</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            You can revoke this access at any time through your Ameren account settings
            under &quot;Third-Party Access.&quot;
          </p>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Community Solar Authority
      </footer>
    </div>
  );
}

function ErrorPage({ error, description }: { error: string; description?: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CsaHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-10 text-center">
          <div
            className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full"
            style={{ backgroundColor: '#fef2f2' }}
          >
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Authorization Failed</h1>
          <p className="text-gray-500 mb-4">
            We weren&apos;t able to complete the authorization.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm font-mono text-gray-700 mb-6">
            <div><strong>Error:</strong> {error}</div>
            {description && <div className="mt-1"><strong>Details:</strong> {description}</div>}
          </div>

          <a
            href="/greenbutton/portal"
            className="inline-block py-3 px-8 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#3A7D44' }}
          >
            Try Again
          </a>
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Community Solar Authority
      </footer>
    </div>
  );
}
