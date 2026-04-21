import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders title as h2 by default', () => {
    render(<SectionHeader title="Billing" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Billing' })).toBeInTheDocument();
  });

  it('honors level override', () => {
    render(<SectionHeader title="Invoices" level={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Invoices' })).toBeInTheDocument();
  });

  it('renders description and actions', () => {
    render(
      <SectionHeader
        title="Team members"
        description="Invite collaborators to your workspace."
        actions={<button type="button">Invite</button>}
      />,
    );
    expect(screen.getByText('Invite collaborators to your workspace.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SectionHeader
        title="Billing"
        description="Manage payment methods and invoices."
        actions={<button type="button">Add payment method</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
