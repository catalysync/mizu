import type { Entity, Page, NavItem } from '../app-schema';

export interface WorkflowState {
  id: string;
  label: string;
  transitions: string[];
}

export interface WorkflowDef {
  entityId: string;
  states: WorkflowState[];
}

export interface DomainPack {
  id: string;
  name: string;
  pro?: boolean;
  entities: Entity[];
  workflows: WorkflowDef[];
  promptContext: string;
  defaultPages: Page[];
  defaultNav: NavItem[];
  referenceProducts: string[];
}
