'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editor-store';
import { useThemePresetStore } from '@/store/preset-store';
import { getPresetThemeStyles } from '@/utils/theme-preset-helper';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, Shuffle } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { TooltipWrapper } from '../tooltip-wrapper';

interface ThemePresetSelectProps extends React.ComponentProps<typeof Button> {
  withCycleThemes?: boolean;
}

const ColorBox: React.FC<{ color: string }> = ({ color }) => (
  <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: color }} />
);

const ThemeColors: React.FC<{ presetName: string }> = ({ presetName }) => {
  const styles = getPresetThemeStyles(presetName);
  return (
    <div className="flex gap-0.5">
      <ColorBox color={styles['action-primary-default']} />
      <ColorBox color={styles['surface-default']} />
      <ColorBox color={styles['text-primary']} />
      <ColorBox color={styles['border-default']} />
    </div>
  );
};

const ThemeControls = () => {
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);
  const presets = useThemePresetStore((store) => store.getAllPresets());
  const presetNames = useMemo(() => ['default', ...Object.keys(presets)], [presets]);

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    applyThemePreset(presetNames[random]);
  }, [presetNames, applyThemePreset]);

  return (
    <TooltipWrapper label="Random theme" asChild>
      <Button variant="ghost" size="sm" className="size-6 p-1" onClick={randomize}>
        <Shuffle className="h-3.5 w-3.5" />
      </Button>
    </TooltipWrapper>
  );
};

const ThemeCycleButton: React.FC<
  React.ComponentProps<typeof Button> & { direction: 'prev' | 'next' }
> = ({ direction, onClick, className, ...props }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn('aspect-square h-full shrink-0', className)}
        onClick={onClick}
        {...props}
      >
        {direction === 'prev' ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{direction === 'prev' ? 'Previous theme' : 'Next theme'}</TooltipContent>
  </Tooltip>
);

const ThemePresetCycleControls: React.FC<
  React.ComponentProps<typeof Button> & {
    filteredPresets: string[];
    currentPresetName: string;
  }
> = ({ filteredPresets, currentPresetName, className, ...props }) => {
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);

  const currentIndex = useMemo(
    () => filteredPresets.indexOf(currentPresetName || 'default') ?? 0,
    [filteredPresets, currentPresetName],
  );

  const cycleTheme = useCallback(
    (direction: 'prev' | 'next') => {
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % filteredPresets.length
          : (currentIndex - 1 + filteredPresets.length) % filteredPresets.length;
      applyThemePreset(filteredPresets[newIndex]);
    },
    [currentIndex, filteredPresets, applyThemePreset],
  );

  return (
    <>
      <Separator orientation="vertical" className="min-h-8" />
      <ThemeCycleButton
        direction="prev"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('prev')}
        {...props}
      />
      <Separator orientation="vertical" className="min-h-8" />
      <ThemeCycleButton
        direction="next"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('next')}
        {...props}
      />
    </>
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  withCycleThemes = true,
  className,
  ...props
}) => {
  const themeState = useEditorStore((store) => store.themeState);
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);
  const hasUnsavedChanges = useEditorStore((store) => store.hasUnsavedChanges);
  const currentPreset = themeState.preset;

  const presets = useThemePresetStore((store) => store.getAllPresets());
  const [search, setSearch] = useState('');

  const presetNames = useMemo(() => ['default', ...Object.keys(presets)], [presets]);
  const currentPresetName = presetNames.find((name) => name === currentPreset);

  const filteredPresets = useMemo(() => {
    const list =
      search.trim() === ''
        ? presetNames
        : presetNames.filter((name) => {
            if (name === 'default') return 'default'.includes(search.toLowerCase());
            return presets[name]?.label?.toLowerCase().includes(search.toLowerCase());
          });

    const sorted = [...list].sort((a, b) => {
      if (a === 'default') return -1;
      if (b === 'default') return 1;
      const labelA = presets[a]?.label || a;
      const labelB = presets[b]?.label || b;
      return labelA.localeCompare(labelB);
    });

    return sorted;
  }, [presetNames, search, presets]);

  return (
    <div className="flex w-full items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn('group relative w-full justify-between md:min-w-56', className)}
            {...props}
          >
            <div className="flex w-full items-center gap-3 overflow-hidden">
              <div className="flex gap-0.5">
                <ColorBox color={themeState.styles['action-primary-default']} />
                <ColorBox color={themeState.styles['surface-default']} />
                <ColorBox color={themeState.styles['text-primary']} />
                <ColorBox color={themeState.styles['border-default']} />
              </div>
              <span className="truncate text-left font-medium capitalize">
                {presets[currentPresetName || 'default']?.label || currentPresetName || 'Default'}
                {hasUnsavedChanges() && '*'}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="center">
          <Command className="w-full">
            <div className="flex w-full items-center border-b px-3 py-1">
              <Search className="size-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search themes..."
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {filteredPresets.length} theme{filteredPresets.length !== 1 ? 's' : ''}
              </div>
              <ThemeControls />
            </div>
            <Separator />
            <CommandList className="max-h-[500px]">
              <CommandEmpty>No themes found.</CommandEmpty>
              <CommandGroup heading="Mizu Themes">
                {filteredPresets.map((presetName, index) => (
                  <CommandItem
                    key={`${presetName}-${index}`}
                    value={`${presetName}-${index}`}
                    onSelect={() => {
                      applyThemePreset(presetName);
                      setSearch('');
                    }}
                    className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                  >
                    {presetName !== 'default' && <ThemeColors presetName={presetName} />}
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-sm font-medium capitalize">
                        {presets[presetName]?.label || 'Default'}
                      </span>
                      {presets[presetName]?.description && (
                        <span className="text-muted-foreground truncate text-xs">
                          {presets[presetName].description}
                        </span>
                      )}
                    </div>
                    {presetName === currentPresetName && (
                      <Check className="h-4 w-4 shrink-0 opacity-70" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {withCycleThemes && (
        <ThemePresetCycleControls
          filteredPresets={filteredPresets}
          currentPresetName={currentPresetName || 'default'}
          className={className}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};

export default ThemePresetSelect;
