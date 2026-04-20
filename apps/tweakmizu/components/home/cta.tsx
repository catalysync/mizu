'use client';

import { Button, Cluster } from '@aspect/react';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="from-primary to-success text-primary-foreground relative overflow-hidden bg-gradient-to-br px-6 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)] bg-[size:4rem_4rem] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="m-0 text-5xl leading-[1.1] font-extrabold tracking-tight md:text-6xl">
          Your theme, one tab away.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed opacity-90">
          Open the editor, adjust whatever feels off, copy the CSS. Your mizu app looks different in
          about 90 seconds.
        </p>
        <Cluster gap="0.75rem" justify="center" className="mt-8">
          <Link href="/editor">
            <Button size="lg" variant="secondary">
              Open the editor
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <a
            href="https://github.com/catalysync/mizu"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Button size="lg" variant="ghost" className="text-primary-foreground">
              <Github size={16} className="mr-2" />
              View mizu on GitHub
            </Button>
          </a>
        </Cluster>
      </div>
    </section>
  );
}
