import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a nav with previous/next buttons', () => {
    render(<Pagination hasNext hasPrevious label="1–10 of 50" />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('disables previous when hasPrevious is false', () => {
    render(<Pagination hasNext hasPrevious={false} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('renders numbered pages when page/totalPages provided', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('collapses to ellipses when there are many pages', () => {
    render(<Pagination page={10} totalPages={20} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('auto-computes hasPrevious/hasNext from page state', () => {
    render(<Pagination page={1} totalPages={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('clicking next advances the page', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Pagination page={3} totalPages={10} label="21–30 of 100" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
