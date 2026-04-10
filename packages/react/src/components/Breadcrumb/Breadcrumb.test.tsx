import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Breadcrumb, BreadcrumbLink, BreadcrumbCurrent } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders navigation landmark', () => {
    render(
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbCurrent>Page</BreadcrumbCurrent>
      </Breadcrumb>,
    );
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbCurrent>Page</BreadcrumbCurrent>
      </Breadcrumb>,
    );
    expect(container.querySelector('.mizu-breadcrumb__separator')).toBeInTheDocument();
  });

  it('applies aria-current to current page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbCurrent>Current</BreadcrumbCurrent>
      </Breadcrumb>,
    );
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        <BreadcrumbCurrent>Widget</BreadcrumbCurrent>
      </Breadcrumb>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
