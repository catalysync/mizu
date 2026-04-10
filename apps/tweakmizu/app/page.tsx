'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-[100dvh] flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">tweakmizu</h1>
        <p className="text-text-secondary max-w-md text-lg">
          A visual theme editor for the mizu design system. Pick a theme, tweak tokens, preview
          live, and export your custom CSS.
        </p>
        <Link
          href="/editor"
          className="bg-primary text-white rounded-lg px-6 py-3 font-medium transition-colors hover:opacity-90"
        >
          Open Editor
        </Link>
      </main>
    </div>
  );
}
