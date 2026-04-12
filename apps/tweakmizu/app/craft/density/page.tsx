import type { Metadata } from 'next';
import { DensityPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Density — craft',
};

export default function DensityPage() {
  return <DensityPanel />;
}
