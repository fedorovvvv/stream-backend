import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GRAPHQL_URL: z.string().min(1),
  VITE_GRAPHQL_WS_URL: z.string().min(1),
  VITE_APP_NAME: z.string().min(1),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  // Surfacing once at boot beats silent fallback for half the env.
  console.error('[env] invalid environment variables', parsed.error.flatten());
  throw new Error('Invalid environment variables — check web/.env against .env.example');
}

export const env = parsed.data;
