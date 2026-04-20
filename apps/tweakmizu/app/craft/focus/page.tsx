import { FocusPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Focus — craft',
};

export default function FocusPage() {
  return <FocusPanel />;
}
