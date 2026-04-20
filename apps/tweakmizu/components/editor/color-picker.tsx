'use client';

import type { ColorPickerProps } from '@/types';
import React, { useCallback } from 'react';

export const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return (
    <div className="-mx-1 flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors">
      <label
        className="border-border relative block size-7 shrink-0 cursor-pointer rounded-sm border shadow-sm"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          value={color}
          onChange={handleChange}
          aria-label={`${label} color picker`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>

      <span className="text-foreground shrink-0 text-[13px] font-medium">{label}</span>

      <input
        type="text"
        value={color}
        onChange={handleChange}
        aria-label={`${label} hex value`}
        className="mizu-input min-w-0 flex-1 text-right font-mono text-xs"
        style={{ height: '1.75rem' }}
      />
    </div>
  );
};

export default ColorPicker;
