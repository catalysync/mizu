import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
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

  it('maps gap steps to the spacing scale', () => {
    const { container } = render(<Stack gap="4">X</Stack>);
    expect(container.firstChild).toHaveStyle({ '--mizu-stack-gap': 'var(--mizu-spacing-4)' });
  });

  it('maps gap="none" to spacing-0', () => {
    const { container } = render(<Stack gap="none">X</Stack>);
    expect(container.firstChild).toHaveStyle({ '--mizu-stack-gap': 'var(--mizu-spacing-0)' });
  });

  it('rejects gap values outside the scale at the type level', () => {
    // @ts-expect-error raw CSS lengths are not part of the spacing scale
    const bad = <Stack gap="13px">X</Stack>;
    // @ts-expect-error rem strings are not part of the spacing scale
    const alsoBad = <Stack gap="1rem">X</Stack>;
    expect([bad, alsoBad]).toHaveLength(2);
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
