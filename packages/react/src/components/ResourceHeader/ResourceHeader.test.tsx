import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ResourceHeader } from './ResourceHeader';

describe('ResourceHeader', () => {
  it('renders title as h1 by default', () => {
    render(<ResourceHeader title="Acme Corp" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Acme Corp' })).toBeInTheDocument();
  });

  it('honors level override', () => {
    render(<ResourceHeader title="Acme Corp" level={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Acme Corp' })).toBeInTheDocument();
  });

  it('renders subtitle / eyebrow / status / actions slots', () => {
    render(
      <ResourceHeader
        title="Acme Corp"
        eyebrow={<span>Customer</span>}
        subtitle="Account #12345"
        status={<span>Active</span>}
        actions={<button type="button">Edit</button>}
      />,
    );
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Account #12345')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders meta entries as a description list', () => {
    render(
      <ResourceHeader
        title="Acme Corp"
        meta={[
          { label: 'Created', value: 'Jan 1, 2026' },
          { label: 'Owner', value: 'Sarah Chen' },
        ]}
      />,
    );
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2026')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });

  it('has no axe violations in a rich configuration', async () => {
    const { container } = render(
      <ResourceHeader
        title="Acme Corp"
        eyebrow="Customer"
        subtitle="Account #12345"
        status={<span aria-label="status: active">Active</span>}
        actions={<button type="button">Edit</button>}
        meta={[{ label: 'Created', value: 'Jan 1, 2026' }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
