'use client';

import './knob-panel.css';
import { useState, useMemo, useRef, useEffect } from 'react';
import { fontOptionsByCategory, loadGoogleFont, type FontCategory } from '@/utils/fonts';
import { useCraftStore } from '@/store/craft-store';

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

export interface KnobSectionFontPicker {
  title: string;
  hint?: string;
  demo?: React.ReactNode;
  type: 'font-picker';
  category: 'sans' | 'serif' | 'mono';
  value: string;
  onChange: (value: string) => void;
}

export type KnobSection =
  | KnobSectionChoice
  | KnobSectionToggle
  | KnobSectionText
  | KnobSectionFontPicker;

interface KnobPanelProps {
  title: string;
  description: string;
  sections: KnobSection[];
  /** Optional note shown below description (e.g. "switch to a form page to see changes") */
  note?: string;
  /** Auto-switch preview to a page matching this path pattern on mount */
  preferPreviewPage?: string;
}

export function KnobPanel({
  title,
  description,
  sections,
  note,
  preferPreviewPage,
}: KnobPanelProps) {
  const pages = useCraftStore((s) => s.profile.app?.pages ?? []);
  const setPreviewPath = useCraftStore((s) => s.setPreviewPath);

  // Auto-switch preview to a relevant page on mount
  useEffect(() => {
    if (!preferPreviewPage) return;
    const match = pages.find(
      (p) =>
        p.path.includes(preferPreviewPage) || p.title.toLowerCase().includes(preferPreviewPage),
    );
    if (match) setPreviewPath(match.path);
  }, [preferPreviewPage, pages, setPreviewPath]);

  return (
    <div className="craft-knob-panel">
      <header className="craft-knob-panel__header">
        <h1 className="craft-knob-panel__title">{title}</h1>
        <p className="craft-knob-panel__lede">{description}</p>
        {note ? <p className="craft-knob-panel__note">{note}</p> : null}
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
                  aria-label={section.title}
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
              ) : section.type === 'font-picker' ? (
                <FontPicker
                  category={section.category}
                  value={section.value}
                  onChange={section.onChange}
                  label={section.title}
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
        {/* Preview is in the persistent craft-shell layout */}
      </div>
    </div>
  );
}

function FontPicker({
  category,
  value,
  onChange,
  label,
}: {
  category: FontCategory;
  value: string;
  onChange: (family: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fonts = useMemo(() => fontOptionsByCategory(category), [category]);
  const filtered = useMemo(() => {
    if (!search) return fonts;
    const q = search.toLowerCase();
    return fonts.filter((f) => f.family.toLowerCase().includes(q));
  }, [fonts, search]);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filtered]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
    if (item) item.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  const handleSelect = (family: string) => {
    const font = fonts.find((f) => f.family === family);
    if (font) loadGoogleFont(font);
    onChange(family);
    setOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          handleSelect(filtered[highlightedIndex].family);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setOpen(false);
        setSearch('');
        setHighlightedIndex(-1);
        break;
      }
    }
  };

  const listboxId = `font-picker-listbox-${category}`;
  const activeDescendant =
    highlightedIndex >= 0 ? `font-option-${category}-${highlightedIndex}` : undefined;

  return (
    <div className="craft-font-picker" ref={ref}>
      <button
        type="button"
        className="craft-font-picker__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label ? `${label}: ${value}` : value}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        style={{ fontFamily: `"${value}", system-ui, sans-serif` }}
      >
        <span className="craft-font-picker__value">{value}</span>
        <span className="craft-font-picker__arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="craft-font-picker__dropdown" role="dialog" aria-label="Font picker">
          <input
            ref={inputRef}
            type="text"
            className="craft-font-picker__search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts..."
            aria-label="Search fonts"
            aria-activedescendant={activeDescendant}
            aria-controls={listboxId}
            role="combobox"
            aria-expanded={true}
          />
          <div
            ref={listRef}
            id={listboxId}
            className="craft-font-picker__list"
            role="listbox"
            aria-label="Font options"
          >
            {filtered.map((font, index) => (
              <button
                key={font.family}
                id={`font-option-${category}-${index}`}
                type="button"
                role="option"
                aria-selected={font.family === value}
                className="craft-font-picker__item"
                data-active={font.family === value || undefined}
                data-highlighted={index === highlightedIndex || undefined}
                data-index={index}
                onClick={() => handleSelect(font.family)}
                onMouseEnter={() => {
                  loadGoogleFont(font);
                  setHighlightedIndex(index);
                }}
                style={{ fontFamily: `"${font.family}", system-ui, sans-serif` }}
              >
                {font.family}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="craft-font-picker__empty">No fonts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
