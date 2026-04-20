import { db } from '@/db';
import * as schema from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

function buildAuth() {
  const hasGoogle = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  const hasGithub = !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;

  const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    baseURL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      baseURL!,
      'http://localhost:3001',
      ...(process.env.CODESPACE_NAME
        ? [`https://${process.env.CODESPACE_NAME}-3001.app.github.dev`]
        : []),
    ].filter(Boolean) as string[],
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 6,
    },
    socialProviders: {
      ...(hasGoogle && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }),
      ...(hasGithub && {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      }),
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
