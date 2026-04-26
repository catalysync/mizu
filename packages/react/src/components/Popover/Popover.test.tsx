import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Popover, PopoverContent, PopoverTrigger } from './Popover';

describe('Popover', () => {
  it('opens on trigger click and renders content', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body content</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText('Body content')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('respects defaultOpen', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Pre-open</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText('Pre-open')).toBeInTheDocument();
  });

  it('has no axe violations when closed', async () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations when open', async () => {
    const { container } = render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body content</PopoverContent>
      </Popover>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
