import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

function TestCollapsible({ open }: { open?: boolean }) {
  return (
    <Collapsible open={open}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Hidden content</CollapsibleContent>
    </Collapsible>
  );
}

describe('Collapsible', () => {
  it('renders trigger', () => {
    render(<TestCollapsible />);
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    render(<TestCollapsible />);
    expect(document.querySelector('.mizu-collapsible__content')).toHaveAttribute(
      'data-state',
      'closed',
    );
  });

  it('shows content when open', () => {
    render(<TestCollapsible open />);
    expect(screen.getByText('Hidden content')).toBeVisible();
  });

  it('toggles on click', async () => {
    render(<TestCollapsible />);
    await userEvent.setup().click(screen.getByText('Toggle'));
    expect(screen.getByText('Hidden content')).toBeVisible();
  });

  it('applies content class', () => {
    render(<TestCollapsible open />);
    expect(document.querySelector('.mizu-collapsible__content')).toBeInTheDocument();
  });

  it('has no axe violations (closed)', async () => {
    const { container } = render(<TestCollapsible />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (open)', async () => {
    const { container } = render(<TestCollapsible open />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
