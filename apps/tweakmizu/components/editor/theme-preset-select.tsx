'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea, Stack } from '@aspect/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, Shuffle } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/store/preset-store';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';

const ColorBox: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: 'var(--mizu-radius-sm)',
      border: '1px solid var(--mizu-border-default)',
      backgroundColor: color,
    }}
  />
);

const PresetSwatch: React.FC<{ name: string }> = ({ name }) => {
  const styles = getPresetThemeStyles(name);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <ColorBox color={styles['action-primary-default']} />
      <ColorBox color={styles['surface-default']} />
      <ColorBox color={styles['text-primary']} />
      <ColorBox color={styles['border-default']} />
    </div>
  );
};

export default function ThemePresetSelect() {
  const themeState = useEditorStore((s) => s.themeState);
  const applyPreset = useEditorStore((s) => s.applyThemePreset);
  const hasUnsaved = useEditorStore((s) => s.hasUnsavedChanges);

  const presets = useThemePresetStore((s) => s.getAllPresets());
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const presetNames = useMemo(() => ['default', ...Object.keys(presets)], [presets]);
  const currentName = presetNames.find((n) => n === themeState.preset) ?? 'default';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? presetNames.filter((n) => {
          if (n === 'default') return 'default'.includes(q);
          return presets[n]?.label?.toLowerCase().includes(q);
        })
      : presetNames;
    return [...list].sort((a, b) => {
      if (a === 'default') return -1;
      if (b === 'default') return 1;
      return (presets[a]?.label ?? a).localeCompare(presets[b]?.label ?? b);
    });
  }, [presetNames, search, presets]);

  const randomize = useCallback(() => {
    const i = Math.floor(Math.random() * presetNames.length);
    applyPreset(presetNames[i]);
  }, [presetNames, applyPreset]);

  const cycle = useCallback(
    (dir: 'prev' | 'next') => {
      const idx = filtered.indexOf(currentName);
      const next =
        dir === 'next'
          ? (idx + 1) % filtered.length
          : (idx - 1 + filtered.length) % filtered.length;
      applyPreset(filtered[next]);
    },
    [filtered, currentName, applyPreset],
  );

  const currentLabel = presets[currentName]?.label ?? 'Default';

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '3.5rem', padding: '0 0.5rem' }}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            style={{ flex: 1, justifyContent: 'space-between', gap: '0.75rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              {currentName !== 'default' && <PresetSwatch name={currentName} />}
              <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                {currentLabel}
                {hasUnsaved() && '*'}
              </span>
            </div>
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent style={{ width: 360, padding: 0 }} align="start">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderBottom: '1px solid var(--mizu-border-default)',
            }}
          >
            <Search size={14} style={{ color: 'var(--mizu-text-secondary)' }} />
            <input
              className="mizu-input"
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', padding: 0 }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.375rem 0.75rem',
              fontSize: 12,
              color: 'var(--mizu-text-secondary)',
            }}
          >
            <span>{filtered.length} themes</span>
            <Button variant="ghost" size="sm" onClick={randomize}>
              <Shuffle size={14} />
            </Button>
          </div>
          <ScrollArea style={{ maxHeight: 380 }}>
            <Stack gap="0" style={{ padding: '0.25rem' }}>
              {filtered.map((name) => {
                const isActive = name === currentName;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      applyPreset(name);
                      setSearch('');
                      setOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.625rem',
                      borderRadius: 'var(--mizu-radius-sm)',
                      border: 'none',
                      background: isActive ? 'var(--mizu-surface-secondary)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {name !== 'default' && <PresetSwatch name={name} />}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {presets[name]?.label ?? 'Default'}
                    </span>
                    {isActive && <Check size={14} />}
                  </button>
                );
              })}
            </Stack>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: '0.25rem' }}>
        <Button variant="ghost" size="sm" onClick={() => cycle('prev')} aria-label="Previous theme">
          <ArrowLeft size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => cycle('next')} aria-label="Next theme">
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}
