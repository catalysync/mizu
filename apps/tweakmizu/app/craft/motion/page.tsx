import { MotionPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Motion — craft',
};

export default function MotionPage() {
  return <MotionPanel />;
}
