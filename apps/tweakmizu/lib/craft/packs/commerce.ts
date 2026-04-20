import type { Entity, NavItem, Page } from '../app-schema';
import type { DomainPack, WorkflowDef } from './types';

const entities: Entity[] = [
  {
    id: 'product',
    name: 'Product',
    plural: 'Products',
    fields: [
      { id: 'sku', label: 'SKU', type: 'string', required: true, primary: true },
      { id: 'name', label: 'Name', type: 'string', required: true, primary: false },
      { id: 'description', label: 'Description', type: 'text', required: false, primary: false },
      { id: 'price', label: 'Price', type: 'currency', required: true, primary: false },
      {
        id: 'compareAtPrice',
        label: 'Compare at',
        type: 'currency',
        required: false,
        primary: false,
      },
      { id: 'category', label: 'Category', type: 'string', required: false, primary: false },
      { id: 'inventory', label: 'Inventory', type: 'number', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'draft', 'archived'],
        required: false,
        primary: false,
      },
      { id: 'rating', label: 'Rating', type: 'number', required: false, primary: false },
    ],
  },
  {
    id: 'order',
    name: 'Order',
    plural: 'Orders',
    fields: [
      { id: 'number', label: 'Order #', type: 'string', required: true, primary: true },
      { id: 'customer', label: 'Customer', type: 'string', required: true, primary: false },
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'total', label: 'Total', type: 'currency', required: true, primary: false },
      { id: 'items', label: 'Items', type: 'number', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: [
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'returned',
          'cancelled',
          'refunded',
        ],
        required: false,
        primary: false,
      },
      {
        id: 'paymentStatus',
        label: 'Payment',
        type: 'badge',
        badgeValues: ['pending', 'authorized', 'captured', 'refunded', 'failed'],
        required: false,
        primary: false,
      },
      { id: 'shippingMethod', label: 'Shipping', type: 'string', required: false, primary: false },
      { id: 'trackingNumber', label: 'Tracking', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    plural: 'Customers',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'email', label: 'Email', type: 'email', required: true, primary: false },
      { id: 'totalOrders', label: 'Orders', type: 'number', required: false, primary: false },
      { id: 'totalSpent', label: 'Total spent', type: 'currency', required: false, primary: false },
      { id: 'lastOrder', label: 'Last order', type: 'date', required: false, primary: false },
      {
        id: 'segment',
        label: 'Segment',
        type: 'badge',
        badgeValues: ['new', 'returning', 'vip', 'at-risk', 'churned'],
        required: false,
        primary: false,
      },
      { id: 'avgOrderValue', label: 'AOV', type: 'currency', required: false, primary: false },
    ],
  },
  {
    id: 'review',
    name: 'Review',
    plural: 'Reviews',
    fields: [
      { id: 'product', label: 'Product', type: 'string', required: true, primary: true },
      { id: 'customer', label: 'Customer', type: 'string', required: true, primary: false },
      { id: 'rating', label: 'Rating', type: 'number', required: true, primary: false },
      { id: 'title', label: 'Title', type: 'string', required: false, primary: false },
      { id: 'body', label: 'Review', type: 'text', required: false, primary: false },
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['pending', 'approved', 'rejected', 'flagged'],
        required: false,
        primary: false,
      },
      { id: 'verified', label: 'Verified', type: 'boolean', required: false, primary: false },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    plural: 'Inventory records',
    fields: [
      { id: 'sku', label: 'SKU', type: 'string', required: true, primary: true },
      { id: 'product', label: 'Product', type: 'string', required: true, primary: false },
      { id: 'warehouse', label: 'Warehouse', type: 'string', required: false, primary: false },
      { id: 'onHand', label: 'On hand', type: 'number', required: true, primary: false },
      { id: 'committed', label: 'Committed', type: 'number', required: false, primary: false },
      { id: 'available', label: 'Available', type: 'number', required: false, primary: false },
      { id: 'reorderPoint', label: 'Reorder at', type: 'number', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'discount',
    name: 'Discount',
    plural: 'Discounts',
    fields: [
      { id: 'code', label: 'Code', type: 'string', required: true, primary: true },
      { id: 'description', label: 'Description', type: 'text', required: false, primary: false },
      {
        id: 'type',
        label: 'Type',
        type: 'badge',
        badgeValues: ['percentage', 'fixed-amount', 'free-shipping', 'buy-x-get-y'],
        required: true,
        primary: false,
      },
      { id: 'value', label: 'Value', type: 'string', required: true, primary: false },
      { id: 'usageCount', label: 'Used', type: 'number', required: false, primary: false },
      { id: 'usageLimit', label: 'Limit', type: 'number', required: false, primary: false },
      { id: 'startsAt', label: 'Starts', type: 'date', required: false, primary: false },
      { id: 'endsAt', label: 'Ends', type: 'date', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'scheduled', 'expired', 'disabled'],
        required: false,
        primary: false,
      },
    ],
  },
];

const workflows: WorkflowDef[] = [
  {
    entityId: 'order',
    states: [
      { id: 'pending', label: 'Pending', transitions: ['confirmed', 'cancelled'] },
      { id: 'confirmed', label: 'Confirmed', transitions: ['processing', 'cancelled'] },
      { id: 'processing', label: 'Processing', transitions: ['shipped', 'cancelled'] },
      { id: 'shipped', label: 'Shipped', transitions: ['delivered', 'returned'] },
      { id: 'delivered', label: 'Delivered', transitions: ['returned'] },
      { id: 'returned', label: 'Returned', transitions: ['refunded'] },
      { id: 'cancelled', label: 'Cancelled', transitions: ['refunded'] },
      { id: 'refunded', label: 'Refunded', transitions: [] },
    ],
  },
  {
    entityId: 'review',
    states: [
      { id: 'pending', label: 'Pending', transitions: ['approved', 'rejected', 'flagged'] },
      { id: 'approved', label: 'Approved', transitions: ['flagged'] },
      { id: 'rejected', label: 'Rejected', transitions: ['approved'] },
      { id: 'flagged', label: 'Flagged', transitions: ['approved', 'rejected'] },
    ],
  },
  {
    entityId: 'discount',
    states: [
      { id: 'scheduled', label: 'Scheduled', transitions: ['active', 'disabled'] },
      { id: 'active', label: 'Active', transitions: ['disabled', 'expired'] },
      { id: 'disabled', label: 'Disabled', transitions: ['active'] },
      { id: 'expired', label: 'Expired', transitions: [] },
    ],
  },
  {
    entityId: 'product',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['active'] },
      { id: 'active', label: 'Active', transitions: ['archived', 'draft'] },
      { id: 'archived', label: 'Archived', transitions: ['draft'] },
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
        description: 'Last 30 days · All channels',
        actions: [{ label: 'Create order', variant: 'primary' }],
      },
      sections: [
        {
          id: 'kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Revenue', value: '$128,400', delta: '+22%' },
            { label: 'Orders', value: '1,842', delta: '+15%' },
            { label: 'Avg order value', value: '$69.70', delta: '+6%' },
            { label: 'Conversion rate', value: '3.2%', delta: '+0.4%' },
          ],
        },
        { id: 'activity', kind: 'activity-list', title: 'Recent activity' },
      ],
    },
  },
  {
    id: 'products',
    path: '/products',
    title: 'Products',
    icon: 'package',
    composition: {
      header: {
        title: 'Products',
        description: '340 total · 298 active · 42 draft',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'Add product', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'products-table',
          kind: 'table',
          entityId: 'product',
          columnIds: ['sku', 'name', 'price', 'inventory', 'category', 'status', 'rating'],
        },
      ],
    },
  },
  {
    id: 'orders',
    path: '/orders',
    title: 'Orders',
    icon: 'shopping-cart',
    composition: {
      header: {
        title: 'Orders',
        description: '1,842 total · 64 pending · 128 processing',
        actions: [{ label: 'Create order', variant: 'primary' }],
      },
      sections: [
        {
          id: 'orders-table',
          kind: 'table',
          entityId: 'order',
          columnIds: ['number', 'customer', 'date', 'total', 'items', 'status', 'paymentStatus'],
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
        description: '8,420 total · 2,104 returning · 312 VIP',
        actions: [
          { label: 'Export', variant: 'ghost' },
          { label: 'Add customer', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'customers-table',
          kind: 'table',
          entityId: 'customer',
          columnIds: ['name', 'email', 'totalOrders', 'totalSpent', 'lastOrder', 'segment'],
        },
      ],
    },
  },
  {
    id: 'inventory',
    path: '/inventory',
    title: 'Inventory',
    icon: 'warehouse',
    composition: {
      header: {
        title: 'Inventory',
        description: '2,180 SKUs · 94 low-stock · 12 out-of-stock',
        actions: [
          { label: 'Transfer stock', variant: 'ghost' },
          { label: 'Receive shipment', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'inventory-table',
          kind: 'table',
          entityId: 'inventory',
          columnIds: ['sku', 'product', 'warehouse', 'onHand', 'committed', 'available', 'status'],
        },
      ],
    },
  },
  {
    id: 'reviews',
    path: '/reviews',
    title: 'Reviews',
    icon: 'star',
    composition: {
      header: {
        title: 'Reviews',
        description: '3,420 total · 4.6 avg rating · 28 pending moderation',
        actions: [{ label: 'Moderate', variant: 'primary' }],
      },
      sections: [
        {
          id: 'reviews-table',
          kind: 'table',
          entityId: 'review',
          columnIds: ['product', 'customer', 'rating', 'title', 'date', 'status', 'verified'],
        },
      ],
    },
  },
  {
    id: 'discounts',
    path: '/discounts',
    title: 'Discounts',
    icon: 'percent',
    composition: {
      header: {
        title: 'Discounts',
        description: '18 active · 6 scheduled · 24 expired',
        actions: [{ label: 'Create discount', variant: 'primary' }],
      },
      sections: [
        {
          id: 'discounts-table',
          kind: 'table',
          entityId: 'discount',
          columnIds: ['code', 'type', 'value', 'usageCount', 'usageLimit', 'endsAt', 'status'],
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
        description: 'Store profile, payments, shipping, taxes, notifications',
        actions: [],
      },
      sections: [{ id: 'settings-form', kind: 'settings-form' }],
    },
  },
];

const defaultNav: NavItem[] = [
  { pageId: 'dashboard', section: 'primary' },
  { pageId: 'products', section: 'primary' },
  { pageId: 'orders', section: 'primary' },
  { pageId: 'customers', section: 'primary' },
  { pageId: 'inventory', section: 'primary' },
  { pageId: 'reviews', section: 'primary' },
  { pageId: 'discounts', section: 'primary' },
  { pageId: 'settings', section: 'secondary' },
];

const promptContext = `You are generating an e-commerce admin design system. Use the following domain knowledge:

ENTITIES: Product (SKU, pricing with compare-at for sales, category, inventory count, rating: draft→active→archived), Order (full fulfillment lifecycle: pending→confirmed→processing→shipped→delivered→returned→cancelled→refunded, with separate payment status), Customer (segmentation: new/returning/vip/at-risk/churned, with lifetime value tracking), Review (moderation flow: pending→approved→rejected→flagged, verified purchase badge), Inventory (multi-warehouse stock tracking: in-stock/low-stock/out-of-stock/discontinued with reorder points), Discount (coupon types: percentage/fixed-amount/free-shipping/buy-x-get-y with usage limits and scheduling).

CONSTRAINTS:
- Orders are immutable once fulfilled — returns create a separate return entity
- Inventory must track on-hand vs. committed vs. available quantities
- Multi-currency pricing with locale-aware formatting
- Tax calculation varies by jurisdiction (nexus rules, VAT/GST)
- Payment processing: authorize on checkout, capture on fulfillment
- Reviews from verified purchasers should be visually distinguished
- Discount stacking rules: max 1 automatic + 1 manual per order
- Product variants (size, color) share a parent SKU with child variant SKUs
- Shipping rate calculation: weight-based, price-based, or flat rate per zone

REFERENCE PRODUCTS: Shopify Admin (gold standard for commerce admin UX), Medusa (open-source headless commerce), BigCommerce (enterprise multi-storefront), Saleor (GraphQL-first commerce), WooCommerce (WordPress commerce).

DESIGN LANGUAGE for commerce:
- Warm, inviting palette — commerce is about products and people, not cold enterprise
- Product imagery first — large thumbnails in product tables, gallery views
- Clear monetary formatting with currency symbols, locale-aware separators
- Order status timeline visualization — customers track fulfillment visually
- Generous padding in tables — each row represents revenue, treat it with importance
- Friendly but professional tone — "Order confirmed" not "Transaction processed"
- Medium radius (6px), subtle warm shadows — approachable and trustworthy
- Color-coded segments for customer value tiers — gold for VIP, etc.

When generating pages, include proper entity-backed tables with realistic columns. Do not generate empty placeholder pages. Every page should have a composition with real sections, real entities bound to tables, and realistic KPI values.`;

export const commercePack: DomainPack = {
  id: 'commerce',
  name: 'Commerce',
  pro: true,
  entities,
  workflows,
  promptContext,
  defaultPages,
  defaultNav,
  referenceProducts: ['Shopify Admin', 'Medusa', 'BigCommerce', 'Saleor', 'WooCommerce'],
};
