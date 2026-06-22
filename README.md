# Green Button Connect

OAuth integration for Community Solar Authority to access Ameren customer energy data via SilverBlaze's Green Button Connect API.

## Routes

| Route | Description |
|-------|-------------|
| `GET /greenbutton/portal` | Landing page — "Connect Your Ameren Account" |
| `GET /greenbutton/scope-selection` | Shows what data CSA will access |
| `GET /greenbutton/oauth/callback` | OAuth callback — exchanges code for token |
| `GET /greenbutton/notification` | Webhook ping/challenge handler |
| `POST /greenbutton/notification` | Webhook — SilverBlaze data-ready notifications |
| `GET /api/greenbutton/status` | Health check — tests SilverBlaze connection |
| `GET /api/greenbutton/usage/[subscriptionId]` | Fetch usage data for a subscription |

## Local Development

```bash
cp .env.example .env.local
# Fill in your credentials in .env.local
npm install
npm run dev
```

## Environment Variables

See `.env.example` for required variables. Set these in Vercel dashboard — **never commit them**.

## Deployment

```bash
vercel deploy
```

Set all env vars from `.env.example` in the Vercel project settings.

## Token Storage

Currently uses an **in-memory store** (resets on cold start). Tokens are logged to the console on each OAuth callback. For production, replace `lib/tokenStore.ts` with Vercel KV or Postgres.

## Cloudflare Note

All requests to `*.silverblazext.com` include a browser `User-Agent` header to bypass Cloudflare protection. See `lib/silverblaze.ts`.
