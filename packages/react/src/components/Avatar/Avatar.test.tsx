import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('renders a placeholder icon with no props and does not throw', async () => {
    expect(() => render(<Avatar />)).not.toThrow();
    const { container } = render(<Avatar />);
    expect(container.querySelector('.mizu-avatar__icon')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to initials when the image fails to load', () => {
    const { container } = render(<Avatar src="/broken.jpg" alt="Ada" initials="AL" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('falls back to the icon when the image fails and there are no initials', () => {
    const { container } = render(<Avatar src="/broken.jpg" alt="Ada" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(container.querySelector('.mizu-avatar__icon')).toBeInTheDocument();
  });

  it('tries a new src after a previous one failed', () => {
    const { container, rerender } = render(<Avatar src="/broken.jpg" alt="Ada" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    rerender(<Avatar src="/fixed.jpg" alt="Ada" />);
    expect(screen.getByAltText('Ada')).toHaveAttribute('src', '/fixed.jpg');
  });

  describe('missing alt warning', () => {
    afterEach(() => vi.restoreAllMocks());

    it('warns in development when src has no alt', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Avatar src="/photo.jpg" />);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Avatar: src was passed without alt'),
      );
    });

    it('does not warn when alt is an empty string', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Avatar src="/photo.jpg" alt="" />);
      expect(warn).not.toHaveBeenCalled();
    });
  });
});
