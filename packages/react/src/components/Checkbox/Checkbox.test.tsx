import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="Toggle" onCheckedChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox label="I agree" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
