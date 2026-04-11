'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { ControlSectionProps } from '@/types';

const ControlSection = ({
  title,
  children,
  expanded = false,
  headerAction,
}: ControlSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0' }}>
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.125rem 0.5rem',
            borderRadius: 'var(--mizu-radius-sm)',
            background: 'var(--mizu-surface-secondary)',
            color: 'var(--mizu-text-secondary)',
            border: '1px solid transparent',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <ChevronRight
            size={12}
            style={{
              transform: isExpanded ? 'rotate(90deg)' : undefined,
              transition: 'transform var(--mizu-duration-fast) var(--mizu-easing-out)',
            }}
          />
          {title}
        </button>
        {headerAction}
      </div>
      {isExpanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.25rem 0 0.5rem',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ControlSection;
