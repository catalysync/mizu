import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the correct semantic element for each level', () => {
    const { rerender } = render(<Heading level={1}>Title</Heading>);
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();

    rerender(<Heading level={3}>Sub</Heading>);
    expect(screen.getByRole('heading', { level: 3, name: 'Sub' })).toBeInTheDocument();
  });

  it('applies the default size for the given level', () => {
    render(<Heading level={1}>H1</Heading>);
    expect(screen.getByText('H1')).toHaveClass('mizu-heading--size-4xl');
  });

  it('respects an explicit size override', () => {
    render(
      <Heading level={1} size="md">
        Tiny H1
      </Heading>,
    );
    expect(screen.getByText('Tiny H1')).toHaveClass('mizu-heading--size-md');
  });

  it('uses the `as` prop to override the element without changing the level', () => {
    render(
      <Heading level={2} as="h4">
        Visual H2 as H4
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Visual H2 as H4' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(
      <Heading level={1} className="custom">
        C
      </Heading>,
    );
    expect(screen.getByText('C')).toHaveClass('mizu-heading', 'custom');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Heading level={1}>Accessible heading</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
