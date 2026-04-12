import type { DomainPack } from './types';
import { financePack } from './finance';

const packs: DomainPack[] = [financePack];

export function getPackForDomain(domain: string): DomainPack | undefined {
  return packs.find((p) => p.id === domain);
}

export function getAllPacks(): DomainPack[] {
  return packs;
}

export type { DomainPack } from './types';
