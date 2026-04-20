import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
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

  it('accepts padding prop', () => {
    const { container } = render(<Center padding="1rem">X</Center>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as specified element when as prop is set', () => {
    const { container } = render(<Center as="main">X</Center>);
    expect(container.firstChild?.nodeName).toBe('MAIN');
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
