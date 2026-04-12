import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Center } from './Center';

describe('Center', () => {
  it('renders children', () => {
    render(
      <Center>
        <p>Child</p>
      </Center>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-center class', () => {
    const { container } = render(<Center>X</Center>);
    expect(container.firstChild).toHaveClass('mizu-center');
  });

  it('sets data-component', () => {
    const { container } = render(<Center>X</Center>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-center');
  });

  it('merges custom className', () => {
    const { container } = render(<Center className="custom">X</Center>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Center ref={ref}>X</Center>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Center gap="1rem">X</Center>);
    expect(container.firstChild).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Center>
        <p>Content</p>
      </Center>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
