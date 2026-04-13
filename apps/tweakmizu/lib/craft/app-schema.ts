import { z } from 'zod';

/**
 * App-schema — everything a design system needs beyond language: identity,
 * entities (domain shapes), pages, and the navigation graph. This grows the
 * profile from "a theme" to "a design system in a box" so the AI can generate
 * a whole Sage-scale product and the iframe preview has pages to render.
 *
 * Kept in a separate file from `profile.ts` so the language schema stays
 * readable. Composed back into the full profile in `profile.ts`.
 */

// -- Identity --------------------------------------------------------------

export const ProductDomain = z.enum([
  'finance',
  'healthcare',
  'commerce',
  'dev-tools',
  'editorial',
  'ai-product',
  'saas-admin',
  'hr',
  'other',
]);
export type ProductDomain = z.infer<typeof ProductDomain>;

export const Audience = z.enum([
  'b2b-enterprise',
  'b2b-smb',
  'b2c-consumer',
  'developer',
  'internal',
]);
export type Audience = z.infer<typeof Audience>;

export const IdentityCluster = z.object({
  productName: z.string().min(1).default('Untitled'),
  productTagline: z.string().default(''),
  ownerOrg: z.string().default(''),
  domain: ProductDomain.default('other'),
  audience: Audience.default('b2b-smb'),
  logo: z.string().default('✷'),
});
export type IdentityCluster = z.infer<typeof IdentityCluster>;

// -- Entities --------------------------------------------------------------

export const FieldType = z.enum([
  'string',
  'text',
  'number',
  'currency',
  'percent',
  'date',
  'badge',
  'boolean',
  'email',
]);
export type FieldType = z.infer<typeof FieldType>;

export const EntityField = z.object({
  id: z.string(),
  label: z.string(),
  type: FieldType,
  badgeValues: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  primary: z.boolean().default(false),
});
export type EntityField = z.infer<typeof EntityField>;

export const Entity = z.object({
  id: z.string(),
  name: z.string(),
  plural: z.string(),
  fields: z.array(EntityField),
});
export type Entity = z.infer<typeof Entity>;

// -- Pages -----------------------------------------------------------------

export const SectionKind = z.enum([
  'kpi-row',
  'table',
  'form',
  'detail-card',
  'empty-state',
  'text',
  'activity-list',
  'settings-form',
  'wizard',
  'approval-flow',
  'aging-breakdown',
  'journal-lines',
  'reconciliation-split',
  'chart-tree',
  'period-bar',
  'stat-row',
]);
export type SectionKind = z.infer<typeof SectionKind>;

export const Section = z.object({
  id: z.string(),
  kind: SectionKind,
  title: z.string().optional(),
  entityId: z.string().optional(),
  columnIds: z.array(z.string()).optional(),
  kpis: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        delta: z.string().optional(),
      }),
    )
    .optional(),
  body: z.string().optional(),
  // Generic data bag for domain-specific section content. Each section kind
  // reads what it needs: approval-flow reads `states[]` + `currentIndex`,
  // aging reads `buckets[]`, journal reads `lines[]`, reconciliation reads
  // `leftItems[]` + `rightItems[]`, chart-tree reads `rows[]`. The AI
  // populates this per-domain so the renderer stays domain-agnostic.
  data: z.record(z.string(), z.unknown()).optional(),
});
export type Section = z.infer<typeof Section>;

export const PageComposition = z.object({
  header: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      actions: z
        .array(
          z.object({
            label: z.string(),
            variant: z.enum(['primary', 'secondary', 'ghost', 'destructive']),
          }),
        )
        .default([]),
    })
    .optional(),
  sections: z.array(Section).default([]),
});
export type PageComposition = z.infer<typeof PageComposition>;

export const Page = z.object({
  id: z.string(),
  path: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  composition: PageComposition,
});
export type Page = z.infer<typeof Page>;

// -- Component catalog selection ------------------------------------------

export const ComponentSelection = z.object({
  id: z.string(),
  variants: z.array(z.string()).optional(),
  renamedProps: z.record(z.string(), z.string()).optional(),
});
export type ComponentSelection = z.infer<typeof ComponentSelection>;

// -- Custom component (schema-based first, JSX escape hatch) ---------------

export const PropSpec = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'enum']),
  enumValues: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});
export type PropSpec = z.infer<typeof PropSpec>;

export const CustomComponent = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  props: z.array(PropSpec).default([]),
  /** Schema-based composition from mizu primitives. AI-generated default. */
  composition: z
    .object({
      root: z.string(),
      children: z.array(z.any()).optional(),
    })
    .optional(),
  /** Pro escape hatch — raw JSX source. Sandboxed on render. */
  jsxSource: z.string().optional(),
});
export type CustomComponent = z.infer<typeof CustomComponent>;

// -- Nav graph -------------------------------------------------------------

export const NavItem = z.object({
  pageId: z.string(),
  section: z.string().default('primary'),
});
export type NavItem = z.infer<typeof NavItem>;

export const ShellConfig = z.object({
  type: z.enum(['sidebar', 'topbar', 'hybrid', 'none']).default('sidebar'),
  hasCommandMenu: z.boolean().default(true),
  hasBreadcrumbs: z.boolean().default(true),
  nav: z.array(NavItem).default([]),
});
export type ShellConfig = z.infer<typeof ShellConfig>;

// -- The full app schema ---------------------------------------------------

export const AppSchema = z.object({
  identity: IdentityCluster,
  entities: z.array(Entity).default([]),
  pages: z.array(Page).default([]),
  components: z.array(ComponentSelection).default([]),
  customComponents: z.array(CustomComponent).default([]),
  shell: ShellConfig,
});
export type AppSchema = z.infer<typeof AppSchema>;

// -- Default app (used by the mizu sample profile) ------------------------

export const defaultAppSchema: AppSchema = {
  identity: {
    productName: 'mizu sample',
    productTagline: 'A starter product',
    ownerOrg: '',
    domain: 'other',
    audience: 'b2b-smb',
    logo: '✷',
  },
  entities: [
    {
      id: 'customer',
      name: 'Customer',
      plural: 'Customers',
      fields: [
        { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
        { id: 'email', label: 'Email', type: 'email', required: true, primary: false },
        {
          id: 'status',
          label: 'Status',
          type: 'badge',
          badgeValues: ['active', 'dormant', 'lead'],
          required: false,
          primary: false,
        },
      ],
    },
  ],
  pages: [
    {
      id: 'login',
      path: '/login',
      title: 'Log in',
      icon: 'log-in',
      composition: {
        sections: [
          {
            id: 'login-form',
            kind: 'settings-form',
            title: 'Log in to your account',
          },
        ],
      },
    },
    {
      id: 'signup',
      path: '/signup',
      title: 'Sign up',
      icon: 'user-plus',
      composition: {
        sections: [
          {
            id: 'signup-form',
            kind: 'settings-form',
            title: 'Create your account',
          },
        ],
      },
    },
    {
      id: 'overview',
      path: '/',
      title: 'Overview',
      icon: 'layout',
      composition: {
        header: {
          title: 'Overview',
          description: 'Your product at a glance.',
          actions: [{ label: 'New item', variant: 'primary' }],
        },
        sections: [
          {
            id: 'kpis',
            kind: 'kpi-row',
            kpis: [
              { label: 'Revenue', value: '$24.8K', delta: '+12%' },
              { label: 'Customers', value: '142', delta: '+8%' },
              { label: 'Active', value: '98%', delta: '+1%' },
            ],
          },
          {
            id: 'activity',
            kind: 'activity-list',
            title: 'Recent activity',
          },
        ],
      },
    },
    {
      id: 'customers',
      path: '/customers',
      title: 'Customers',
      icon: 'users',
      composition: {
        header: {
          title: 'Customers',
          description: 'Everyone using your product.',
          actions: [{ label: 'Add customer', variant: 'primary' }],
        },
        sections: [
          {
            id: 'customers-table',
            kind: 'table',
            entityId: 'customer',
            columnIds: ['name', 'email', 'status'],
          },
        ],
      },
    },
    {
      id: 'settings',
      path: '/settings',
      title: 'Settings',
      icon: 'settings',
      composition: {
        header: {
          title: 'Settings',
          description: 'Manage your account and preferences.',
          actions: [],
        },
        sections: [{ id: 'settings-form', kind: 'settings-form' }],
      },
    },
  ],
  components: [
    { id: 'Button' },
    { id: 'Input' },
    { id: 'Table' },
    { id: 'Card' },
    { id: 'Badge' },
    { id: 'Stack' },
    { id: 'Inline' },
    { id: 'Heading' },
  ],
  customComponents: [],
  shell: {
    type: 'sidebar',
    hasCommandMenu: true,
    hasBreadcrumbs: true,
    nav: [
      { pageId: 'overview', section: 'primary' },
      { pageId: 'customers', section: 'primary' },
      { pageId: 'settings', section: 'secondary' },
      { pageId: 'login', section: 'auth' },
      { pageId: 'signup', section: 'auth' },
    ],
  },
};
