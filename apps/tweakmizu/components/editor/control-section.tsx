'use client';

import type { ControlSectionProps } from '@/types';
import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

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
          className="bg-muted text-muted-foreground inline-flex cursor-pointer items-center gap-1 rounded-sm border border-transparent px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase"
        >
          <ChevronRight
            size={12}
            className={cn('transition-transform', isExpanded && 'rotate-90')}
          />
          {title}
        </button>
        {headerAction}
      </div>
      {isExpanded && <div className="flex flex-col gap-2 pt-1 pb-2">{children}</div>}
    </div>
  );
};

export default ControlSection;
