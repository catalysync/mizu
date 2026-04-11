import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export class UnauthorizedError extends Error {
  name = 'UnauthorizedError' as const;
  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export async function getCurrentUserId(req?: NextRequest): Promise<string> {
  const session = await auth.api.getSession({
    headers: req?.headers ?? (await headers()),
  });

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session.user.id;
}

export async function getCurrentUser(req?: NextRequest) {
  const session = await auth.api.getSession({
    headers: req?.headers ?? (await headers()),
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  return session.user;
}

export async function tryGetCurrentUserId(req?: NextRequest): Promise<string | null> {
  try {
    return await getCurrentUserId(req);
  } catch {
    return null;
  }
}
