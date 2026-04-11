'use client';

import './live-preview.css';
import type { CssVarMap } from '@/lib/craft/profile-to-css';

interface LivePreviewProps {
  vars: CssVarMap;
}

/**
 * A token sandbox. Applies the passed CSS variable map to a local root and
 * renders a small set of representative components so every knob change is
 * visible within 16ms. Intentionally does not import from @aspect/react to
 * keep the rendered subtree isolated from ambient app tokens.
 */
export function LivePreview({ vars }: LivePreviewProps) {
  return (
    <div className="craft-preview" style={vars as React.CSSProperties}>
      <div className="craft-preview__surface">
        <header className="craft-preview__header">
          <div className="craft-preview__brand">
            <span className="craft-preview__brand-mark">✷</span>
            <span>Acme books</span>
          </div>
          <div className="craft-preview__actions">
            <button type="button" className="craft-preview__btn craft-preview__btn--ghost">
              Cancel
            </button>
            <button type="button" className="craft-preview__btn craft-preview__btn--primary">
              Save invoice
            </button>
          </div>
        </header>

        <section className="craft-preview__kpis">
          {[
            { label: 'Revenue', value: '$24.8K', delta: '+12%' },
            { label: 'Outstanding', value: '$4.6K', delta: '−4%' },
            { label: 'Customers', value: '142', delta: '+8%' },
          ].map((kpi) => (
            <div key={kpi.label} className="craft-preview__kpi">
              <div className="craft-preview__kpi-label">{kpi.label}</div>
              <div className="craft-preview__kpi-value">{kpi.value}</div>
              <div className="craft-preview__kpi-delta">{kpi.delta}</div>
            </div>
          ))}
        </section>

        <section className="craft-preview__form">
          <label className="craft-preview__field">
            <span className="craft-preview__field-label">Email</span>
            <input type="email" className="craft-preview__input" defaultValue="ada@example.com" />
          </label>
          <div className="craft-preview__chips">
            <span className="craft-preview__chip craft-preview__chip--success">Paid</span>
            <span className="craft-preview__chip craft-preview__chip--warning">Pending</span>
            <span className="craft-preview__chip craft-preview__chip--danger">Overdue</span>
          </div>
        </section>
      </div>
    </div>
  );
}
