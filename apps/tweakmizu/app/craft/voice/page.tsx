import { VoicePanel } from '@/components/craft/cluster-panels';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice — craft',
};

export default function VoicePage() {
  return <VoicePanel />;
}
