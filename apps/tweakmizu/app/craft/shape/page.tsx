import type { Metadata } from 'next';
import { ShapePanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Shape — craft',
};

export default function ShapePage() {
  return <ShapePanel />;
}
