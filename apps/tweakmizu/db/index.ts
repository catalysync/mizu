import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

let _db: NeonHttpDatabase | null = null;

export const db = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop) {
    if (!_db) {
      if (!process.env.DATABASE_URL) {
        throw new Error(
          'DATABASE_URL is not set. Auth, billing, and project persistence are disabled until it is configured.',
        );
      }
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle({ client: sql });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_db as any)[prop];
  },
});
