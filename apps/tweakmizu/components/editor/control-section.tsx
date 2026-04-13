'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
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
      <div className="flex items-center gap-1 py-1">
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-transparent bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <ChevronRight
            size={12}
            className={cn('transition-transform', isExpanded && 'rotate-90')}
          />
          {title}
        </button>
        {headerAction}
      </div>
      {isExpanded && <div className="flex flex-col gap-2 pb-2 pt-1">{children}</div>}
    </div>
  );
};

export default ControlSection;
