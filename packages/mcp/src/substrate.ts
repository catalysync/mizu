import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface Substrate {
  substrateVersion: number;
  project: {
    name: string;
    industry: string;
    stack: string;
    tone?: string;
    density?: string;
    generatedAt: string;
    tweakmizuVersion: string;
  };
  patterns: Array<{
    id: string;
    route: string;
    title: string;
  }>;
  primitives: {
    available: string[];
    importPath: string;
  };
  rules: string[];
}

export async function loadSubstrate(projectRoot: string): Promise<Substrate> {
  const path = resolve(projectRoot, '.tweakmizu', 'substrate.json');
  const raw = await readFile(path, 'utf-8');
  return JSON.parse(raw) as Substrate;
}

export const DEFAULT_PRIMITIVES = [
  'Stack',
  'Inline',
  'Cluster',
  'Grid',
  'Center',
  'Split',
  'Cover',
  'Sidebar',
];

export const DEFAULT_COMPONENTS = [
  'Button',
  'Badge',
  'Card',
  'Input',
  'Textarea',
  'Select',
  'Switch',
  'Checkbox',
  'Radio',
  'Slider',
  'Table',
  'Modal',
  'Drawer',
  'Popover',
  'Tooltip',
  'Tabs',
  'Accordion',
  'Alert',
  'Avatar',
  'Tag',
  'Breadcrumb',
  'Progress',
  'Skeleton',
  'Toast',
  'EmptyState',
  'CommandMenu',
  'FilterBar',
  'PropertyFilter',
  'ScrollArea',
];
