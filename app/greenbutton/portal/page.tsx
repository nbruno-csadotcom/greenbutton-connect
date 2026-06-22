import { redirect } from 'next/navigation';
import CsaHeader from '@/components/CsaHeader';

export const dynamic = 'force-dynamic';

export default function PortalPage() {
  async function handleConnect() {
    'use server';
    // Generate a random state value for CSRF protection
    const state = crypto.randomUUID();
    // Store state in a cookie / session for verification in callback
    // For now, we just pass it along and verify it exists
    const { buildAuthorizationUrl } = await import('@/lib/silverblaze');
    const url = buildAuthorizationUrl(state);
    redirect(url);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CsaHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-8 text-center">
          {/* Green icon */}
          <div
            className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full"
            style={{ backgroundColor: '#e8f5e9' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#3A7D44' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Ameren Account
          </h1>
          <p className="text-gray-500 mb-8">
            Authorize Community Solar Authority to securely access your energy usage data
            so we can optimize your community solar subscription.
          </p>

          <form action={handleConnect}>
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
              style={{ backgroundColor: '#3A7D44' }}
            >
              Connect Your Ameren Account
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            You&apos;ll be redirected to Ameren&apos;s secure login page to approve access.
            Community Solar Authority never sees your Ameren password.
          </p>
        </div>

        <div className="mt-8 max-w-lg w-full grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', label: 'Secure OAuth 2.0' },
            { icon: '⚡', label: 'Read-Only Access' },
            { icon: '🌱', label: 'Green Button Certified' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Community Solar Authority · Powered by Green Button Connect
      </footer>
    </div>
  );
}
