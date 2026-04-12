import type { Metadata } from 'next';
import { VoicePanel } from '@/components/craft/cluster-panels';

export const metadata: Metadata = {
  title: 'Voice — craft',
};

export default function VoicePage() {
  return <VoicePanel />;
}
