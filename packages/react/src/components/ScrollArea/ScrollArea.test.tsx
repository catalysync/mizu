import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the mizu-scroll-area class', () => {
    const { container } = render(
      <ScrollArea>
        <p>X</p>
      </ScrollArea>,
    );
    expect(container.querySelector('.mizu-scroll-area')).toBeInTheDocument();
  });

  it('renders the viewport', () => {
    const { container } = render(
      <ScrollArea>
        <p>X</p>
      </ScrollArea>,
    );
    expect(container.querySelector('.mizu-scroll-area__viewport')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(
      <ScrollArea className="custom">
        <p>X</p>
      </ScrollArea>,
    );
    expect(container.querySelector('.mizu-scroll-area')).toHaveClass('custom');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
