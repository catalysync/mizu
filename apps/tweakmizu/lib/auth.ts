import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';

function buildAuth() {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      },
    },
  });
}

type BetterAuth = ReturnType<typeof buildAuth>;

let _auth: BetterAuth | null = null;

export const auth = new Proxy({} as BetterAuth, {
  get(_target, prop) {
    if (!_auth) {
      _auth = buildAuth();
    }
    return (_auth as unknown as Record<string | symbol, unknown>)[prop];
  },
});
