import type { Metadata } from 'next';
import { TypePanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Type — craft',
};

export default function TypePage() {
  return <TypePanel />;
}
