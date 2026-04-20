import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders with an image src', () => {
    render(<Avatar src="/photo.jpg" alt="Ada" />);
    expect(screen.getByAltText('Ada')).toBeInTheDocument();
  });

  it('renders initials when no src', () => {
    render(<Avatar initials="AL" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('renders children as fallback', () => {
    render(<Avatar>JD</Avatar>);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies the sm size', () => {
    const { container } = render(<Avatar initials="A" size="sm" />);
    expect(container.firstChild).toHaveClass('mizu-avatar--sm');
  });

  it('applies the md size', () => {
    const { container } = render(<Avatar initials="A" size="md" />);
    expect(container.firstChild).toHaveClass('mizu-avatar--md');
  });

  it('applies the lg size', () => {
    const { container } = render(<Avatar initials="A" size="lg" />);
    expect(container.firstChild).toHaveClass('mizu-avatar--lg');
  });

  it('applies the xl size', () => {
    const { container } = render(<Avatar initials="A" size="xl" />);
    expect(container.firstChild).toHaveClass('mizu-avatar--xl');
  });

  it('merges custom className', () => {
    const { container } = render(<Avatar initials="A" className="custom" />);
    expect(container.firstChild).toHaveClass('mizu-avatar');
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} initials="A" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('has the mizu-avatar base class', () => {
    const { container } = render(<Avatar initials="X" />);
    expect(container.firstChild).toHaveClass('mizu-avatar');
  });

  it('has no axe violations (initials)', async () => {
    const { container } = render(<Avatar initials="AL" aria-label="Ada Lovelace" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (image)', async () => {
    const { container } = render(<Avatar src="/photo.jpg" alt="Ada Lovelace" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
