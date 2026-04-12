import type { DomainPack } from './types';
import { financePack } from './finance';
import { healthcarePack } from './healthcare';
import { devToolsPack } from './dev-tools';
import { commercePack } from './commerce';
import { hrPack } from './hr';

const packs: DomainPack[] = [financePack, healthcarePack, devToolsPack, commercePack, hrPack];

export function getPackForDomain(domain: string): DomainPack | undefined {
  return packs.find((p) => p.id === domain);
}

export function getAllPacks(): DomainPack[] {
  return packs;
}

export type { DomainPack } from './types';
