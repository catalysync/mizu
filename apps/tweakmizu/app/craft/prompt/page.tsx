import type { Metadata } from 'next';
import { PromptPanel } from '@/components/craft/prompt-panel';

export const metadata: Metadata = {
  title: 'AI prompt — craft',
};

export default function PromptPage() {
  return <PromptPanel />;
}
