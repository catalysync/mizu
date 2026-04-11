import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children inside the viewport', () => {
    render(
      <ScrollArea style={{ height: 200 }}>
        <div>Scrollable content</div>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ScrollArea style={{ height: 200 }}>
        <div>Content</div>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
