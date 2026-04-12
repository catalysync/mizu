import type { Metadata } from 'next';
import { FocusPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Focus — craft',
};

export default function FocusPage() {
  return <FocusPanel />;
}
