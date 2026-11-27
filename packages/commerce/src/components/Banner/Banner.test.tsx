import { Banner as CoreBanner } from '@mizunagara/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Banner } from '../../index';

describe('Banner (commerce import path)', () => {
  it('resolves to the core Banner component', () => {
    expect(Banner).toBe(CoreBanner);
  });

  it('renders the title and children', () => {
    render(
      <Banner title="Low stock" tone="warning">
        Three products are running out.
      </Banner>,
    );
    expect(screen.getByText('Low stock')).toBeInTheDocument();
    expect(screen.getByText('Three products are running out.')).toBeInTheDocument();
  });

  it('uses role status for non-critical tones and alert for critical', () => {
    const { rerender } = render(<Banner tone="info">Info</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Banner tone="critical">Failed</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
