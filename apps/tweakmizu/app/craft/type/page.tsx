import { TypePanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Type — craft',
};

export default function TypePage() {
  return <TypePanel />;
}
