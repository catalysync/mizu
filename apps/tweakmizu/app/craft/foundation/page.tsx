import { FoundationPanel } from '@/components/craft/foundation-panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foundation — craft',
};

export default function FoundationPage() {
  return <FoundationPanel />;
}
