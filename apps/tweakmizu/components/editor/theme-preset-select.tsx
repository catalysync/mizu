'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from '@aspect/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, Shuffle } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/store/preset-store';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';
import { cn } from '@/utils/cn';

const ColorBox: React.FC<{ color: string }> = ({ color }) => (
  <div className="size-3 rounded-sm border border-border" style={{ backgroundColor: color }} />
);

const PresetSwatch: React.FC<{ name: string }> = ({ name }) => {
  const styles = getPresetThemeStyles(name);
  return (
    <div className="flex gap-0.5">
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
    <div className="flex h-14 items-center px-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex-1 justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {currentName !== 'default' && <PresetSwatch name={currentName} />}
              <span className="font-medium capitalize">
                {currentLabel}
                {hasUnsaved() && '*'}
              </span>
            </div>
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[360px] p-0">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <Search size={14} className="shrink-0 text-muted-foreground" />
            <input
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent py-0.5 font-sans text-sm text-foreground outline-none"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
            <span>{filtered.length} themes</span>
            <Button variant="ghost" size="sm" onClick={randomize} aria-label="Random theme">
              <Shuffle size={14} />
            </Button>
          </div>
          <ScrollArea className="h-[360px]">
            <div className="flex flex-col p-1">
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
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 rounded-sm border-none px-2.5 py-2 text-left',
                      isActive ? 'bg-muted' : 'bg-transparent',
                    )}
                  >
                    {name !== 'default' && <PresetSwatch name={name} />}
                    <span className="flex-1 text-[13px] font-medium capitalize">
                      {presets[name]?.label ?? 'Default'}
                    </span>
                    {isActive && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div className="ml-1 flex items-center gap-0.5">
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
