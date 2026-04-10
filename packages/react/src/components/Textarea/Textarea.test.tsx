import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Enter notes" aria-label="Notes" />);
    expect(screen.getByPlaceholderText('Enter notes')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
