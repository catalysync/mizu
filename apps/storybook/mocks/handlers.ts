import { delay, http, HttpResponse } from 'msw';

// Fake app data for the cloud demo
const apps = [
  {
    id: '1',
    name: 'frosty-mountain',
    status: 'running',
    region: 'us-east',
    framework: 'Next.js',
    deploys: 42,
    lastDeployed: '2026-04-09T14:32:00Z',
  },
  {
    id: '2',
    name: 'calm-river',
    status: 'running',
    region: 'eu-west',
    framework: 'Remix',
    deploys: 18,
    lastDeployed: '2026-04-08T09:15:00Z',
  },
  {
    id: '3',
    name: 'wild-sun',
    status: 'idle',
    region: 'us-east',
    framework: 'Astro',
    deploys: 7,
    lastDeployed: '2026-03-30T22:01:00Z',
  },
  {
    id: '4',
    name: 'quiet-lake',
    status: 'crashed',
    region: 'ap-south',
    framework: 'SvelteKit',
    deploys: 31,
    lastDeployed: '2026-04-07T17:45:00Z',
  },
  {
    id: '5',
    name: 'bold-peak',
    status: 'building',
    region: 'us-west',
    framework: 'Next.js',
    deploys: 56,
    lastDeployed: '2026-04-10T08:00:00Z',
  },
  {
    id: '6',
    name: 'swift-creek',
    status: 'running',
    region: 'eu-west',
    framework: 'Nuxt',
    deploys: 23,
    lastDeployed: '2026-04-09T11:20:00Z',
  },
  {
    id: '7',
    name: 'amber-field',
    status: 'running',
    region: 'us-east',
    framework: 'Rails',
    deploys: 89,
    lastDeployed: '2026-04-10T06:45:00Z',
  },
  {
    id: '8',
    name: 'silver-wave',
    status: 'idle',
    region: 'us-west',
    framework: 'Django',
    deploys: 12,
    lastDeployed: '2026-03-28T15:30:00Z',
  },
];

// Simple SQL WHERE-like filtering on the mock data
function filterApps(where?: string) {
  if (!where) return apps;

  return apps.filter((app) => {
    const record = app as Record<string, string | number>;
    // Very naive parser for demo purposes: "status = 'running' and region = 'us-east'"
    const clauses = where.split(/\s+and\s+/i);
    return clauses.every((clause) => {
      const match = clause.match(/(\w+)\s*(=|!=|>|<|>=|<=|like)\s*'?([^']*)'?/i);
      if (!match) return true;
      const [, field, op, value] = match;
      const fieldVal = String(record[field] ?? '').toLowerCase();
      const cmpVal = value.toLowerCase();
      switch (op) {
        case '=':
          return fieldVal === cmpVal;
        case '!=':
          return fieldVal !== cmpVal;
        case '>':
          return Number(record[field]) > Number(value);
        case '<':
          return Number(record[field]) < Number(value);
        case '>=':
          return Number(record[field]) >= Number(value);
        case '<=':
          return Number(record[field]) <= Number(value);
        case 'like':
          return fieldVal.includes(cmpVal.replace(/%/g, ''));
        default:
          return true;
      }
    });
  });
}

export const handlers = [
  // Query endpoint — accepts a WHERE clause, returns filtered apps
  http.post('/api/query', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { where?: string };
    const results = filterApps(body.where);
    return HttpResponse.json({ data: results, total: results.length });
  }),

  // List all apps
  http.get('/api/apps', async () => {
    await delay(400);
    return HttpResponse.json({ data: apps, total: apps.length });
  }),

  // Get single app
  http.get('/api/apps/:id', async ({ params }) => {
    await delay(300);
    const app = apps.find((a) => a.id === params.id);
    if (!app) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ data: app });
  }),
];
