import { PromptPanel } from '@/components/craft/prompt-panel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI prompt — craft',
};

export default function PromptPage() {
  return <PromptPanel />;
}
