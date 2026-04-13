import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';

function TestHoverCard({ open = false }: { open?: boolean }) {
  return (
    <HoverCard open={open}>
      <HoverCardTrigger asChild>
        <a href="https://example.com">Hover me</a>
      </HoverCardTrigger>
      <HoverCardContent>
        <p>Card content</p>
      </HoverCardContent>
    </HoverCard>
  );
}

describe('HoverCard', () => {
  it('renders trigger', () => {
    render(<TestHoverCard />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<TestHoverCard />);
    expect(screen.queryByText('Card content')).not.toBeInTheDocument();
  });

  it('shows content when open', () => {
    render(<TestHoverCard open />);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies content class when open', () => {
    render(<TestHoverCard open />);
    expect(document.querySelector('.mizu-hover-card')).toBeInTheDocument();
  });

  it('renders with arrow', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger asChild>
          <a href="https://example.com">Hover</a>
        </HoverCardTrigger>
        <HoverCardContent showArrow>
          <p>With arrow</p>
        </HoverCardContent>
      </HoverCard>,
    );
    expect(document.querySelector('.mizu-hover-card__arrow')).toBeInTheDocument();
  });

  it('has no axe violations (closed)', async () => {
    const { container } = render(<TestHoverCard />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (open)', async () => {
    render(<TestHoverCard open />);
    // Disable region rule — portaled content renders outside landmarks by design
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
