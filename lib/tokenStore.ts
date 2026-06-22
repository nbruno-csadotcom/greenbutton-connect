/**
 * Token Store — in-memory for now, logs to console.
 * Long-term: replace with Vercel KV or Postgres.
 */

export interface TokenRecord {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
  customerId?: string;
  storedAt: number; // Unix ms
}

// In-memory store (resets on cold start — fine for MVP)
const store = new Map<string, TokenRecord>();

export function saveToken(key: string, record: TokenRecord): void {
  store.set(key, record);
  console.log('[TokenStore] Saved token for key:', key, {
    tokenType: record.tokenType,
    expiresIn: record.expiresIn,
    scope: record.scope,
    storedAt: new Date(record.storedAt).toISOString(),
    // Log full token in dev only
    ...(process.env.NODE_ENV !== 'production' && {
      accessToken: record.accessToken,
      refreshToken: record.refreshToken,
    }),
  });
}

export function getToken(key: string): TokenRecord | undefined {
  return store.get(key);
}

export function getAllTokens(): Map<string, TokenRecord> {
  return store;
}
