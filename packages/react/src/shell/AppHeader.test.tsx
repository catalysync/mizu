import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('renders the brand', () => {
    render(<AppHeader brand="mizu" />);
    expect(screen.getByText('mizu')).toBeInTheDocument();
  });

  it('sets data-component', () => {
    const { container } = render(<AppHeader brand="X" />);
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-app-header');
  });

  it('renders actions', () => {
    render(<AppHeader brand="X" actions={<button>Sign out</button>} />);
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<AppHeader brand="mizu" actions={<button>Menu</button>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
