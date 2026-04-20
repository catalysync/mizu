'use server';

import { db } from '@/db';
import { craftProfile, craftProfileLike } from '@/db/schema';
import type { DesignLanguageProfile } from '@/lib/craft/profile';
import { getCurrentUserId } from '@/lib/shared';
import { and, desc, eq, sql } from 'drizzle-orm';
import crypto from 'node:crypto';

export async function saveProfile(profile: DesignLanguageProfile) {
  try {
    const userId = await getCurrentUserId();
    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(craftProfile).values({
      id,
      userId,
      name: profile.name,
      archetype: profile.archetype ?? null,
      domain: profile.app?.identity?.domain ?? null,
      profileJson: profile as unknown as Record<string, unknown>,
      createdAt: now,
      updatedAt: now,
    });

    return { id };
  } catch {
    return { id: null, error: 'Failed to save profile' };
  }
}

export async function updateProfile(id: string, profile: DesignLanguageProfile) {
  const userId = await getCurrentUserId();

  await db
    .update(craftProfile)
    .set({
      name: profile.name,
      archetype: profile.archetype ?? null,
      domain: profile.app?.identity?.domain ?? null,
      profileJson: profile as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(and(eq(craftProfile.id, id), eq(craftProfile.userId, userId)));

  return { ok: true };
}

export async function getUserProfiles() {
  const userId = await getCurrentUserId();
  return db
    .select({
      id: craftProfile.id,
      name: craftProfile.name,
      archetype: craftProfile.archetype,
      domain: craftProfile.domain,
      isPublic: craftProfile.isPublic,
      likes: craftProfile.likes,
      createdAt: craftProfile.createdAt,
      updatedAt: craftProfile.updatedAt,
    })
    .from(craftProfile)
    .where(eq(craftProfile.userId, userId))
    .orderBy(desc(craftProfile.updatedAt));
}

export async function shareProfile(id: string) {
  try {
    const userId = await getCurrentUserId();
    const token = crypto.randomUUID().slice(0, 12);

    await db
      .update(craftProfile)
      .set({ shareToken: token, isPublic: true, updatedAt: new Date() })
      .where(and(eq(craftProfile.id, id), eq(craftProfile.userId, userId)));

    return { token };
  } catch {
    return { token: null, error: 'Failed to share' };
  }
}

export async function publishProfile(id: string, tags: string[]) {
  const userId = await getCurrentUserId();
  const maxTags = tags.slice(0, 5);

  await db
    .update(craftProfile)
    .set({ isPublic: true, tags: maxTags, updatedAt: new Date() })
    .where(and(eq(craftProfile.id, id), eq(craftProfile.userId, userId)));

  return { ok: true };
}

export async function getPublicProfiles(limit = 20, offset = 0) {
  return db
    .select({
      id: craftProfile.id,
      name: craftProfile.name,
      archetype: craftProfile.archetype,
      domain: craftProfile.domain,
      likes: craftProfile.likes,
      tags: craftProfile.tags,
      profileJson: craftProfile.profileJson,
      createdAt: craftProfile.createdAt,
    })
    .from(craftProfile)
    .where(eq(craftProfile.isPublic, true))
    .orderBy(desc(craftProfile.likes))
    .limit(limit)
    .offset(offset);
}

export async function getProfileByShareToken(token: string) {
  const rows = await db
    .select()
    .from(craftProfile)
    .where(eq(craftProfile.shareToken, token))
    .limit(1);
  return rows[0] ?? null;
}

export async function likeProfile(profileId: string) {
  try {
    const userId = await getCurrentUserId();
    const id = crypto.randomUUID();

    const existing = await db
      .select()
      .from(craftProfileLike)
      .where(and(eq(craftProfileLike.profileId, profileId), eq(craftProfileLike.userId, userId)))
      .limit(1);

    if (existing.length > 0) return { ok: false, reason: 'already liked' };

    await db.insert(craftProfileLike).values({
      id,
      profileId,
      userId,
      createdAt: new Date(),
    });

    await db
      .update(craftProfile)
      .set({ likes: sql`${craftProfile.likes} + 1` })
      .where(eq(craftProfile.id, profileId));

    return { ok: true };
  } catch {
    return { ok: false, reason: 'Failed to like' };
  }
}

export async function deleteProfile(id: string) {
  const userId = await getCurrentUserId();
  await db
    .delete(craftProfile)
    .where(and(eq(craftProfile.id, id), eq(craftProfile.userId, userId)));
  return { ok: true };
}
