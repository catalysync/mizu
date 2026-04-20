import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button, Stack } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SignInForm } from './signin-form';

export const metadata = {
  title: 'Sign in — tweakmizu',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-md px-4 py-16">
          <Stack gap="1.5rem">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>

            <Stack gap="0.5rem">
              <h1 className="text-foreground text-3xl font-bold tracking-tight">Sign in</h1>
              <p className="text-muted-foreground text-sm">
                Sign in to save themes, projects, and subscribe to Pro.
              </p>
            </Stack>

            <SignInForm />
          </Stack>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
