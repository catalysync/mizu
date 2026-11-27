import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AppContent, AppContentHeader } from './AppContent';

describe('AppContent', () => {
  it('renders a main landmark by default', () => {
    const { container } = render(<AppContent>Body</AppContent>);
    expect(container.querySelector('main')).not.toBeNull();
  });

  it('renders no main element when as="div"', () => {
    const { container } = render(<AppContent as="div">Body</AppContent>);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('div[data-component="mizu-app-content"]')).toBeInTheDocument();
  });

  it('passes an axe check', async () => {
    const { container } = render(<AppContent>Body</AppContent>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AppContentHeader', () => {
  it('renders the title as h1 by default', () => {
    render(<AppContentHeader title="Orders" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument();
  });

  it('renders the title at the given level', () => {
    render(<AppContentHeader title="Shipping" level={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Shipping' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
