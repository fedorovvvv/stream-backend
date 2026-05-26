import { createClient, type Client } from 'graphql-ws';
import { env } from '@/shared/config/env';

// Lazy singleton — only opens a WS when something subscribes.
let client: Client | null = null;

export function getWsClient(): Client {
  if (!client) {
    client = createClient({
      url: env.VITE_GRAPHQL_WS_URL,
      lazy: true,
      retryAttempts: 5,
      shouldRetry: () => true,
      // Subscriptions backend uses session cookies — graphql-ws will send them via the
      // browser WebSocket handshake automatically. No connectionParams needed.
    });
  }
  return client;
}

export function subscribe<TData, TVars extends Record<string, unknown> = Record<string, never>>(
  query: string,
  variables: TVars,
  onNext: (data: TData) => void,
  onError?: (err: unknown) => void,
): () => void {
  const c = getWsClient();
  const dispose = c.subscribe<TData>(
    { query, variables },
    {
      next: (msg) => {
        if (msg.data) onNext(msg.data);
      },
      error: (err) => onError?.(err),
      complete: () => {
        /* noop */
      },
    },
  );
  return dispose;
}
