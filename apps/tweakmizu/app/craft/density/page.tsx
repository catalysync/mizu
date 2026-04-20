import { DensityPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Density — craft',
};

export default function DensityPage() {
  return <DensityPanel />;
}
