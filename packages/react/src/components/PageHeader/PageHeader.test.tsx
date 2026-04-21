import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title as h1 by default', () => {
    render(<PageHeader title="Customers" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Customers' })).toBeInTheDocument();
  });

  it('renders breadcrumbs / description / actions / toolbar slots', () => {
    render(
      <PageHeader
        title="Customers"
        breadcrumbs={<nav aria-label="Breadcrumb">Home / Customers</nav>}
        description="All active and archived customers."
        actions={<button type="button">Invite</button>}
        toolbar={<div role="toolbar">filters</div>}
      />,
    );
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('All active and archived customers.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('honors level override', () => {
    render(<PageHeader title="Customers" level={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PageHeader
        title="Customers"
        description="All customers."
        actions={<button type="button">Invite</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
