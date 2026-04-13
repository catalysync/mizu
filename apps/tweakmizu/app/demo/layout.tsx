import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'demo — tweakmizu craft',
  description:
    'Try the craft studio without signing in. Pick an archetype, tweak foundation knobs, and preview your design language live.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
