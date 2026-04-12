import type { Metadata } from 'next';
import { MotionPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Motion — craft',
};

export default function MotionPage() {
  return <MotionPanel />;
}
