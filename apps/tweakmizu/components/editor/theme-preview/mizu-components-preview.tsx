'use client';

import type { ThemeStyleProps } from '@/types/theme';
import { applyThemeToElement } from '@/utils/apply-theme';
import { useEffect, useRef } from 'react';

interface MizuComponentsPreviewProps {
  styles: ThemeStyleProps;
}

export default function MizuComponentsPreview({ styles }: MizuComponentsPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      applyThemeToElement(containerRef.current, styles);
    }
  }, [styles]);

  return (
    <div
      ref={containerRef}
      className="space-y-8 p-6"
      style={{ backgroundColor: styles['surface-default'], color: styles['text-primary'] }}
    >
      {/* Buttons */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Buttons
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{
              backgroundColor: styles['action-primary-default'],
              borderRadius: styles['radius-md'],
            }}
          >
            Primary
          </button>
          <button
            className="inline-flex items-center justify-center border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: styles['border-default'],
              borderRadius: styles['radius-md'],
              color: styles['text-primary'],
              backgroundColor: styles['surface-default'],
            }}
          >
            Secondary
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{
              backgroundColor: styles['action-destructive-default'],
              borderRadius: styles['radius-md'],
            }}
          >
            Destructive
          </button>
          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: styles['action-primary-disabled'],
              borderRadius: styles['radius-md'],
              color: styles['text-disabled'],
              cursor: 'not-allowed',
            }}
          >
            Disabled
          </button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Cards
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div
            className="border p-4"
            style={{
              borderColor: styles['border-default'],
              borderRadius: styles['radius-lg'],
              backgroundColor: styles['surface-default'],
              boxShadow: styles['shadow-md'],
            }}
          >
            <h4 className="text-sm font-semibold" style={{ color: styles['text-primary'] }}>
              Card Title
            </h4>
            <p className="mt-1 text-sm" style={{ color: styles['text-secondary'] }}>
              This is a card with the current theme applied. It uses surface-default for the
              background and border-default for the border.
            </p>
            <div className="mt-3">
              <button
                className="px-3 py-1.5 text-xs font-medium text-white"
                style={{
                  backgroundColor: styles['action-primary-default'],
                  borderRadius: styles['radius-sm'],
                }}
              >
                Action
              </button>
            </div>
          </div>
          <div
            className="p-4"
            style={{
              borderRadius: styles['radius-lg'],
              backgroundColor: styles['surface-secondary'],
            }}
          >
            <h4 className="text-sm font-semibold" style={{ color: styles['text-primary'] }}>
              Secondary Surface
            </h4>
            <p className="mt-1 text-sm" style={{ color: styles['text-secondary'] }}>
              Uses surface-secondary background with no border. Good for grouped content areas.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Feedback
        </h3>
        <div className="space-y-2">
          {(
            [
              ['success', styles['feedback-success-default'], styles['feedback-success-subtle']],
              ['warning', styles['feedback-warning-default'], styles['feedback-warning-subtle']],
              ['danger', styles['feedback-danger-default'], styles['feedback-danger-subtle']],
            ] as const
          ).map(([type, fg, bg]) => (
            <div
              key={type}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: bg,
                color: fg,
                borderRadius: styles['radius-md'],
              }}
            >
              <span className="capitalize">{type}</span> — This is a {type} alert.
            </div>
          ))}
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Inputs
        </h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Text input..."
            className="border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: styles['border-default'],
              borderRadius: styles['radius-md'],
              backgroundColor: styles['surface-default'],
              color: styles['text-primary'],
            }}
          />
          <select
            className="border px-3 py-2 text-sm"
            style={{
              borderColor: styles['border-default'],
              borderRadius: styles['radius-md'],
              backgroundColor: styles['surface-default'],
              color: styles['text-primary'],
            }}
          >
            <option>Option A</option>
            <option>Option B</option>
          </select>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Badges
        </h3>
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-white"
            style={{
              backgroundColor: styles['action-primary-default'],
              borderRadius: '9999px',
            }}
          >
            Primary
          </span>
          <span
            className="inline-flex items-center border px-2.5 py-0.5 text-xs font-medium"
            style={{
              borderColor: styles['border-default'],
              borderRadius: '9999px',
              color: styles['text-secondary'],
            }}
          >
            Outline
          </span>
          <span
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: styles['feedback-success-subtle'],
              color: styles['feedback-success-default'],
              borderRadius: '9999px',
            }}
          >
            Success
          </span>
          <span
            className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: styles['feedback-danger-subtle'],
              color: styles['feedback-danger-default'],
              borderRadius: '9999px',
            }}
          >
            Danger
          </span>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Typography
        </h3>
        <div className="space-y-2" style={{ fontFamily: styles['font-family-sans'] }}>
          <p className="text-2xl font-bold" style={{ color: styles['text-primary'] }}>
            Heading (font-family-sans)
          </p>
          <p className="text-base" style={{ color: styles['text-primary'] }}>
            Body text using the primary text color. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm" style={{ color: styles['text-secondary'] }}>
            Secondary text with a muted color. Used for descriptions and helper text.
          </p>
          <p className="text-sm" style={{ color: styles['text-disabled'] }}>
            Disabled text. Not interactive.
          </p>
          <code
            className="text-sm"
            style={{
              fontFamily: styles['font-family-mono'],
              color: styles['text-primary'],
              backgroundColor: styles['surface-secondary'],
              padding: '0.125rem 0.375rem',
              borderRadius: styles['radius-sm'],
            }}
          >
            monospace: font-family-mono
          </code>
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Shadows
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(['shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] as const).map((key) => (
            <div
              key={key}
              className="flex h-16 items-center justify-center text-xs font-medium"
              style={{
                boxShadow: styles[key],
                borderRadius: styles['radius-md'],
                backgroundColor: styles['surface-default'],
                color: styles['text-secondary'],
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section>
        <h3 className="mb-3 text-sm font-medium" style={{ color: styles['text-secondary'] }}>
          Radius
        </h3>
        <div className="flex flex-wrap gap-3">
          {(['radius-sm', 'radius-md', 'radius-lg', 'radius-xl'] as const).map((key) => (
            <div
              key={key}
              className="flex h-16 w-16 items-center justify-center border text-[10px] font-medium"
              style={{
                borderColor: styles['border-default'],
                borderRadius: styles[key],
                color: styles['text-secondary'],
              }}
            >
              {styles[key]}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
