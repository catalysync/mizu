import { IconographyPanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iconography — craft',
};

export default function IconographyPage() {
  return <IconographyPanel />;
}
