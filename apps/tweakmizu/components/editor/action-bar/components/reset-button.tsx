'use client';

import { Button } from '@aspect/react';
import { RefreshCw } from 'lucide-react';

type ResetButtonProps = React.ComponentProps<typeof Button>;

export function ResetButton(props: ResetButtonProps) {
  return (
    <Button variant="ghost" size="sm" aria-label="Reset to preset defaults" {...props}>
      <RefreshCw size={14} />
      <span style={{ marginLeft: '0.375rem' }}>Reset</span>
    </Button>
  );
}
