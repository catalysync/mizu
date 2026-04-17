import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <p>Child</p>
      </Stack>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('applies the mizu-stack class', () => {
    const { container } = render(<Stack>X</Stack>);
    expect(container.firstChild).toHaveClass('mizu-stack');
  });

  it('sets data-component', () => {
    const { container } = render(<Stack>X</Stack>);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-stack');
  });

  it('merges custom className', () => {
    const { container } = render(<Stack className="custom">X</Stack>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref}>X</Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('accepts gap prop', () => {
    const { container } = render(<Stack gap="1rem">X</Stack>);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders as specified element when as prop is set', () => {
    const { container } = render(<Stack as="section">X</Stack>);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Stack>
        <p>Content</p>
      </Stack>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
