import { ShapePanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shape — craft',
};

export default function ShapePage() {
  return <ShapePanel />;
}
