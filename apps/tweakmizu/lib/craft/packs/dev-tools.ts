import type { Entity, Page, NavItem } from '../app-schema';
import type { DomainPack, WorkflowDef } from './types';

const entities: Entity[] = [
  {
    id: 'project',
    name: 'Project',
    plural: 'Projects',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'slug', label: 'Slug', type: 'string', required: true, primary: false },
      { id: 'description', label: 'Description', type: 'text', required: false, primary: false },
      { id: 'language', label: 'Language', type: 'string', required: false, primary: false },
      { id: 'openIssues', label: 'Open issues', type: 'number', required: false, primary: false },
      { id: 'lastDeploy', label: 'Last deploy', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'archived', 'paused'],
        required: false,
        primary: false,
      },
      { id: 'teamSize', label: 'Team', type: 'number', required: false, primary: false },
    ],
  },
  {
    id: 'issue',
    name: 'Issue',
    plural: 'Issues',
    fields: [
      { id: 'key', label: 'Key', type: 'string', required: true, primary: true },
      { id: 'title', label: 'Title', type: 'string', required: true, primary: false },
      { id: 'project', label: 'Project', type: 'string', required: true, primary: false },
      { id: 'assignee', label: 'Assignee', type: 'string', required: false, primary: false },
      {
        id: 'priority',
        label: 'Priority',
        type: 'badge',
        badgeValues: ['critical', 'high', 'medium', 'low', 'none'],
        required: false,
        primary: false,
      },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['backlog', 'todo', 'in-progress', 'in-review', 'done', 'cancelled'],
        required: false,
        primary: false,
      },
      {
        id: 'type',
        label: 'Type',
        type: 'badge',
        badgeValues: ['bug', 'feature', 'improvement', 'task', 'epic'],
        required: false,
        primary: false,
      },
      { id: 'createdAt', label: 'Created', type: 'date', required: false, primary: false },
      { id: 'updatedAt', label: 'Updated', type: 'date', required: false, primary: false },
    ],
  },
  {
    id: 'deployment',
    name: 'Deployment',
    plural: 'Deployments',
    fields: [
      { id: 'id', label: 'Deploy ID', type: 'string', required: true, primary: true },
      { id: 'project', label: 'Project', type: 'string', required: true, primary: false },
      { id: 'branch', label: 'Branch', type: 'string', required: true, primary: false },
      { id: 'commit', label: 'Commit', type: 'string', required: false, primary: false },
      { id: 'triggeredBy', label: 'Triggered by', type: 'string', required: false, primary: false },
      { id: 'startedAt', label: 'Started', type: 'date', required: true, primary: false },
      { id: 'duration', label: 'Duration', type: 'string', required: false, primary: false },
      {
        id: 'environment',
        label: 'Env',
        type: 'badge',
        badgeValues: ['production', 'staging', 'preview', 'development'],
        required: false,
        primary: false,
      },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: [
          'queued',
          'building',
          'deploying',
          'ready',
          'failed',
          'cancelled',
          'rolled-back',
        ],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'team-member',
    name: 'Team member',
    plural: 'Team members',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'email', label: 'Email', type: 'email', required: true, primary: false },
      {
        id: 'role',
        label: 'Role',
        type: 'badge',
        badgeValues: ['owner', 'admin', 'member', 'viewer'],
        required: false,
        primary: false,
      },
      { id: 'lastActive', label: 'Last active', type: 'date', required: false, primary: false },
      { id: 'openIssues', label: 'Open issues', type: 'number', required: false, primary: false },
    ],
  },
  {
    id: 'metric',
    name: 'Metric',
    plural: 'Metrics',
    fields: [
      { id: 'name', label: 'Metric', type: 'string', required: true, primary: true },
      { id: 'project', label: 'Project', type: 'string', required: true, primary: false },
      { id: 'value', label: 'Value', type: 'string', required: true, primary: false },
      { id: 'unit', label: 'Unit', type: 'string', required: false, primary: false },
      {
        id: 'trend',
        label: 'Trend',
        type: 'badge',
        badgeValues: ['improving', 'stable', 'degrading'],
        required: false,
        primary: false,
      },
      { id: 'updatedAt', label: 'Updated', type: 'date', required: false, primary: false },
    ],
  },
  {
    id: 'webhook',
    name: 'Webhook',
    plural: 'Webhooks',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'url', label: 'URL', type: 'string', required: true, primary: false },
      { id: 'events', label: 'Events', type: 'string', required: false, primary: false },
      {
        id: 'lastTriggered',
        label: 'Last triggered',
        type: 'date',
        required: false,
        primary: false,
      },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'disabled', 'failing'],
        required: false,
        primary: false,
      },
      {
        id: 'successRate',
        label: 'Success rate',
        type: 'percent',
        required: false,
        primary: false,
      },
    ],
  },
];

const workflows: WorkflowDef[] = [
  {
    entityId: 'issue',
    states: [
      { id: 'backlog', label: 'Backlog', transitions: ['todo', 'cancelled'] },
      { id: 'todo', label: 'Todo', transitions: ['in-progress', 'backlog', 'cancelled'] },
      { id: 'in-progress', label: 'In progress', transitions: ['in-review', 'todo', 'cancelled'] },
      { id: 'in-review', label: 'In review', transitions: ['done', 'in-progress'] },
      { id: 'done', label: 'Done', transitions: [] },
      { id: 'cancelled', label: 'Cancelled', transitions: ['backlog'] },
    ],
  },
  {
    entityId: 'deployment',
    states: [
      { id: 'queued', label: 'Queued', transitions: ['building', 'cancelled'] },
      { id: 'building', label: 'Building', transitions: ['deploying', 'failed'] },
      { id: 'deploying', label: 'Deploying', transitions: ['ready', 'failed'] },
      { id: 'ready', label: 'Ready', transitions: ['rolled-back'] },
      { id: 'failed', label: 'Failed', transitions: ['queued'] },
      { id: 'cancelled', label: 'Cancelled', transitions: [] },
      { id: 'rolled-back', label: 'Rolled back', transitions: [] },
    ],
  },
  {
    entityId: 'webhook',
    states: [
      { id: 'active', label: 'Active', transitions: ['disabled', 'failing'] },
      { id: 'disabled', label: 'Disabled', transitions: ['active'] },
      { id: 'failing', label: 'Failing', transitions: ['active', 'disabled'] },
    ],
  },
];

const defaultPages: Page[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    icon: 'layout',
    composition: {
      header: {
        title: 'Dashboard',
        description: 'Last 7 days · All projects',
        actions: [{ label: 'New project', variant: 'primary' }],
      },
      sections: [
        {
          id: 'kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Open issues', value: '142', delta: '-8%' },
            { label: 'Deploys today', value: '23', delta: '+4' },
            { label: 'Error rate', value: '0.12%', delta: '-0.03%' },
            { label: 'P50 latency', value: '84ms', delta: '-12ms' },
          ],
        },
        { id: 'activity', kind: 'activity-list', title: 'Recent activity' },
      ],
    },
  },
  {
    id: 'projects',
    path: '/projects',
    title: 'Projects',
    icon: 'folder',
    composition: {
      header: {
        title: 'Projects',
        description: '12 total · 10 active · 2 archived',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'New project', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'projects-table',
          kind: 'table',
          entityId: 'project',
          columnIds: ['name', 'slug', 'language', 'openIssues', 'lastDeploy', 'status'],
        },
      ],
    },
  },
  {
    id: 'issues',
    path: '/issues',
    title: 'Issues',
    icon: 'circle-dot',
    composition: {
      header: {
        title: 'Issues',
        description: '142 open · 38 in progress · 1,204 closed',
        actions: [{ label: 'New issue', variant: 'primary' }],
      },
      sections: [
        {
          id: 'issues-table',
          kind: 'table',
          entityId: 'issue',
          columnIds: ['key', 'title', 'project', 'assignee', 'priority', 'status', 'type'],
        },
      ],
    },
  },
  {
    id: 'deployments',
    path: '/deployments',
    title: 'Deployments',
    icon: 'rocket',
    composition: {
      header: {
        title: 'Deployments',
        description: '23 today · 156 this week · 98.4% success rate',
        actions: [{ label: 'Deploy', variant: 'primary' }],
      },
      sections: [
        {
          id: 'deployments-table',
          kind: 'table',
          entityId: 'deployment',
          columnIds: ['id', 'project', 'branch', 'commit', 'environment', 'duration', 'status'],
        },
      ],
    },
  },
  {
    id: 'team',
    path: '/team',
    title: 'Team',
    icon: 'users',
    composition: {
      header: {
        title: 'Team',
        description: '24 members · 3 admins · 1 pending invite',
        actions: [{ label: 'Invite member', variant: 'primary' }],
      },
      sections: [
        {
          id: 'team-table',
          kind: 'table',
          entityId: 'team-member',
          columnIds: ['name', 'email', 'role', 'lastActive', 'openIssues'],
        },
      ],
    },
  },
  {
    id: 'metrics',
    path: '/metrics',
    title: 'Metrics',
    icon: 'activity',
    composition: {
      header: {
        title: 'Metrics',
        description: 'Observability · Last 24 hours',
        actions: [{ label: 'Add metric', variant: 'primary' }],
      },
      sections: [
        {
          id: 'metrics-kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Uptime', value: '99.97%', delta: '+0.02%' },
            { label: 'P95 latency', value: '210ms', delta: '-18ms' },
            { label: 'Error rate', value: '0.12%', delta: '-0.03%' },
            { label: 'Throughput', value: '4.2K req/s', delta: '+8%' },
          ],
        },
        {
          id: 'metrics-table',
          kind: 'table',
          entityId: 'metric',
          columnIds: ['name', 'project', 'value', 'unit', 'trend', 'updatedAt'],
        },
      ],
    },
  },
  {
    id: 'webhooks',
    path: '/webhooks',
    title: 'Webhooks',
    icon: 'webhook',
    composition: {
      header: {
        title: 'Webhooks',
        description: '8 active · 1 failing · 12,400 deliveries this week',
        actions: [{ label: 'Add endpoint', variant: 'primary' }],
      },
      sections: [
        {
          id: 'webhooks-table',
          kind: 'table',
          entityId: 'webhook',
          columnIds: ['name', 'url', 'events', 'lastTriggered', 'successRate', 'status'],
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
        description: 'Team, webhooks, integrations, API keys',
        actions: [],
      },
      sections: [{ id: 'settings-form', kind: 'settings-form' }],
    },
  },
];

const defaultNav: NavItem[] = [
  { pageId: 'dashboard', section: 'primary' },
  { pageId: 'projects', section: 'primary' },
  { pageId: 'issues', section: 'primary' },
  { pageId: 'deployments', section: 'primary' },
  { pageId: 'metrics', section: 'primary' },
  { pageId: 'team', section: 'secondary' },
  { pageId: 'webhooks', section: 'secondary' },
  { pageId: 'settings', section: 'secondary' },
];

const promptContext = `You are generating a developer tools / project management design system. Use the following domain knowledge:

ENTITIES: Project (repositories/services with language, team, open issues), Issue (full kanban lifecycle: backlog→todo→in-progress→in-review→done→cancelled, with priority and type labels), Deployment (CI/CD pipeline: queued→building→deploying→ready→failed→cancelled→rolled-back, multi-environment), Team Member (RBAC: owner/admin/member/viewer), Metric (observability KPIs with trend tracking), Webhook (integration endpoints: active→disabled→failing).

CONSTRAINTS:
- Git-centric: every deployment links to a branch + commit SHA
- Issues use a short key format (e.g., PROJ-123) for fast reference
- Deployments are immutable once completed — rollback creates a new deployment
- Environment promotion: preview→staging→production pipeline
- Webhooks must retry with exponential backoff and surface delivery logs
- API keys should show last-used date and allow scoped permissions
- Audit log for all destructive actions (deletes, role changes, secret rotations)
- Rate limiting and usage quotas per project/team

REFERENCE PRODUCTS: Linear (issue tracking gold standard), Vercel (deployment UX reference), GitHub (repository + CI/CD), Railway (modern PaaS), Sentry (error monitoring).

DESIGN LANGUAGE for developer tools:
- Dark-mode-first, monospace accents for code/IDs — developers live in dark themes
- Minimal chrome, high information density — every pixel should earn its place
- Keyboard-first interactions — Cmd+K, single-letter shortcuts, vim-style navigation
- Status-driven UI: green=healthy, yellow=degrading, red=failing (semantic, not decorative)
- Tight spacing (4px base grid), sharp corners (4px radius) — technical precision
- Neutral palette with high-contrast accent for actions — avoid playful colors
- Tabular-nums for metrics, truncated commit SHAs, relative timestamps ("2m ago")
- Dry, precise copy — "Deploy failed: exit code 1" not "Something went wrong"

When generating pages, include proper entity-backed tables with realistic columns. Do not generate empty placeholder pages. Every page should have a composition with real sections, real entities bound to tables, and realistic KPI values.`;

export const devToolsPack: DomainPack = {
  id: 'dev-tools',
  name: 'Developer Tools',
  pro: true,
  entities,
  workflows,
  promptContext,
  defaultPages,
  defaultNav,
  referenceProducts: ['Linear', 'Vercel', 'GitHub', 'Railway', 'Sentry'],
};
