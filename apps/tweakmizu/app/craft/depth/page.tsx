import { DepthPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Depth — craft',
};

export default function DepthPage() {
  return <DepthPanel />;
}
