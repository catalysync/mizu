export interface DatasetRow {
  id: string;
  name: string;
  owner: string;
  rows: number;
  lastModified: string;
  status: 'healthy' | 'stale' | 'error';
}

export const datasets: DatasetRow[] = [
  {
    id: '1',
    name: 'customer_events',
    owner: 'data-eng',
    rows: 12400000,
    lastModified: '2 hours ago',
    status: 'healthy',
  },
  {
    id: '2',
    name: 'order_facts',
    owner: 'analytics',
    rows: 3200000,
    lastModified: '1 day ago',
    status: 'healthy',
  },
  {
    id: '3',
    name: 'product_catalog',
    owner: 'data-eng',
    rows: 48000,
    lastModified: '3 days ago',
    status: 'stale',
  },
  {
    id: '4',
    name: 'user_sessions',
    owner: 'growth',
    rows: 89000000,
    lastModified: '15 min ago',
    status: 'healthy',
  },
  {
    id: '5',
    name: 'payment_ledger',
    owner: 'finance',
    rows: 5600000,
    lastModified: '6 hours ago',
    status: 'healthy',
  },
  {
    id: '6',
    name: 'marketing_spend',
    owner: 'marketing',
    rows: 120000,
    lastModified: '5 days ago',
    status: 'stale',
  },
  {
    id: '7',
    name: 'error_logs_v2',
    owner: 'platform',
    rows: 420000000,
    lastModified: '1 min ago',
    status: 'error',
  },
  {
    id: '8',
    name: 'feature_flags',
    owner: 'platform',
    rows: 340,
    lastModified: '2 weeks ago',
    status: 'healthy',
  },
];

export interface WorkspaceItem {
  id: string;
  label: string;
  type: 'folder' | 'dataset' | 'pipeline' | 'dashboard';
  children?: WorkspaceItem[];
}

export const workspace: WorkspaceItem[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    type: 'folder',
    children: [
      { id: 'revenue-dash', label: 'Revenue Dashboard', type: 'dashboard' },
      { id: 'funnel', label: 'Conversion Funnel', type: 'dashboard' },
      { id: 'order-facts', label: 'order_facts', type: 'dataset' },
    ],
  },
  {
    id: 'data-eng',
    label: 'Data Engineering',
    type: 'folder',
    children: [
      { id: 'etl-pipeline', label: 'ETL Pipeline', type: 'pipeline' },
      { id: 'customer-events', label: 'customer_events', type: 'dataset' },
      { id: 'product-catalog', label: 'product_catalog', type: 'dataset' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    type: 'folder',
    children: [
      { id: 'error-logs', label: 'error_logs_v2', type: 'dataset' },
      { id: 'flags', label: 'feature_flags', type: 'dataset' },
    ],
  },
];
