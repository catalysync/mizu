'use client';

import React, { useCallback } from 'react';
import type { ColorPickerProps } from '@/types';

export const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.25rem 0.5rem',
        margin: '0 -0.25rem',
        borderRadius: 'var(--mizu-radius-md)',
        transition: 'background-color var(--mizu-duration-fast) var(--mizu-easing-out)',
      }}
    >
      <label
        style={{
          position: 'relative',
          width: '1.75rem',
          height: '1.75rem',
          flexShrink: 0,
          borderRadius: 'var(--mizu-radius-sm)',
          border: '1px solid var(--mizu-border-default)',
          background: color,
          cursor: 'pointer',
          boxShadow: 'var(--mizu-shadow-sm)',
        }}
      >
        <input
          type="color"
          value={color}
          onChange={handleChange}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
          aria-label={`${label} color picker`}
        />
      </label>

      <span
        style={{
          flexShrink: 0,
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--mizu-text-primary)',
        }}
      >
        {label}
      </span>

      <input
        type="text"
        value={color}
        onChange={handleChange}
        className="mizu-input"
        aria-label={`${label} hex value`}
        style={{
          flex: 1,
          minWidth: 0,
          height: '1.75rem',
          padding: '0 0.5rem',
          fontSize: '12px',
          fontFamily: 'var(--mizu-font-family-mono)',
          textAlign: 'right',
        }}
      />
    </div>
  );
};

export default ColorPicker;
