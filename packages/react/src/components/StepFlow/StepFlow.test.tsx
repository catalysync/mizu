import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { StepFlow } from './StepFlow';

const STEPS = [
  { id: 'customer', title: 'Customer' },
  { id: 'items', title: 'Line items' },
  { id: 'review', title: 'Review' },
];

describe('StepFlow', () => {
  it('renders all steps as tabs', () => {
    render(
      <StepFlow steps={STEPS} activeStep="customer">
        panel
      </StepFlow>,
    );
    expect(screen.getAllByRole('tab').length).toBe(3);
  });

  it('marks the active step as selected and prior steps as complete', () => {
    render(
      <StepFlow steps={STEPS} activeStep="items">
        panel
      </StepFlow>,
    );
    const customer = screen.getByRole('tab', { name: /Customer/ });
    const items = screen.getByRole('tab', { name: /Line items/ });
    const review = screen.getByRole('tab', { name: /Review/ });
    expect(customer).toHaveAttribute('data-status', 'complete');
    expect(items).toHaveAttribute('data-status', 'current');
    expect(items).toHaveAttribute('aria-selected', 'true');
    expect(review).toHaveAttribute('data-status', 'pending');
  });

  it('calls onStepChange when a reachable step is clicked', () => {
    const onStepChange = vi.fn();
    render(
      <StepFlow steps={STEPS} activeStep="items" onStepChange={onStepChange}>
        panel
      </StepFlow>,
    );
    fireEvent.click(screen.getByRole('tab', { name: /Customer/ }));
    expect(onStepChange).toHaveBeenCalledWith('customer');
  });

  it('blocks jumping ahead unless allowSkip is true', () => {
    render(
      <StepFlow steps={STEPS} activeStep="customer">
        panel
      </StepFlow>,
    );
    const review = screen.getByRole('tab', { name: /Review/ });
    expect(review).toBeDisabled();
  });

  it('allows jumping ahead when allowSkip is true', () => {
    render(
      <StepFlow steps={STEPS} activeStep="customer" allowSkip>
        panel
      </StepFlow>,
    );
    expect(screen.getByRole('tab', { name: /Review/ })).not.toBeDisabled();
  });

  it('renders the active panel content', () => {
    render(
      <StepFlow steps={STEPS} activeStep="items">
        <p>Line items panel</p>
      </StepFlow>,
    );
    expect(screen.getByText('Line items panel')).toBeInTheDocument();
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('aria-labelledby', 'items-tab');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <StepFlow steps={STEPS} activeStep="items">
        <p>Panel content</p>
      </StepFlow>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
