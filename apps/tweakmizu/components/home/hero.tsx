'use client';

import { Button, Inline, Stack } from '@aspect/react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/store/preset-store';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';

const perks = ['Live preview', 'Export plain CSS', '26 built-in themes'];

export function Hero() {
  const themeState = useEditorStore((s) => s.themeState);
  const apply = useEditorStore((s) => s.applyThemePreset);
  const presets = useThemePresetStore((s) => s.getAllPresets());
  const activePreset = themeState.preset ?? 'default';

  const names = Object.keys(presets).slice(0, 18);

  return (
    <section
      style={{
        position: 'relative',
        isolation: 'isolate',
        width: '100%',
        padding: '6rem 1.5rem 8rem',
        overflow: 'hidden',
      }}
    >
      {/* dot-grid background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--mizu-text-secondary) 20%, transparent) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />

      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <Stack gap="1.5rem" align="center">
          <span
            className="fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid var(--mizu-border-default)',
              background: 'var(--mizu-surface-secondary)',
              color: 'var(--mizu-text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '9999px',
                background: 'var(--mizu-feedback-success-default)',
              }}
            />
            Built on the mizu design system
          </span>

          <h1
            className="fade-up fade-up-delay-1"
            style={{
              margin: 0,
              textAlign: 'center',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--mizu-text-primary)',
            }}
          >
            Tweak your{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, var(--mizu-action-primary-default), var(--mizu-feedback-success-default))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              mizu
            </span>{' '}
            theme,
            <br />
            right in the browser.
          </h1>

          <p
            className="fade-up fade-up-delay-2"
            style={{
              margin: 0,
              textAlign: 'center',
              maxWidth: '40rem',
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'var(--mizu-text-secondary)',
            }}
          >
            Pick a preset, push colors, radius, shadows, and typography around until it looks right.
            Copy the generated CSS back into your project. No accounts, no build step.
          </p>

          <Inline gap="0.75rem" className="fade-up fade-up-delay-3">
            <Link href="/editor">
              <Button size="lg">
                Open the editor
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
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
              style={{ textDecoration: 'none' }}
            >
              <Button size="lg" variant="secondary">
                How it works
              </Button>
            </a>
          </Inline>

          <Inline gap="1.5rem" className="fade-up fade-up-delay-4" style={{ marginTop: '0.5rem' }}>
            {perks.map((perk) => (
              <span
                key={perk}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                  color: 'var(--mizu-text-secondary)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: '9999px',
                    background:
                      'color-mix(in srgb, var(--mizu-action-primary-default) 15%, transparent)',
                    color: 'var(--mizu-action-primary-default)',
                  }}
                >
                  <Check size={10} />
                </span>
                {perk}
              </span>
            ))}
          </Inline>

          <div
            className="fade-up fade-up-delay-4"
            style={{ marginTop: '2.5rem', width: '100%', maxWidth: '56rem' }}
          >
            <p
              style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--mizu-text-secondary)',
                margin: '0 0 0.75rem',
              }}
            >
              Start from a built-in theme
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {names.map((name) => {
                const s = getPresetThemeStyles(name);
                const active = name === activePreset;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => apply(name)}
                    aria-pressed={active}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '9999px',
                      border: `1px solid ${
                        active ? 'var(--mizu-action-primary-default)' : 'var(--mizu-border-default)'
                      }`,
                      background: active
                        ? 'color-mix(in srgb, var(--mizu-action-primary-default) 8%, var(--mizu-surface-default))'
                        : 'var(--mizu-surface-default)',
                      color: 'var(--mizu-text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      transition:
                        'border-color var(--mizu-duration-fast), background var(--mizu-duration-fast)',
                    }}
                  >
                    <span style={{ display: 'flex', gap: 2 }}>
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
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 'var(--mizu-radius-sm)',
                            border: '1px solid var(--mizu-border-default)',
                            background: s[k],
                          }}
                        />
                      ))}
                    </span>
                    {presets[name]?.label ?? name}
                  </button>
                );
              })}
            </div>
          </div>
        </Stack>
      </div>
    </section>
  );
}
