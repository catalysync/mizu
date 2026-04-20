import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with href', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('defaults to inline variant', () => {
    render(<Link href="/x">Hello</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'inline');
  });

  it('supports subtle and standalone variants', () => {
    const { rerender } = render(
      <Link href="/" variant="subtle">
        Link
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'subtle');

    rerender(
      <Link href="/" variant="standalone">
        Link
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'standalone');
  });

  it('adds target="_blank" and rel when external', () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(link).toHaveAttribute('data-external', 'true');
  });

  it('preserves user-supplied rel alongside security tokens', () => {
    render(
      <Link href="https://example.com" external rel="author">
        External
      </Link>,
    );
    const rel = screen.getByRole('link').getAttribute('rel') ?? '';
    expect(rel).toContain('author');
    expect(rel).toContain('noopener');
  });

  it('does not force target/rel when external is false', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <p>
        Visit <Link href="/docs">our docs</Link> for details.
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
