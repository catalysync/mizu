'use client';

import './knob-panel.css';
import { PreviewDock } from './preview-dock';

export interface KnobOption<T extends string = string> {
  id: T;
  label: string;
  hint: string;
}

export interface KnobSectionChoice {
  title: string;
  hint?: string;
  demo?: React.ReactNode;
  type: 'options' | 'chips';
  options: KnobOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface KnobSectionToggle {
  title: string;
  hint?: string;
  demo?: React.ReactNode;
  type: 'toggle';
  value: boolean;
  onToggle: (value: boolean) => void;
}

export interface KnobSectionText {
  title: string;
  hint?: string;
  demo?: React.ReactNode;
  type: 'text';
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export type KnobSection = KnobSectionChoice | KnobSectionToggle | KnobSectionText;

interface KnobPanelProps {
  title: string;
  description: string;
  sections: KnobSection[];
}

export function KnobPanel({ title, description, sections }: KnobPanelProps) {
  return (
    <div className="craft-knob-panel">
      <header className="craft-knob-panel__header">
        <h1 className="craft-knob-panel__title">{title}</h1>
        <p className="craft-knob-panel__lede">{description}</p>
      </header>

      <div className="craft-knob-panel__grid">
        <div className="craft-knob-panel__controls">
          {sections.map((section) => (
            <section key={section.title} className="craft-knob-panel__section">
              {section.demo ? <div className="craft-knob-panel__demo">{section.demo}</div> : null}
              <div className="craft-knob-panel__section-head">
                <h2 className="craft-knob-panel__section-title">{section.title}</h2>
                {section.hint ? (
                  <p className="craft-knob-panel__section-hint">{section.hint}</p>
                ) : null}
              </div>
              {section.type === 'toggle' ? (
                <button
                  type="button"
                  className="craft-knob-panel__toggle"
                  role="switch"
                  aria-checked={section.value}
                  onClick={() => section.onToggle(!section.value)}
                >
                  <span
                    className="craft-knob-panel__toggle-track"
                    data-on={section.value || undefined}
                  >
                    <span className="craft-knob-panel__toggle-thumb" />
                  </span>
                  <span>{section.value ? 'On' : 'Off'}</span>
                </button>
              ) : section.type === 'text' ? (
                <input
                  type="text"
                  className="craft-knob-panel__text-input"
                  value={section.value}
                  placeholder={section.placeholder}
                  onChange={(e) => section.onChange(e.target.value)}
                />
              ) : section.type === 'chips' ? (
                <div
                  className="craft-knob-panel__chip-row"
                  role="radiogroup"
                  aria-label={section.title}
                >
                  {section.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      className="craft-knob-panel__chip"
                      aria-checked={section.value === opt.id}
                      data-active={section.value === opt.id || undefined}
                      onClick={() => section.onChange(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="craft-knob-panel__options"
                  role="radiogroup"
                  aria-label={section.title}
                >
                  {section.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      className="craft-knob-panel__option"
                      aria-checked={section.value === opt.id}
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
