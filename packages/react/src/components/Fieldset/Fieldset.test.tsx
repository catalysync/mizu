import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a fieldset with a legend', () => {
    render(
      <Fieldset legend="Contact details">
        <input type="text" aria-label="name" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Contact details' });
    expect(group.tagName).toBe('FIELDSET');
  });

  it('renders the description when provided', () => {
    render(
      <Fieldset legend="Billing" description="How you want to be charged">
        <input type="text" aria-label="card" />
      </Fieldset>,
    );
    expect(screen.getByText('How you want to be charged')).toBeInTheDocument();
  });

  it('marks the fieldset element as disabled', () => {
    render(
      <Fieldset legend="Shipping" disabled>
        <input type="text" aria-label="address" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Shipping' });
    expect(group).toBeDisabled();
    expect(group).toHaveAttribute('data-disabled', 'true');
  });

  it('omits legend and description when not provided', () => {
    const { container } = render(
      <Fieldset>
        <input type="text" aria-label="x" />
      </Fieldset>,
    );
    expect(container.querySelector('legend')).toBeNull();
    expect(container.querySelector('.mizu-fieldset__description')).toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Fieldset legend="Contact" description="We never share your details">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </Fieldset>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
