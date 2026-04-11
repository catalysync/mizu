import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StudioShell } from '@/components/studio/studio-shell';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <StudioShell>{children}</StudioShell>
      </main>
      <SiteFooter />
    </div>
  );
}
