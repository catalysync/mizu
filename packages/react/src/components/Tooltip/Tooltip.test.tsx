import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

function Harness({ children }: { children: React.ReactNode }) {
  // Tooltip needs a TooltipProvider in scope. delayDuration=0 keeps tests
  // synchronous — Radix's default 700ms hover delay would force every test
  // to wait or fake timers.
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>;
}

describe('Tooltip', () => {
  it('renders trigger without content visible by default', () => {
    render(
      <Harness>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tip body</TooltipContent>
        </Tooltip>
      </Harness>,
    );
    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByText('Tip body')).not.toBeInTheDocument();
  });

  it('shows the content on hover', async () => {
    const user = userEvent.setup();
    render(
      <Harness>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tip body</TooltipContent>
        </Tooltip>
      </Harness>,
    );
    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    // Radix renders the tooltip in a portal; multiple matches are fine.
    expect(await screen.findAllByText('Tip body')).not.toHaveLength(0);
  });

  it('has no axe violations when closed', async () => {
    const { container } = render(
      <Harness>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tip body</TooltipContent>
        </Tooltip>
      </Harness>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
