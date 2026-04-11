import { Button } from '@aspect/react';
import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="text-[6rem] font-extrabold leading-none tracking-tighter text-muted-foreground/25">
          404
        </span>
        <h1 className="mb-2 mt-4 text-3xl font-bold text-foreground">Page not found</h1>
        <p className="m-0 max-w-md text-base leading-relaxed text-muted-foreground">
          The page you are looking for does not exist or has moved. Head back to the landing page or
          jump straight into the editor.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
          <Link href="/editor">
            <Button>Open editor</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
