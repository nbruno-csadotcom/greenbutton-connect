import { redirect } from 'next/navigation';
import CsaHeader from '@/components/CsaHeader';

export const dynamic = 'force-dynamic';

const DATA_ITEMS = [
  {
    icon: '⚡',
    title: 'Energy Usage (15-min intervals)',
    description: 'Hourly and daily electricity consumption data from your smart meter.',
  },
  {
    icon: '📊',
    title: 'Usage History (up to 2 years)',
    description: 'Historical consumption data to analyze your energy patterns.',
  },
  {
    icon: '💡',
    title: 'Billing Data',
    description: 'Billing periods and associated usage for accurate solar credit calculation.',
  },
  {
    icon: '📅',
    title: 'Subscription Notifications',
    description: 'Daily updates when new interval data becomes available.',
  },
];

export default function ScopeSelectionPage() {
  async function handleAuthorize() {
    'use server';
    const state = crypto.randomUUID();
    const { buildAuthorizationUrl } = await import('@/lib/silverblaze');
    const url = buildAuthorizationUrl(state);
    redirect(url);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CsaHeader />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-10">
        <div className="max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Data Access Request
          </h1>
          <p className="text-gray-500 mb-6">
            Community Solar Authority is requesting access to the following data from your
            Ameren account:
          </p>

          <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100 mb-6">
            {DATA_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-5">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-4 mb-6 text-sm"
            style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
          >
            <strong>Your data is safe.</strong> Access is read-only and can be revoked at any
            time from your Ameren account settings. We never modify your account or billing.
          </div>

          <form action={handleAuthorize} className="space-y-3">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-semibold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#3A7D44' }}
            >
              Authorize Access
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            You&apos;ll be securely redirected to Ameren to confirm authorization.
          </p>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Community Solar Authority
      </footer>
    </div>
  );
}
