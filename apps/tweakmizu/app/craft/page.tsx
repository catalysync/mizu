import type { Metadata } from 'next';
import { ArchetypePicker } from '@/components/craft/archetype-picker';

export const metadata: Metadata = {
  title: 'Start — craft',
};

export default function CraftHome() {
  return <ArchetypePicker />;
}
