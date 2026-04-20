import { CraftLanding } from '@/components/craft/craft-landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start — craft',
};

export default function CraftHome() {
  return <CraftLanding />;
}
