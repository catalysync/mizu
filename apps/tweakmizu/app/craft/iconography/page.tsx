import type { Metadata } from 'next';
import { IconographyPanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Iconography — craft',
};

export default function IconographyPage() {
  return <IconographyPanel />;
}
