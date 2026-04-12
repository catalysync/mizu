'use client';

import './knob-panel.css';
import { Badge } from '@aspect/react';
import { PreviewDock } from './preview-dock';

export interface KnobOption<T extends string = string> {
  id: T;
  label: string;
  hint: string;
}

export interface KnobSection {
  title: string;
  hint?: string;
  type: 'options' | 'chips';
  options: KnobOption[];
  value: string;
  onChange: (value: string) => void;
}

interface KnobPanelProps {
  cluster: string;
  clusterLabel: string;
  title: string;
  description: string;
  sections: KnobSection[];
}

export function KnobPanel({ cluster, clusterLabel, title, description, sections }: KnobPanelProps) {
  return (
    <div className="craft-knob-panel">
      <header className="craft-knob-panel__header">
        <Badge tone="neutral">{clusterLabel}</Badge>
        <h1 className="craft-knob-panel__title">{title}</h1>
        <p className="craft-knob-panel__lede">{description}</p>
      </header>

      <div className="craft-knob-panel__grid">
        <div className="craft-knob-panel__controls">
          {sections.map((section) => (
            <section key={section.title} className="craft-knob-panel__section">
              <div className="craft-knob-panel__section-head">
                <h2 className="craft-knob-panel__section-title">{section.title}</h2>
                {section.hint ? (
                  <p className="craft-knob-panel__section-hint">{section.hint}</p>
                ) : null}
              </div>
              {section.type === 'chips' ? (
                <div className="craft-knob-panel__chip-row">
                  {section.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="craft-knob-panel__chip"
                      data-active={section.value === opt.id || undefined}
                      onClick={() => section.onChange(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="craft-knob-panel__options">
                  {section.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="craft-knob-panel__option"
                      data-active={section.value === opt.id || undefined}
                      onClick={() => section.onChange(opt.id)}
                    >
                      <span className="craft-knob-panel__option-label">{opt.label}</span>
                      <span className="craft-knob-panel__option-hint">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
        <aside className="craft-knob-panel__preview">
          <PreviewDock />
        </aside>
      </div>
    </div>
  );
}
