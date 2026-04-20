export const monthlyRevenue = [
  { label: 'Jan', values: { revenue: 12400, cost: 5800 } },
  { label: 'Feb', values: { revenue: 13800, cost: 6100 } },
  { label: 'Mar', values: { revenue: 15200, cost: 6900 } },
  { label: 'Apr', values: { revenue: 14600, cost: 7200 } },
  { label: 'May', values: { revenue: 17800, cost: 8100 } },
  { label: 'Jun', values: { revenue: 19200, cost: 8600 } },
  { label: 'Jul', values: { revenue: 21400, cost: 9300 } },
  { label: 'Aug', values: { revenue: 20100, cost: 9000 } },
  { label: 'Sep', values: { revenue: 22600, cost: 9800 } },
];

export const productShare = [
  { label: 'Core', value: 540 },
  { label: 'Growth', value: 320 },
  { label: 'Enterprise', value: 180 },
  { label: 'Other', value: 90 },
];

export const channelBreakdown = [
  { label: 'Organic', values: { sessions: 4200 } },
  { label: 'Paid', values: { sessions: 2800 } },
  { label: 'Referral', values: { sessions: 1900 } },
  { label: 'Direct', values: { sessions: 1200 } },
  { label: 'Email', values: { sessions: 850 } },
];

export const formatUsd = (v: string) => {
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
};
