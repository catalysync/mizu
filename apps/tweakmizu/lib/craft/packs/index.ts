import { commercePack } from './commerce';
import { devToolsPack } from './dev-tools';
import { financePack } from './finance';
import { healthcarePack } from './healthcare';
import { hrPack } from './hr';
import type { DomainPack } from './types';

const packs: DomainPack[] = [financePack, healthcarePack, devToolsPack, commercePack, hrPack];

export function getPackForDomain(domain: string): DomainPack | undefined {
  return packs.find((p) => p.id === domain);
}

export function getAllPacks(): DomainPack[] {
  return packs;
}

export type { DomainPack } from './types';
