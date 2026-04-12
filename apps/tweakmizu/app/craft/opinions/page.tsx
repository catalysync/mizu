import type { Metadata } from 'next';
import { OpinionsPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Opinions — craft',
};

export default function OpinionsPage() {
  return <OpinionsPanel />;
}
