import type { Industry, PageIntent } from '@/types/studio';

export interface IndustryMeta {
  id: Industry;
  label: string;
  description: string;
  defaultPages: PageIntent[];
  tier: 'free' | 'pro';
}

export const industries: IndustryMeta[] = [
  {
    id: 'cloud',
    label: 'Cloud / PaaS',
    description: 'Heroku, Railway, Render — apps list, app detail, deploys, env config.',
    defaultPages: [
      { slug: '/', label: 'Landing' },
      { slug: '/apps', label: 'Apps list' },
      { slug: '/apps/[id]', label: 'App detail' },
      { slug: '/settings', label: 'Settings' },
    ],
    tier: 'free',
  },
  {
    id: 'saas-admin',
    label: 'SaaS Admin',
    description: 'Linear, Vercel, Stripe dashboards — overview, members, settings, billing.',
    defaultPages: [
      { slug: '/', label: 'Landing' },
      { slug: '/dashboard', label: 'Dashboard' },
      { slug: '/team', label: 'Team members' },
      { slug: '/settings/billing', label: 'Billing' },
    ],
    tier: 'free',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    description: 'Shopify, Stripe checkout — product grid, cart drawer, checkout flow.',
    defaultPages: [
      { slug: '/', label: 'Storefront' },
      { slug: '/products', label: 'Products' },
      { slug: '/cart', label: 'Cart' },
      { slug: '/checkout', label: 'Checkout' },
    ],
    tier: 'free',
  },
  {
    id: 'fintech',
    label: 'Fintech',
    description: 'Accounts, transactions, reporting — dense tables and KPI cards.',
    defaultPages: [
      { slug: '/', label: 'Overview' },
      { slug: '/accounts', label: 'Accounts' },
      { slug: '/transactions', label: 'Transactions' },
      { slug: '/reports', label: 'Reports' },
    ],
    tier: 'pro',
  },
  {
    id: 'editorial',
    label: 'Editorial / Blog',
    description: 'Magazine-style layouts, long-form articles, author pages.',
    defaultPages: [
      { slug: '/', label: 'Home' },
      { slug: '/articles', label: 'Articles' },
      { slug: '/articles/[slug]', label: 'Article detail' },
      { slug: '/authors/[id]', label: 'Author page' },
    ],
    tier: 'pro',
  },
  {
    id: 'ai-product',
    label: 'AI Product',
    description: 'Chat UI, model selector, prompt library, conversation history.',
    defaultPages: [
      { slug: '/', label: 'Landing' },
      { slug: '/chat', label: 'Chat' },
      { slug: '/library', label: 'Prompt library' },
      { slug: '/history', label: 'History' },
    ],
    tier: 'pro',
  },
  {
    id: 'devtools',
    label: 'Developer Tools',
    description: 'API consoles, log viewers, deploy pipelines.',
    defaultPages: [
      { slug: '/', label: 'Landing' },
      { slug: '/console', label: 'Console' },
      { slug: '/logs', label: 'Logs' },
      { slug: '/settings', label: 'Settings' },
    ],
    tier: 'pro',
  },
];

export function getIndustry(id: Industry): IndustryMeta | undefined {
  return industries.find((i) => i.id === id);
}

export function getFreeIndustries(): IndustryMeta[] {
  return industries.filter((i) => i.tier === 'free');
}
