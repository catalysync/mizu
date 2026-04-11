import type { Metadata } from 'next';
import { CraftLanding } from '@/components/craft/craft-landing';

export const metadata: Metadata = {
  title: 'Start — craft',
};

export default function CraftHome() {
  return <CraftLanding />;
}
