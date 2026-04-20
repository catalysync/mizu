import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AppContent } from './AppContent';
import { AppHeader } from './AppHeader';
import { AppLayout } from './AppLayout';
import { AppSidebar } from './AppSidebar';

describe('AppLayout', () => {
  it('renders header + sidebar + content', () => {
    render(
      <AppLayout>
        <AppHeader brand="Test" />
        <AppSidebar ariaLabel="Nav">
          <a href="/">Link</a>
        </AppSidebar>
        <AppContent>
          <p>Main content</p>
        </AppContent>
      </AppLayout>,
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('sets data-component', () => {
    const { container } = render(
      <AppLayout>
        <AppContent>X</AppContent>
      </AppLayout>,
    );
    expect(container.firstChild).toHaveAttribute('data-component', 'mizu-app-layout');
  });

  it('applies the mizu-app-layout class', () => {
    const { container } = render(
      <AppLayout>
        <AppContent>X</AppContent>
      </AppLayout>,
    );
    expect(container.firstChild).toHaveClass('mizu-app-layout');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <AppLayout>
        <AppHeader brand="App" />
        <AppSidebar ariaLabel="Navigation">
          <a href="/">Home</a>
        </AppSidebar>
        <AppContent>
          <div>
            <p>Content</p>
          </div>
        </AppContent>
      </AppLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
