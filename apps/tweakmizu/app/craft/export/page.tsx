import type { Metadata } from 'next';
import { ExportPanel } from '@/components/craft/export-panel';

export const metadata: Metadata = {
  title: 'Export — craft',
};

export default function ExportPage() {
  return <ExportPanel />;
}
