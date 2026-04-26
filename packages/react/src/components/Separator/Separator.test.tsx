import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Separator } from './Separator';

describe('Separator', () => {
  it('renders with default horizontal orientation', () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector('[data-component="mizu-separator"]');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('honors vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.querySelector('[data-component="mizu-separator"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
  });

  it('forwards className', () => {
    const { container } = render(<Separator className="my-custom" />);
    expect(container.querySelector('.mizu-separator.my-custom')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <p>before</p>
        <Separator />
        <p>after</p>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
