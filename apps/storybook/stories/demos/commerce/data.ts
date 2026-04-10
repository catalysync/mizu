export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Minimal Desk Lamp',
    sku: 'LAMP-001',
    price: 89,
    stock: 124,
    status: 'active',
    category: 'Lighting',
  },
  {
    id: '2',
    name: 'Oak Standing Desk',
    sku: 'DESK-042',
    price: 749,
    stock: 18,
    status: 'active',
    category: 'Furniture',
  },
  {
    id: '3',
    name: 'Ceramic Mug Set (4)',
    sku: 'MUG-012',
    price: 34,
    stock: 0,
    status: 'draft',
    category: 'Drinkware',
  },
  {
    id: '4',
    name: 'Linen Throw Blanket',
    sku: 'BLKT-007',
    price: 68,
    stock: 56,
    status: 'active',
    category: 'Textiles',
  },
  {
    id: '5',
    name: 'Walnut Monitor Riser',
    sku: 'RISER-003',
    price: 129,
    stock: 42,
    status: 'active',
    category: 'Furniture',
  },
  {
    id: '6',
    name: 'Brass Pen Holder',
    sku: 'PEN-019',
    price: 45,
    stock: 8,
    status: 'active',
    category: 'Accessories',
  },
  {
    id: '7',
    name: 'Wool Desk Pad',
    sku: 'PAD-008',
    price: 58,
    stock: 0,
    status: 'archived',
    category: 'Accessories',
  },
];

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  date: string;
  status: 'fulfilled' | 'pending' | 'refunded';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    orders: 8,
    spent: 2340,
    lastOrder: 'Mar 28',
    status: 'active',
  },
  {
    id: 'c2',
    name: 'James Okafor',
    email: 'james@example.com',
    orders: 3,
    spent: 1890,
    lastOrder: 'Mar 27',
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Priya Patel',
    email: 'priya@example.com',
    orders: 12,
    spent: 4120,
    lastOrder: 'Mar 26',
    status: 'active',
  },
  {
    id: 'c4',
    name: 'Alex Kim',
    email: 'alex@example.com',
    orders: 1,
    spent: 89,
    lastOrder: 'Mar 25',
    status: 'inactive',
  },
  {
    id: 'c5',
    name: 'Maria Santos',
    email: 'maria@example.com',
    orders: 6,
    spent: 1780,
    lastOrder: 'Mar 24',
    status: 'active',
  },
  {
    id: 'c6',
    name: 'David Nguyen',
    email: 'david@example.com',
    orders: 15,
    spent: 5430,
    lastOrder: 'Mar 22',
    status: 'active',
  },
  {
    id: 'c7',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    orders: 2,
    spent: 156,
    lastOrder: 'Feb 14',
    status: 'inactive',
  },
];

export const orders: Order[] = [
  {
    id: '#1042',
    customer: 'Sarah Chen',
    items: 3,
    total: 247,
    date: 'Mar 28',
    status: 'fulfilled',
  },
  {
    id: '#1041',
    customer: 'James Okafor',
    items: 1,
    total: 749,
    date: 'Mar 27',
    status: 'pending',
  },
  {
    id: '#1040',
    customer: 'Priya Patel',
    items: 2,
    total: 157,
    date: 'Mar 26',
    status: 'fulfilled',
  },
  { id: '#1039', customer: 'Alex Kim', items: 1, total: 89, date: 'Mar 25', status: 'refunded' },
  {
    id: '#1038',
    customer: 'Maria Santos',
    items: 4,
    total: 312,
    date: 'Mar 24',
    status: 'fulfilled',
  },
];
