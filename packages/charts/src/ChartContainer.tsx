import { cn } from '@aspect/react';
import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import type { ChartConfig } from './utils/types';

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

export function useChartContext(): ChartContextValue {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error('useChartContext must be used within a <ChartContainer />');
  return ctx;
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  height?: number | string;
  children: React.ReactElement;
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, height = 320, className, children, style, ...props }, ref) => (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn('mizu-chart', className)}
        data-component="mizu-chart"
        style={{ height, ...style }}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  ),
);
ChartContainer.displayName = 'ChartContainer';
