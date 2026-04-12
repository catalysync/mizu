import * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
}

function icon(displayName: string, path: string, opts?: { strokeWidth?: number }) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(({ size = 16, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={opts?.strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d={path} />
    </svg>
  ));
  Component.displayName = displayName;
  return Component;
}

export const ChevronDown = icon('ChevronDown', 'm6 9 6 6 6-6');
export const ChevronRight = icon('ChevronRight', 'm9 18 6-6-6-6');
export const X = icon('X', 'M18 6 6 18M6 6l12 12');
export const Check = icon('Check', 'M20 6 9 17l-5-5', { strokeWidth: 3 });
export const Search = icon('Search', 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z');
export const ArrowRight = icon('ArrowRight', 'M5 12h14M12 5l7 7-7 7');
