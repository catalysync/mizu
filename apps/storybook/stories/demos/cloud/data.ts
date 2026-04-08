export type AppStatus = 'running' | 'building' | 'crashed' | 'idle';

export interface AppRecord {
  id: string;
  name: string;
  framework: string;
  region: string;
  status: AppStatus;
  url: string;
  lastDeploy: string;
  addons: string[];
}

export const mockApps: AppRecord[] = [
  {
    id: 'frosty-mountain-1234',
    name: 'frosty-mountain-1234',
    framework: 'Next.js 16',
    region: 'us-east',
    status: 'running',
    url: 'frosty-mountain-1234.aspect.run',
    lastDeploy: '2 hours ago',
    addons: ['Postgres', 'Redis'],
  },
  {
    id: 'calm-river-5678',
    name: 'calm-river-5678',
    framework: 'Astro 5',
    region: 'us-west',
    status: 'running',
    url: 'calm-river-5678.aspect.run',
    lastDeploy: 'yesterday',
    addons: ['R2'],
  },
  {
    id: 'silent-pine-9012',
    name: 'silent-pine-9012',
    framework: 'FastAPI',
    region: 'eu-west',
    status: 'building',
    url: 'silent-pine-9012.aspect.run',
    lastDeploy: 'in progress',
    addons: ['Postgres', 'Sentry'],
  },
  {
    id: 'amber-cloud-3456',
    name: 'amber-cloud-3456',
    framework: 'Remix',
    region: 'us-east',
    status: 'crashed',
    url: 'amber-cloud-3456.aspect.run',
    lastDeploy: '4 days ago',
    addons: ['Postgres', 'Stripe', 'OpenAI'],
  },
  {
    id: 'wild-sun-7890',
    name: 'wild-sun-7890',
    framework: 'SvelteKit',
    region: 'ap-south',
    status: 'idle',
    url: 'wild-sun-7890.aspect.run',
    lastDeploy: '3 weeks ago',
    addons: [],
  },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'framework' | 'fullstack' | 'database' | 'ai';
  deploys: number;
}

export const mockTemplates: Template[] = [
  {
    id: 'next',
    name: 'Next.js starter',
    description: 'App Router, Tailwind v4, server actions, ready to deploy.',
    category: 'framework',
    deploys: 18432,
  },
  {
    id: 'astro',
    name: 'Astro content site',
    description: 'Static + island architecture, MDX content collections.',
    category: 'framework',
    deploys: 9120,
  },
  {
    id: 'fastapi-postgres',
    name: 'FastAPI + Postgres',
    description: 'Python API with managed Postgres and Alembic migrations.',
    category: 'fullstack',
    deploys: 6244,
  },
  {
    id: 'next-postgres-redis',
    name: 'Next.js + Postgres + Redis',
    description: 'Full stack starter with auth, sessions, and a job queue.',
    category: 'fullstack',
    deploys: 12503,
  },
  {
    id: 'postgres',
    name: 'Postgres 16',
    description: 'Managed Postgres with daily backups and point-in-time recovery.',
    category: 'database',
    deploys: 22090,
  },
  {
    id: 'redis',
    name: 'Redis 7',
    description: 'Managed Redis for caching, queues, and pub/sub.',
    category: 'database',
    deploys: 17801,
  },
  {
    id: 'rag-starter',
    name: 'RAG starter (OpenAI + pgvector)',
    description: 'Retrieval-augmented chat with document upload, embeddings, and chat UI.',
    category: 'ai',
    deploys: 3318,
  },
  {
    id: 'agent-starter',
    name: 'Agent starter (Claude)',
    description: 'Long-running agent skeleton with tool-use, persistence, and streaming.',
    category: 'ai',
    deploys: 1942,
  },
];

export interface Addon {
  id: string;
  name: string;
  provider: string;
  description: string;
  startingPrice: string;
}

export const mockAddons: Addon[] = [
  {
    id: 'postgres',
    name: 'Postgres',
    provider: 'aspect',
    description: 'Managed Postgres 16 with auto backups and read replicas.',
    startingPrice: 'Free · $9/mo',
  },
  {
    id: 'redis',
    name: 'Redis',
    provider: 'aspect',
    description: 'Managed Redis 7 for caching and queues.',
    startingPrice: 'Free · $7/mo',
  },
  {
    id: 'r2',
    name: 'R2 object storage',
    provider: 'cloudflare',
    description: 'S3-compatible object storage with zero egress fees.',
    startingPrice: '$0.015/GB',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    provider: 'openai',
    description: 'GPT models, embeddings, and image generation.',
    startingPrice: 'Pay as you go',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    provider: 'sentry',
    description: 'Error tracking and performance monitoring.',
    startingPrice: 'Free · $26/mo',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    provider: 'stripe',
    description: 'Payments, subscriptions, and customer portal.',
    startingPrice: '2.9% + 30¢',
  },
];

export interface ActivityEntry {
  id: string;
  app: string;
  type: 'deploy' | 'config' | 'addon' | 'env';
  message: string;
  user: string;
  when: string;
}

export const mockActivity: ActivityEntry[] = [
  {
    id: '1',
    app: 'frosty-mountain-1234',
    type: 'deploy',
    message: 'Deployed v142 from main · 12 files changed',
    user: 'alex',
    when: '2 hours ago',
  },
  {
    id: '2',
    app: 'silent-pine-9012',
    type: 'deploy',
    message: 'Build started for v88',
    user: 'sam',
    when: '15 min ago',
  },
  {
    id: '3',
    app: 'calm-river-5678',
    type: 'addon',
    message: 'Provisioned R2 add-on',
    user: 'alex',
    when: 'yesterday',
  },
  {
    id: '4',
    app: 'amber-cloud-3456',
    type: 'config',
    message: 'Updated 3 environment variables',
    user: 'jordan',
    when: '4 days ago',
  },
];
