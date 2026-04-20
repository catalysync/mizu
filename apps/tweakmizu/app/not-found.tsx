import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@aspect/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="text-muted-foreground/25 text-[6rem] leading-none font-extrabold tracking-tighter">
          404
        </span>
        <h1 className="text-foreground mt-4 mb-2 text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground m-0 max-w-md text-base leading-relaxed">
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
