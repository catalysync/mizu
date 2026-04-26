import { render, screen } from '@testing-library/react';
import { Home, type LucideIcon } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Icon, wrapIcon } from './Icon';

describe('Icon', () => {
  it('marks icons without an aria-label as decorative', () => {
    const { container } = render(<Icon icon={Home as LucideIcon} />);
    const svg = container.querySelector('[data-component="mizu-icon"]');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('promotes to role=img when aria-label is provided', () => {
    render(<Icon icon={Home as LucideIcon} aria-label="Home" />);
    expect(screen.getByRole('img', { name: 'Home' })).toBeInTheDocument();
  });

  it('inherits currentColor by default', () => {
    const { container } = render(<Icon icon={Home as LucideIcon} />);
    const svg = container.querySelector('[data-component="mizu-icon"]');
    // Lucide writes the color into the stroke attribute
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('honors a custom size', () => {
    const { container } = render(<Icon icon={Home as LucideIcon} size={32} />);
    const svg = container.querySelector('[data-component="mizu-icon"]') as SVGElement | null;
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('wrapIcon binds a specific glyph and forwards props', () => {
    const HomeIcon = wrapIcon('HomeIcon', Home as LucideIcon);
    render(<HomeIcon aria-label="Go home" size={24} />);
    expect(screen.getByRole('img', { name: 'Go home' })).toHaveAttribute('width', '24');
  });

  it('has no axe violations as a decorative icon next to a labelled control', async () => {
    const { container } = render(
      <button type="button">
        <Icon icon={Home as LucideIcon} />
        Home
      </button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
