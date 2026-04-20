import { ExportPanel } from '@/components/craft/export-panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export — craft',
};

export default function ExportPage() {
  return <ExportPanel />;
}
