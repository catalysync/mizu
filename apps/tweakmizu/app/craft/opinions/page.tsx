import { OpinionsPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Opinions — craft',
};

export default function OpinionsPage() {
  return <OpinionsPanel />;
}
