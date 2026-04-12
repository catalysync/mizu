import type { Metadata } from 'next';
import { DepthPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Depth — craft',
};

export default function DepthPage() {
  return <DepthPanel />;
}
