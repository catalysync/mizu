import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Cluster } from './Cluster';

describe('Cluster', () => {
  it('renders children', () => {
    render(
      <Cluster>
        <p>Child</p>
      </Cluster>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-cluster class', () => {
    const { container } = render(<Cluster>X</Cluster>);
    expect(container.firstChild).toHaveClass('mizu-cluster');
  });

  it('sets data-component', () => {
    const { container } = render(<Cluster>X</Cluster>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-cluster');
  });

  it('merges custom className', () => {
    const { container } = render(<Cluster className="custom">X</Cluster>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Cluster ref={ref}>X</Cluster>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Cluster gap="1rem">X</Cluster>);
    expect(container.firstChild).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Cluster>
        <p>Content</p>
      </Cluster>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
