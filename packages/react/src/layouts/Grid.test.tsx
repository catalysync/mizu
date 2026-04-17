import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <p>Child</p>
      </Grid>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-grid class', () => {
    const { container } = render(<Grid>X</Grid>);
    expect(container.firstChild).toHaveClass('mizu-grid');
  });

  it('sets data-component', () => {
    const { container } = render(<Grid>X</Grid>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-grid');
  });

  it('merges custom className', () => {
    const { container } = render(<Grid className="custom">X</Grid>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref}>X</Grid>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Grid gap="1rem">X</Grid>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as specified element when as prop is set', () => {
    const { container } = render(<Grid as="section">X</Grid>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Grid>
        <p>Content</p>
      </Grid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
