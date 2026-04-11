'use client';

import { Button } from '@aspect/react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/store/preset-store';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';
import { cn } from '@/utils/cn';

const perks = ['Live preview', 'Export plain CSS', '26 built-in themes'];

export function Hero() {
  const themeState = useEditorStore((s) => s.themeState);
  const apply = useEditorStore((s) => s.applyThemePreset);
  const presets = useThemePresetStore((s) => s.getAllPresets());
  const activePreset = themeState.preset ?? 'default';

  const names = Object.keys(presets).slice(0, 18);

  return (
    <section className="relative isolate w-full overflow-hidden px-6 pb-32 pt-24 md:pb-40 md:pt-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--mizu-text-secondary)_20%,transparent)_1px,transparent_0)] bg-[size:24px_24px] [-webkit-mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <span className="fade-up inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
          <span className="inline-block size-1.5 rounded-full bg-success" />
          Built on the mizu design system
        </span>

        <h1 className="fade-up fade-up-delay-1 m-0 max-w-4xl text-center text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Tweak your{' '}
          <span className="bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">
            mizu
          </span>{' '}
          theme,
          <br />
          right in the browser.
        </h1>

        <p className="fade-up fade-up-delay-2 m-0 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
          Pick a preset, push colors, radius, shadows, and typography around until it looks right.
          Copy the generated CSS back into your project. No accounts, no build step.
        </p>

        <div className="fade-up fade-up-delay-3 flex flex-wrap items-center justify-center gap-3">
          <Link href="/editor">
            <Button size="lg">
              Open the editor
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              const el = document.getElementById('how-it-works');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="no-underline"
          >
            <Button size="lg" variant="secondary">
              How it works
            </Button>
          </a>
        </div>

        <div className="fade-up fade-up-delay-4 mt-2 flex flex-wrap justify-center gap-6">
          {perks.map((perk) => (
            <span
              key={perk}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check size={10} />
              </span>
              {perk}
            </span>
          ))}
        </div>

        <div className="fade-up fade-up-delay-4 mt-10 w-full max-w-3xl">
          <p className="m-0 mb-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Start from a built-in theme
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {names.map((name) => {
              const s = getPresetThemeStyles(name);
              const active = name === activePreset;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => apply(name)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm font-medium capitalize text-foreground transition-colors',
                    active
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <span className="flex gap-0.5">
                    {(
                      [
                        'action-primary-default',
                        'surface-default',
                        'text-primary',
                        'border-default',
                      ] as const
                    ).map((k) => (
                      <span
                        key={k}
                        className="size-2.5 rounded-sm border border-border"
                        style={{ backgroundColor: s[k] }}
                      />
                    ))}
                  </span>
                  {presets[name]?.label ?? name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
