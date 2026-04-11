import Link from 'next/link';
import { Button } from '@aspect/react';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ProjectView } from './project-view';

export const metadata = {
  title: 'Studio project — tweakmizu',
};

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6">
            <Button asChild variant="ghost" size="sm" className="self-start">
              <Link href="/studio/new">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New project
              </Link>
            </Button>

            <ProjectView projectId={projectId} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
