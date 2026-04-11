import type { Metadata } from 'next';
import { FoundationPanel } from '@/components/craft/foundation-panel';

export const metadata: Metadata = {
  title: 'Foundation — craft',
};

export default function FoundationPage() {
  return <FoundationPanel />;
}
